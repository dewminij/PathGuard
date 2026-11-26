using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttackPathController : ControllerBase
{
    private readonly AttackPathService _attackPathService;

    public AttackPathController(AttackPathService attackPathService)
    {
        _attackPathService = attackPathService;
    }

    [HttpPost("{incidentId:int}/generate")]
    public async Task<IActionResult> GenerateAttackPath(int incidentId)
    {
        try
        {
            var attackPaths =
                await _attackPathService.GenerateAttackPathAsync(incidentId);

            return Ok(attackPaths);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }
}
