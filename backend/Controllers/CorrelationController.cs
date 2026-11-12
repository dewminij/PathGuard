
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CorrelationController : ControllerBase
{
    private readonly CorrelationService _correlationService;

    public CorrelationController(CorrelationService correlationService)
    {
        _correlationService = correlationService;
    }

    [HttpGet("{normalizedAlertId:int}/candidates")]
    public async Task<IActionResult> GetCandidates(int normalizedAlertId)
    {
        try
        {
            var candidates =
                await _correlationService.GetCorrelationCandidatesAsync(
                    normalizedAlertId);

            return Ok(new
            {
                normalizedAlertId,
                candidateCount = candidates.Count,
                candidates
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
