namespace backend.Models;

public class Asset
{
    public int AssetId { get; set; }

    public string AssetName { get; set; } = string.Empty;

    public string? Hostname { get; set; }

    public string? IPAddress { get; set; }

    public string AssetType { get; set; } = string.Empty;

    public string? OperatingSystem { get; set; }

    public string Criticality { get; set; } = "Medium";

    public string? Environment { get; set; }

    public string? Owner { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<Alert> Alerts { get; set; } = new List<Alert>();
}