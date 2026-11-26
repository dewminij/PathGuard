using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace PathGuard.Tests;

public class AttackPathServiceTests
{
    private static PathGuardDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<PathGuardDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new PathGuardDbContext(options);
    }

    [Fact]
    public async Task GenerateAttackPathAsync_ShouldCreateChronologicalPaths()
    {
        using var context = CreateInMemoryContext();

        var incident = new Incident
        {
            Title = "Test Security Incident",
            Severity = "High",
            Status = "Open"
        };

        context.Incidents.Add(incident);
        await context.SaveChangesAsync();

        var alert1 = new Alert
        {
            Source = "Test",
            EventType = "Brute Force",
            Title = "Multiple failed login attempts",
            Severity = "High",
            Timestamp = new DateTime(2026, 11, 26, 10, 0, 0)
        };

        var alert2 = new Alert
        {
            Source = "Test",
            EventType = "PowerShell Execution",
            Title = "PowerShell activity detected",
            Severity = "Medium",
            Timestamp = new DateTime(2026, 11, 26, 10, 5, 0)
        };

        context.Alerts.AddRange(alert1, alert2);
        await context.SaveChangesAsync();

        context.NormalizedAlerts.AddRange(
            new NormalizedAlert
            {
                AlertId = alert1.AlertId,
                IncidentId = incident.IncidentId,
                Timestamp = alert1.Timestamp,
                Event = "Brute Force",
                Severity = "High",
                MITRETechnique = "T1110"
            },
            new NormalizedAlert
            {
                AlertId = alert2.AlertId,
                IncidentId = incident.IncidentId,
                Timestamp = alert2.Timestamp,
                Event = "PowerShell Execution",
                Severity = "Medium",
                MITRETechnique = "T1059.001"
            }
        );

        await context.SaveChangesAsync();

        var service = new AttackPathService(context);

        var result = await service.GenerateAttackPathAsync(
            incident.IncidentId);

        Assert.Equal(2, result.Count);

        Assert.Equal(1, result[0].Sequence);
        Assert.Equal(2, result[1].Sequence);

        Assert.Equal("Brute Force", result[0].AttackStage);
        Assert.Equal("PowerShell Execution", result[1].AttackStage);

        Assert.Equal("T1110", result[0].MITRETechnique);
        Assert.Equal("T1059.001", result[1].MITRETechnique);

        Assert.Null(result[0].PreviousNode);
        Assert.Equal("PowerShell Execution", result[0].NextNode);

        Assert.Equal("Brute Force", result[1].PreviousNode);
        Assert.Null(result[1].NextNode);
    }

    [Fact]
    public async Task GenerateAttackPathAsync_ShouldNotCreateDuplicates()
    {
        using var context = CreateInMemoryContext();

        var incident = new Incident
        {
            Title = "Idempotency Test Incident",
            Severity = "Medium",
            Status = "Open"
        };

        context.Incidents.Add(incident);
        await context.SaveChangesAsync();

        var alert = new Alert
        {
            Source = "Test",
            EventType = "Unknown Event",
            Title = "Unknown activity",
            Severity = "Medium",
            Timestamp = DateTime.UtcNow
        };

        context.Alerts.Add(alert);
        await context.SaveChangesAsync();

        context.NormalizedAlerts.Add(new NormalizedAlert
        {
            AlertId = alert.AlertId,
            IncidentId = incident.IncidentId,
            Timestamp = alert.Timestamp,
            Event = "Unknown Event",
            Severity = "Medium",
            MITRETechnique = null
        });

        await context.SaveChangesAsync();

        var service = new AttackPathService(context);

        var firstResult = await service.GenerateAttackPathAsync(
            incident.IncidentId);

        var secondResult = await service.GenerateAttackPathAsync(
            incident.IncidentId);

        Assert.Single(firstResult);
        Assert.Single(secondResult);

        Assert.Equal(
            firstResult[0].AttackPathId,
            secondResult[0].AttackPathId);

        Assert.Null(secondResult[0].MITRETechnique);

        Assert.Single(context.AttackPaths);
    }

    [Fact]
    public async Task GenerateAttackPathAsync_ShouldThrow_WhenIncidentDoesNotExist()
    {
        using var context = CreateInMemoryContext();

        var service = new AttackPathService(context);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => service.GenerateAttackPathAsync(999));
    }
}
