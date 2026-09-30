using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class PathGuardDbContext : DbContext
{
    public PathGuardDbContext(DbContextOptions<PathGuardDbContext> options)
        : base(options)
    {
    }

    // Database tables
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<Alert> Alerts { get; set; }
    public DbSet<NormalizedAlert> NormalizedAlerts { get; set; }
    public DbSet<Incident> Incidents { get; set; }
    public DbSet<AttackPath> AttackPaths { get; set; }
    public DbSet<RiskScore> RiskScores { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =========================
        // Seed default roles
        // =========================
        modelBuilder.Entity<Role>().HasData(
    new Role
    {
        RoleId = 1,
        RoleName = "Administrator",
        Description = "Full access to the PathGuard platform.",
        CreatedAt = new DateTime(2026, 9, 6, 10, 13, 51, 976, DateTimeKind.Utc).AddTicks(915)
    },
    new Role
    {
        RoleId = 2,
        RoleName = "Security Analyst",
        Description = "Can monitor alerts, investigate incidents, and manage security operations.",
        CreatedAt = new DateTime(2026, 9, 6, 10, 13, 51, 976, DateTimeKind.Utc).AddTicks(921)
    },
    new Role
    {
        RoleId = 3,
        RoleName = "Viewer",
        Description = "Read-only access to PathGuard security information.",
        CreatedAt = new DateTime(2026, 9, 6, 10, 13, 51, 976, DateTimeKind.Utc).AddTicks(922)
    }
);

        // =========================
        // Role → Users
        // =========================
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        // =========================
        // Asset → Alerts
        // =========================
        modelBuilder.Entity<Alert>()
            .HasOne(a => a.Asset)
            .WithMany(asset => asset.Alerts)
            .HasForeignKey(a => a.AssetId)
            .OnDelete(DeleteBehavior.SetNull);
        
        // =========================
        // Alert → NormalizedAlerts
        // =========================
        modelBuilder.Entity<NormalizedAlert>()
            .HasOne(na => na.Alert)
            .WithMany()
            .HasForeignKey(na => na.AlertId)
            .OnDelete(DeleteBehavior.Cascade);

        // =========================
        // NormalizedAlert → Incident
        // =========================
        modelBuilder.Entity<NormalizedAlert>()
            .HasOne(na => na.Incident)
            .WithMany()
            .HasForeignKey(na => na.IncidentId)
            .OnDelete(DeleteBehavior.SetNull);

        // =========================
        // User → Incidents
        // =========================
        modelBuilder.Entity<Incident>()
            .HasOne(i => i.AssignedToUser)
            .WithMany(u => u.Incidents)
            .HasForeignKey(i => i.AssignedToUserId)
            .OnDelete(DeleteBehavior.SetNull);

        // =========================
        // Incident → AttackPaths
        // =========================
        modelBuilder.Entity<AttackPath>()
            .HasOne(ap => ap.Incident)
            .WithMany(i => i.AttackPaths)
            .HasForeignKey(ap => ap.IncidentId)
            .OnDelete(DeleteBehavior.Cascade);

        // =========================
        // Incident → RiskScores
        // =========================
        modelBuilder.Entity<RiskScore>()
            .HasOne(rs => rs.Incident)
            .WithMany(i => i.RiskScores)
            .HasForeignKey(rs => rs.IncidentId)
            .OnDelete(DeleteBehavior.Cascade);

        // =========================
        // Incident → Reports
        // =========================
        modelBuilder.Entity<Report>()
            .HasOne(r => r.Incident)
            .WithMany(i => i.Reports)
            .HasForeignKey(r => r.IncidentId)
            .OnDelete(DeleteBehavior.SetNull);

        // =========================
        // User → Reports
        // =========================
        modelBuilder.Entity<Report>()
            .HasOne(r => r.GeneratedByUser)
            .WithMany(u => u.Reports)
            .HasForeignKey(r => r.GeneratedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // =========================
        // User → AuditLogs
        // =========================
        modelBuilder.Entity<AuditLog>()
            .HasOne(a => a.User)
            .WithMany(u => u.AuditLogs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // =========================
        // Decimal precision
        // =========================
        modelBuilder.Entity<AttackPath>()
            .Property(ap => ap.ConfidenceScore)
            .HasPrecision(5, 2);

        modelBuilder.Entity<RiskScore>()
            .Property(rs => rs.RiskScoreValue)
            .HasPrecision(5, 2);

        modelBuilder.Entity<RiskScore>()
            .Property(rs => rs.BusinessImpact)
            .HasPrecision(5, 2);

        modelBuilder.Entity<RiskScore>()
            .Property(rs => rs.Likelihood)
            .HasPrecision(5, 2);

        modelBuilder.Entity<RiskScore>()
            .Property(rs => rs.ConfidenceScore)
            .HasPrecision(5, 2);

        // =========================
        // Indexes and Constraints
        // =========================
        modelBuilder.Entity<Role>()
            .HasIndex(r => r.RoleName)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.AzureObjectId)
            .IsUnique();

        modelBuilder.Entity<Alert>()
            .HasIndex(a => a.Timestamp);

        modelBuilder.Entity<Alert>()
            .HasIndex(a => a.Status);

        modelBuilder.Entity<Incident>()
            .HasIndex(i => i.Status);

        modelBuilder.Entity<Incident>()
            .HasIndex(i => i.Severity);

        modelBuilder.Entity<AuditLog>()
            .HasIndex(a => a.Timestamp);

        modelBuilder.Entity<NormalizedAlert>()
            .HasIndex(na => na.Timestamp);

        modelBuilder.Entity<NormalizedAlert>()
            .HasIndex(na => na.Severity);

        modelBuilder.Entity<NormalizedAlert>()
            .HasIndex(na => na.Status);

        modelBuilder.Entity<NormalizedAlert>()
            .HasIndex(na => na.AlertId);

        modelBuilder.Entity<NormalizedAlert>()
            .HasIndex(na => na.IncidentId);
    }
}