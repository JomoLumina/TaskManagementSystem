using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TaskManagementSystem.API.Interfaces;

namespace TaskManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _users;
        private readonly ILogger _logger;
        public UsersController(IUserService users, ILogger logger)
        {
            _users = users;
            _logger = logger;
        }

        // GET /api/users
        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var res = await _users.GetAllAsync();
                if (res == null) return NoContent();
                return Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving All Users");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // GET /api/users/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "ADMIN, USER")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var res = await _users.GetByIdAsync(id);
                if (res == null) return NotFound();
                return Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving User with id {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}