namespace backend.Models;

public class Alert
{
    public int AlertId { get; set; }

    public string? ExternalAlertId { get; set; }

    public string Source { get; set; } = string.Empty;

    public string EventType { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Severity { get; set; } = "Medium";

    public int? AssetId { get; set; }

    public DateTime Timestamp { get; set; }

    public string Status { get; set; } = "New";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Asset? Asset { get; set; }
}