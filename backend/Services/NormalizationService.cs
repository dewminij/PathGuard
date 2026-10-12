/* 
12/10/2026 

for the first version we will jsut map few alerts into MITTRE framework and try out our normalization part

*/

using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace backend.Services;

public class NormalizationService
{
    private readonly PathGuardDbContext _context;

    public NormalizationService(PathGuardDbContext context)
    {
        _context = context;
    }

    public async Task<NormalizedAlert?> NormalizeAlertAsync(int alertId)
    {
        var alert = await _context.Alerts
            .FirstOrDefaultAsync(a => a.AlertId == alertId);

        if (alert == null)
        {
            return null;
        }

        var existingNormalizedAlert = await _context.NormalizedAlerts
            .FirstOrDefaultAsync(a => a.AlertId == alertId);

        if (existingNormalizedAlert != null)
        {
            return existingNormalizedAlert;
        }

        var searchableText = string.Join(
            " ",
            alert.Title,
            alert.EventType,
            alert.Description ?? ""
        );

        var normalizedAlert = new NormalizedAlert
        {
            AlertId = alert.AlertId,
            Timestamp = alert.Timestamp,
            SourceIP = ExtractIp(searchableText, "srcip"),
            DestinationIP = ExtractIp(searchableText, "dstip"),
            Hostname = ExtractHostname(searchableText),
            Event = string.IsNullOrWhiteSpace(alert.EventType)
                ? alert.Title
                : alert.EventType,
            Severity = NormalizeSeverity(alert.Severity),
            MITRETechnique = MapMitreTechnique(searchableText),
            Status = string.IsNullOrWhiteSpace(alert.Status)
                ? "New"
                : alert.Status
        };

        _context.NormalizedAlerts.Add(normalizedAlert);
        await _context.SaveChangesAsync();

        return normalizedAlert;
    }

    private static string NormalizeSeverity(string? severity)
    {
        if (string.IsNullOrWhiteSpace(severity))
        {
            return "Medium";
        }

        return severity.Trim().ToLowerInvariant() switch
        {
            "critical" or "emergency" => "Critical",
            "high" or "error" => "High",
            "medium" or "warning" or "moderate" => "Medium",
            "low" or "info" or "informational" => "Low",
            _ => "Medium"
        };
    }

    private static string? MapMitreTechnique(string text)
    {
        if (Regex.IsMatch(
            text,
            @"brute[\s_-]*force|failed login|multiple failed logins",
            RegexOptions.IgnoreCase))
        {
            return "T1110";
        }

        if (Regex.IsMatch(
            text,
            @"powershell",
            RegexOptions.IgnoreCase))
        {
            return "T1059.001";
        }

        return null;
    }

    private static string? ExtractIp(string text, string fieldName)
    {
        var pattern =
            $@"[""']?{Regex.Escape(fieldName)}[""']?\s*[:=]\s*[""']?((?:\d{{1,3}}\.){{3}}\d{{1,3}})";

        var match = Regex.Match(
            text,
            pattern,
            RegexOptions.IgnoreCase
        );

        if (!match.Success)
        {
            return null;
        }

        var candidate = match.Groups[1].Value;

        return System.Net.IPAddress.TryParse(candidate, out var address)
            && address.AddressFamily ==
                System.Net.Sockets.AddressFamily.InterNetwork
            ? address.ToString()
            : null;
    }

    private static string? ExtractHostname(string text)
    {
        var match = Regex.Match(
            text,
            @"""(?:hostname|host)""\s*:\s*""([^""]+)""",
            RegexOptions.IgnoreCase
        );

        return match.Success ? match.Groups[1].Value : null;
    }
}
