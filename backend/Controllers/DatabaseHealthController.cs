using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatabaseHealthController : ControllerBase
{
    private readonly PathGuardDbContext _context;

    public DatabaseHealthController(PathGuardDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> CheckDatabase()
    {
        try
        {
            await _context.Database.OpenConnectionAsync();

            await _context.Database.CloseConnectionAsync();

            return Ok(new
            {
                status = "Connected",
                database = "PathGuardDB",
                message = "Successfully connected to Azure SQL Database."
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "Error",
                database = "PathGuardDB",
                exception = ex.GetType().Name,
                message = ex.Message,
                innerException = ex.InnerException?.Message
            });
        }
    }
}