using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthTestController : ControllerBase
{
    [Authorize]
    [HttpGet]
    public IActionResult Get()
    {
        var name = User.FindFirstValue("name");
        var email = User.FindFirstValue("preferred_username");

        return Ok(new
        {
            message = "PathGuard authentication successful.",
            name,
            email
        });
    }
}