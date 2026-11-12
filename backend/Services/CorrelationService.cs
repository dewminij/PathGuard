
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class CorrelationService
{
    private readonly PathGuardDbContext _context;

    public CorrelationService(PathGuardDbContext context)
    {
        _context = context;
    }

    public async Task<List<NormalizedAlert>> GetCorrelationCandidatesAsync(
        int normalizedAlertId)
    {
        var currentAlert = await _context.NormalizedAlerts
            .AsNoTracking()
            .FirstOrDefaultAsync(a =>
                a.NormalizedAlertId == normalizedAlertId);

        if (currentAlert == null)
        {
            throw new KeyNotFoundException(
                $"Normalized alert {normalizedAlertId} was not found.");
        }

        var windowStart = currentAlert.Timestamp.AddMinutes(-10);
        var windowEnd = currentAlert.Timestamp.AddMinutes(10);

        var candidates = await _context.NormalizedAlerts
            .AsNoTracking()
            .Where(a =>
                a.NormalizedAlertId != currentAlert.NormalizedAlertId &&
                a.Timestamp >= windowStart &&
                a.Timestamp <= windowEnd &&
                a.SourceIP != null &&
                a.SourceIP == currentAlert.SourceIP)
            .OrderBy(a => a.Timestamp)
            .ToListAsync();

        return candidates
            .Where(candidate =>
                HasCompatibleEvent(currentAlert.Event, candidate.Event))
            .ToList();
    }

    private static bool HasCompatibleEvent(
        string firstEvent,
        string secondEvent)
    {
        var first = firstEvent.Trim().ToLowerInvariant();
        var second = secondEvent.Trim().ToLowerInvariant();

        if (first.Length == 0 || second.Length == 0)
        {
            return false;
        }

        // First version: allow alerts with the same event type,
        // or two events that both indicate brute-force activity.
        if (first == second)
        {
            return true;
        }

        return IsBruteForceEvent(first) &&
               IsBruteForceEvent(second);
    }

    private static bool IsBruteForceEvent(string value)
    {
        return value.Contains("brute force") ||
               value.Contains("brute-force") ||
               value.Contains("failed login") ||
               value.Contains("failed logins");
    }
}
