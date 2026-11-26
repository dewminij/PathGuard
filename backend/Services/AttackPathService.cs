using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AttackPathService
{
    private readonly PathGuardDbContext _context;

    public AttackPathService(PathGuardDbContext context)
    {
        _context = context;
    }

    public async Task<List<AttackPath>> GenerateAttackPathAsync(
        int incidentId)
    {
        // Check whether the incident exists.
        var incidentExists = await _context.Incidents
            .AnyAsync(i => i.IncidentId == incidentId);

        if (!incidentExists)
        {
            throw new KeyNotFoundException(
                $"Incident with ID {incidentId} was not found.");
        }

        // Prevent duplicate attack paths on repeated requests.
        var existingPaths = await _context.AttackPaths
            .Where(p => p.IncidentId == incidentId)
            .OrderBy(p => p.Sequence)
            .ToListAsync();

        if (existingPaths.Count > 0)
        {
            return existingPaths;
        }

        // Retrieve normalized alerts associated with this incident.
        var alerts = await _context.NormalizedAlerts
            .Where(a => a.IncidentId == incidentId)
            .OrderBy(a => a.Timestamp)
            .ThenBy(a => a.NormalizedAlertId)
            .ToListAsync();

        var attackPaths = new List<AttackPath>();

        for (int i = 0; i < alerts.Count; i++)
        {
            var currentAlert = alerts[i];

            attackPaths.Add(new AttackPath
            {
                IncidentId = incidentId,
                AttackStage = currentAlert.Event,
                MITRETechnique = currentAlert.MITRETechnique,
                PreviousNode = i > 0
                    ? alerts[i - 1].Event
                    : null,
                NextNode = i < alerts.Count - 1
                    ? alerts[i + 1].Event
                    : null,
                Sequence = i + 1,
                ConfidenceScore = null
            });
        }

        _context.AttackPaths.AddRange(attackPaths);

        await _context.SaveChangesAsync();

        return attackPaths;
    }
}
