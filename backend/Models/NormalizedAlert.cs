namespace backend.Models;

public class NormalizedAlert
{
    public int NormalizedAlertId { get; set; }

    // Original alert
    public int AlertId { get; set; }

    // Standardized security information
    public DateTime Timestamp { get; set; }

    public string? SourceIP { get; set; }

    public string? DestinationIP { get; set; }

    public string? Hostname { get; set; }

    public string Event { get; set; } = string.Empty;

    public string Severity { get; set; } = "Medium";

    public string? MITRETechnique { get; set; }

    public string Status { get; set; } = "New";

    // Incident correlation
    public int? IncidentId { get; set; }

    // Navigation properties
    public Alert? Alert { get; set; }

    public Incident? Incident { get; set; }
}