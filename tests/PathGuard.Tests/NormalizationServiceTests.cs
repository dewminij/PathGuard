using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace PathGuard.Tests;

public class NormalizationServiceTests
{
    private static PathGuardDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<PathGuardDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new PathGuardDbContext(options);
    }

    [Fact]
    public async Task NormalizeAlertAsync_MapsPowerShellTechnique()
    {
        // Arrange
        await using var context = CreateInMemoryContext();

        var alert = new Alert
        {
            ExternalAlertId = "TEST-POWERSHELL-001",
            Source = "PathGuard-Test",
            EventType = "Suspicious Execution",
            Title = "Suspicious PowerShell execution detected",
            Description = "powershell.exe executed an encoded command",
            Severity = "High",
            Timestamp = DateTime.UtcNow,
            Status = "New"
        };

        context.Alerts.Add(alert);
        await context.SaveChangesAsync();

        var mappingService = new MitreMappingService();
        var normalizationService = new NormalizationService(
            context,
            mappingService
        );

        // Act
        var result = await normalizationService.NormalizeAlertAsync(
            alert.AlertId
        );

        // Assert
        Assert.NotNull(result);
        Assert.Equal("T1059.001", result.MITRETechnique);

        var savedAlert = await context.NormalizedAlerts
            .FirstOrDefaultAsync(a => a.AlertId == alert.AlertId);

        Assert.NotNull(savedAlert);
        Assert.Equal("T1059.001", savedAlert.MITRETechnique);
    }

    [Fact]
    public async Task NormalizeAlertAsync_LeavesUnknownTechniqueNull()
    {
        // Arrange
        await using var context = CreateInMemoryContext();

        var alert = new Alert
        {
            ExternalAlertId = "TEST-UNKNOWN-001",
            Source = "PathGuard-Test",
            EventType = "Application Monitoring",
            Title = "Unusual application behaviour",
            Description = "An application generated an unexpected event",
            Severity = "Medium",
            Timestamp = DateTime.UtcNow,
            Status = "New"
        };

        context.Alerts.Add(alert);
        await context.SaveChangesAsync();

        var mappingService = new MitreMappingService();
        var normalizationService = new NormalizationService(
            context,
            mappingService
        );

        // Act
        var result = await normalizationService.NormalizeAlertAsync(
            alert.AlertId
        );

        // Assert
        Assert.NotNull(result);
        Assert.Null(result.MITRETechnique);

        var savedAlert = await context.NormalizedAlerts
            .FirstOrDefaultAsync(a => a.AlertId == alert.AlertId);

        Assert.NotNull(savedAlert);
        Assert.Null(savedAlert.MITRETechnique);
    }

    [Fact]
    public async Task NormalizeAlertAsync_DoesNotCreateDuplicateRecords()
    {
        // Arrange
        await using var context = CreateInMemoryContext();

        var alert = new Alert
        {
            ExternalAlertId = "TEST-IDEMPOTENCY-001",
            Source = "PathGuard-Test",
            EventType = "Brute Force",
            Title = "Multiple failed login attempts",
            Description = "Repeated failed login attempts detected",
            Severity = "High",
            Timestamp = DateTime.UtcNow,
            Status = "New"
        };

        context.Alerts.Add(alert);
        await context.SaveChangesAsync();

        var mappingService = new MitreMappingService();
        var normalizationService = new NormalizationService(
            context,
            mappingService
        );

        // Act
        var firstResult = await normalizationService.NormalizeAlertAsync(
            alert.AlertId
        );

        var secondResult = await normalizationService.NormalizeAlertAsync(
            alert.AlertId
        );

        // Assert
        Assert.NotNull(firstResult);
        Assert.NotNull(secondResult);

        Assert.Equal(
            firstResult.NormalizedAlertId,
            secondResult.NormalizedAlertId
        );

        var recordCount = await context.NormalizedAlerts.CountAsync();

        Assert.Equal(1, recordCount);
    }
}
