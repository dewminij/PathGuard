
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IncidentController : ControllerBase
{
    private readonly IncidentService _incidentService;

    public IncidentController(IncidentService incidentService)
    {
        _incidentService = incidentService;
    }

    [HttpPost("create/{normalizedAlertId:int}")]
    public async Task<IActionResult> CreateIncident(int normalizedAlertId)
    {
        try
        {
            var incident =
                await _incidentService.CreateOrUpdateIncidentAsync(
                    normalizedAlertId);

            if (incident == null)
            {
                return Ok(new
                {
                    message = "No correlated alerts found. No incident was created.",
                    incident = (object?)null
                });
            }

            return Ok(new
            {
                message = "Incident created or updated successfully.",
                incident
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
