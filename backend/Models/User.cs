namespace backend.Models;

public class User
{
    public int UserId { get; set; }

    public string? AzureObjectId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public int RoleId { get; set; }

    public bool MFAStatus { get; set; } = false;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public Role Role { get; set; } = null!;

    public ICollection<Incident> Incidents { get; set; } = new List<Incident>();

    public ICollection<Report> Reports { get; set; } = new List<Report>();

    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}