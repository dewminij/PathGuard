using backend.Services;

namespace PathGuard.Tests;

public class MitreMappingServiceTests
{
    private readonly MitreMappingService _service = new();

    [Theory]
    [InlineData("Brute Force", "Multiple failed login attempts", null, "T1110")]
    [InlineData("Suspicious Execution", "PowerShell execution detected", null, "T1059.001")]
    [InlineData("Process Execution", "cmd.exe started", null, "T1059.003")]
    [InlineData("Network Security", "Port scanning detected", null, "T1046")]
    [InlineData("Endpoint Security", "Credential dumping detected", null, "T1003")]
    [InlineData("Email Security", "Phishing email detected", null, "T1566")]
    [InlineData("Application Monitoring", "Unusual application behaviour", null, null)]
    public void MapTechnique_ReturnsExpectedTechnique(
        string eventType,
        string title,
        string? description,
        string? expectedTechnique)
    {
        // Arrange
        var service = new MitreMappingService();

        // Act
        var result = service.MapTechnique(
            eventType,
            title,
            description
        );

        // Assert
        Assert.Equal(expectedTechnique, result);
    }

    [Theory]
    [InlineData("BRUTE FORCE", "MULTIPLE FAILED LOGIN ATTEMPTS", "T1110")]
    [InlineData("EXECUTION", "POWERSHELL DETECTED", "T1059.001")]
    [InlineData("NETWORK", "PORT SCANNING DETECTED", "T1046")]
    public void MapTechnique_IsCaseInsensitive(
        string eventType,
        string title,
        string expectedTechnique)
    {
        // Act
        var result = _service.MapTechnique(
            eventType,
            title,
            null
        );

        // Assert
        Assert.Equal(expectedTechnique, result);
    }
}
