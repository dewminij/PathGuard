//expose services thorugh the API and requires the entra authenticated user also
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AlertController : ControllerBase
{
    private readonly AlertService _alertService;

    public AlertController(AlertService alertService)
    {
        _alertService = alertService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadAlert([FromBody] AlertImportDto dto)
    {
        var alert = await _alertService.CreateAlertAsync(dto);

        return CreatedAtAction(
            nameof(GetAlertById),
            new { id = alert.AlertId },
            alert
        );
    }

    [HttpGet]
    public async Task<IActionResult> GetAlerts()
    {
        var alerts = await _alertService.GetAlertsAsync();

        return Ok(alerts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAlertById(int id)
    {
        var alert = await _alertService.GetAlertByIdAsync(id);

        if (alert == null)
        {
            return NotFound(new
            {
                message = "Alert not found."
            });
        }

        return Ok(alert);
    }
}