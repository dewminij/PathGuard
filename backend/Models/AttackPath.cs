namespace backend.Models;

public class AttackPath
{
    public int AttackPathId { get; set; }

    public int IncidentId { get; set; }

    public string AttackStage { get; set; } = string.Empty;

    public string? MITRETechnique { get; set; }

    public string? PreviousNode { get; set; }

    public string? NextNode { get; set; }

    public decimal? ConfidenceScore { get; set; }

    public int Sequence { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Incident Incident { get; set; } = null!;
}