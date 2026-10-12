
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NormalizationController : ControllerBase
{
    private readonly NormalizationService _normalizationService;

    public NormalizationController(
        NormalizationService normalizationService)
    {
        _normalizationService = normalizationService;
    }

    [HttpPost("{alertId:int}")]
    public async Task<IActionResult> NormalizeAlert(int alertId)
    {
        var normalizedAlert =
            await _normalizationService.NormalizeAlertAsync(alertId);

        if (normalizedAlert == null)
        {
            return NotFound(new
            {
                message = $"Alert with ID {alertId} was not found."
            });
        }

        return Ok(normalizedAlert);
    }
}
