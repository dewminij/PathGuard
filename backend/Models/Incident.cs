namespace backend.Models;

public class Incident
{
    public int IncidentId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Severity { get; set; } = "Medium";

    public string Status { get; set; } = "Open";

    public int? AssignedToUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }

    // Navigation properties
    public User? AssignedToUser { get; set; }

    public ICollection<AttackPath> AttackPaths { get; set; } = new List<AttackPath>();

    public ICollection<RiskScore> RiskScores { get; set; } = new List<RiskScore>();

    public ICollection<Report> Reports { get; set; } = new List<Report>();
}