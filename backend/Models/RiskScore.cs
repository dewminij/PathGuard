namespace backend.Models;

public class RiskScore
{
    public int RiskScoreId { get; set; }

    public int IncidentId { get; set; }

    public decimal RiskScoreValue { get; set; }

    public string RiskLevel { get; set; } = "Medium";

    public string Priority { get; set; } = "P3";

    public decimal? BusinessImpact { get; set; }

    public decimal? Likelihood { get; set; }

    public decimal? ConfidenceScore { get; set; }

    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Incident Incident { get; set; } = null!;
}