//creating and retrieving alerts API
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AlertService
{
    private readonly PathGuardDbContext _context;

    public AlertService(PathGuardDbContext context)
    {
        _context = context;
    }

    /*public async Task<Alert> CreateAlertAsync(AlertImportDto dto)
    {
        var alert = new Alert
        {
            ExternalAlertId = dto.ExternalAlertId,
            Source = dto.Source,
            EventType = dto.EventType,
            Title = dto.Title,
            Description = dto.Description,
            Severity = dto.Severity,
            AssetId = dto.AssetId,
            Timestamp = dto.Timestamp,
            Status = dto.Status
        };

        _context.Alerts.Add(alert);
        await _context.SaveChangesAsync();

        return alert;
    }

    */
// alert normalization which did on 12/10/2026
//public async Task<Alert> CreateAlertAsync(AlertImportDto dto)
public async Task<(Alert Alert, bool WasCreated)> CreateAlertAsync(AlertImportDto dto)
{
    if (!string.IsNullOrWhiteSpace(dto.ExternalAlertId))
    {
        var externalAlertId = dto.ExternalAlertId.Trim();
        var source = dto.Source.Trim();

        var existingAlert = await _context.Alerts
            .FirstOrDefaultAsync(a =>
                a.ExternalAlertId == externalAlertId &&
                a.Source == source);

        if (existingAlert != null)
        {
            return (existingAlert, false);
        }
    }

    var alert = new Alert
    {
        ExternalAlertId = string.IsNullOrWhiteSpace(dto.ExternalAlertId)
            ? null
            : dto.ExternalAlertId.Trim(),
        Source = dto.Source.Trim(),
        EventType = dto.EventType,
        Title = dto.Title,
        Description = dto.Description,
        Severity = dto.Severity,
        AssetId = dto.AssetId,
        Timestamp = dto.Timestamp,
        Status = dto.Status
    };

    _context.Alerts.Add(alert);
    await _context.SaveChangesAsync();

    return (alert , true);
}

    public async Task<List<Alert>> GetAlertsAsync()
    {
        return await _context.Alerts
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<Alert?> GetAlertByIdAsync(int id)
    {
        return await _context.Alerts
            .FirstOrDefaultAsync(a => a.AlertId == id);
    }
}