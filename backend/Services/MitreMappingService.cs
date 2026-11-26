
namespace backend.Services;

public class MitreMappingService
{
    public string? MapTechnique(
        string? eventType,
        string? title,
        string? description)
    {
        // Combine available alert information for analysis.
        var searchableText = $"{eventType} {title} {description}"
            .ToLowerInvariant();

        // T1110 - Brute Force
        if (searchableText.Contains("brute force") ||
            searchableText.Contains("brute-force") ||
            searchableText.Contains("password guessing") ||
            searchableText.Contains("credential guessing") ||
            searchableText.Contains("multiple failed login attempts") ||
            searchableText.Contains("repeated failed login attempts"))
        {
            return "T1110";
        }

        // T1059.001 - PowerShell
        if (searchableText.Contains("powershell") ||
            searchableText.Contains("pwsh.exe"))
        {
            return "T1059.001";
        }

        // T1059.003 - Windows Command Shell
        if (searchableText.Contains("cmd.exe") ||
            searchableText.Contains("windows command shell"))
        {
            return "T1059.003";
        }

        // T1046 - Network Service Discovery
        if (searchableText.Contains("port scanning") ||
            searchableText.Contains("port scan detected") ||
            searchableText.Contains("network service scanning"))
        {
            return "T1046";
        }

        // T1003 - OS Credential Dumping
        if (searchableText.Contains("credential dumping") ||
            searchableText.Contains("lsass memory dump") ||
            searchableText.Contains("lsass dumping"))
        {
            return "T1003";
        }

        // T1566 - Phishing
        if (searchableText.Contains("phishing") ||
            searchableText.Contains("spearphishing"))
        {
            return "T1566";
        }

        // No sufficiently specific matching rule found.
        return null;
    }
}
