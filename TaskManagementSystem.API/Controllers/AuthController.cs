using Microsoft.AspNetCore.Mvc;
using TaskManagementSystem.API.DTOs;
using TaskManagementSystem.API.Interfaces;

namespace TaskManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        public AuthController(IAuthService auth) { _auth = auth; }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest req)
        {
            try
            {
                var res = await _auth.RegisterAsync(req);
                return Ok(res);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest req)
        {
            try
            {
                var res = await _auth.LoginAsync(req);
                return Ok(res);
            }
            catch (ApplicationException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}