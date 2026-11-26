
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class IncidentService
{
    private readonly PathGuardDbContext _context;
    private readonly CorrelationService _correlationService;

    public IncidentService(
        PathGuardDbContext context,
        CorrelationService correlationService)
    {
        _context = context;
        _correlationService = correlationService;
    }

    public async Task<Incident?> CreateOrUpdateIncidentAsync(
        int normalizedAlertId)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        var currentAlert = await _context.NormalizedAlerts
            .FirstOrDefaultAsync(a =>
                a.NormalizedAlertId == normalizedAlertId);

        if (currentAlert == null)
        {
            throw new KeyNotFoundException(
                $"Normalized alert {normalizedAlertId} was not found.");
        }

        // Find alerts related to the current alert.
        var candidates =
            await _correlationService.GetCorrelationCandidatesAsync(
                normalizedAlertId);

        // An isolated alert should not create an incident.
        if (candidates.Count == 0 && currentAlert.IncidentId == null)
        {
            await transaction.RollbackAsync();
            return null;
        }

        // Include the current alert and its correlation candidates.
        var relatedAlertIds = candidates
            .Select(a => a.NormalizedAlertId)
            .Append(currentAlert.NormalizedAlertId)
            .Distinct()
            .ToList();

        var relatedAlerts = await _context.NormalizedAlerts
            .Where(a => relatedAlertIds.Contains(a.NormalizedAlertId))
            .ToListAsync();

        // Identify incidents already associated with these alerts.
        var existingIncidentIds = relatedAlerts
            .Where(a => a.IncidentId != null)
            .Select(a => a.IncidentId!.Value)
            .Distinct()
            .ToList();

        // Do not automatically merge separate incidents.
        if (existingIncidentIds.Count > 1)
        {
            throw new InvalidOperationException(
                "Related alerts belong to multiple incidents. " +
                "Manual investigation is required.");
        }

        Incident incident;

        if (existingIncidentIds.Count == 1)
        {
            // Reuse the existing incident.
            var existingIncidentId = existingIncidentIds[0];

            incident = await _context.Incidents
                .FirstAsync(i =>
                    i.IncidentId == existingIncidentId);
        }
        else
        {
            // Create a new incident.
            incident = new Incident
            {
                Title = $"Correlated security activity - {currentAlert.Event}",
                Description =
                    $"Multiple related security alerts detected. " +
                    $"Source IP: {currentAlert.SourceIP}",
                Severity = GetHighestSeverity(relatedAlerts),
                Status = "Open",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Incidents.Add(incident);
            await _context.SaveChangesAsync();
        }

        // Associate all currently unassigned related alerts.
        foreach (var alert in relatedAlerts)
        {
            if (alert.IncidentId == null)
            {
                alert.IncidentId = incident.IncidentId;
            }
        }

        // Update the incident's severity if necessary.
        if (GetSeverityRank(GetHighestSeverity(relatedAlerts)) >
            GetSeverityRank(incident.Severity))
        {
            incident.Severity = GetHighestSeverity(relatedAlerts);
        }

        incident.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return incident;
    }

    private static string GetHighestSeverity(
        List<NormalizedAlert> alerts)
    {
        return alerts
            .Select(a => a.Severity)
            .OrderByDescending(GetSeverityRank)
            .FirstOrDefault() ?? "Medium";
    }

    private static int GetSeverityRank(string severity)
    {
        return severity.ToLowerInvariant() switch
        {
            "critical" => 4,
            "high" => 3,
            "medium" => 2,
            "low" => 1,
            _ => 0
        };
    }
}
