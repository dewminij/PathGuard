namespace backend.Models;

public class Report
{
    public int ReportId { get; set; }

    public int? IncidentId { get; set; }

    public string ReportType { get; set; } = string.Empty;

    public int GeneratedByUserId { get; set; }

    public DateTime GeneratedDate { get; set; } = DateTime.UtcNow;

    public string ReportStatus { get; set; } = "Generated";

    public string? FilePath { get; set; }

    public string? Description { get; set; }

    // Navigation properties
    public Incident? Incident { get; set; }

    public User GeneratedByUser { get; set; } = null!;
}