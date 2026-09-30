//test the roles with RBAC policies, each user will get access for one role only, for example if dewmini jayasinghe is a global administrator, she will only get access to the global administrator endpoint and not the other endpoints. This is because the user is only a member of one group in Azure AD. The other endpoints will return a 403 forbidden error.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RbacTestController : ControllerBase
{
    [Authorize(Policy = "PathGuardReader")]
    [HttpGet("reader")]
    public IActionResult ReaderTest()
    {
        return Ok(new
        {
            message = "Reader access granted."
        });
    }

    [Authorize(Policy = "PathGuardOperator")]
    [HttpGet("operator")]
    public IActionResult OperatorTest()
    {
        return Ok(new
        {
            message = "Operator access granted."
        });
    }

    [Authorize(Policy = "PathGuardAdministrator")]
    [HttpGet("administrator")]
    public IActionResult AdministratorTest()
    {
        return Ok(new
        {
            message = "Administrator access granted."
        });
    }

    [Authorize(Policy = "PathGuardGlobalAdministrator")]
    [HttpGet("global-administrator")]
    public IActionResult GlobalAdministratorTest()
    {
        return Ok(new
        {
            message = "Global Administrator access granted."
        });
    }
}