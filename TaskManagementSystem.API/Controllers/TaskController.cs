using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using TaskManagementSystem.API.DTOs;
using TaskManagementSystem.API.Models;
using TaskManagementSystem.API.Interfaces;

namespace TaskManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _tasks;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskService tasks, ILogger<TasksController> logger)
        {
            _tasks = tasks;
            _logger = logger;
        }

        // GET /api/tasks?status=&assignee=
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Query([FromQuery] Models.TaskStatus? status, [FromQuery] Guid? assignee)
        {
            try
            {
                var res = await _tasks.QueryAsync(status, assignee);
                if (res == null) return NoContent();
                return Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error querying tasks with status {Status} and assignee {Assignee}", status, assignee);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // POST /api/tasks
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateTaskRequest req)
        {
            try
            {
                var creatorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var task = await _tasks.CreateAsync(req, creatorId);
                return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating task by user {CreatorId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var task = await _tasks.GetByIdAsync(id);
                if (task == null) return NotFound();
                return Ok(task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving task with id {TaskId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // PUT /api/tasks/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, UpdateTaskRequest req)
        {
            try
            {
                var updated = await _tasks.UpdateAsync(id, req);
                return Ok(updated);
            }
            catch (ApplicationException ex)
            {
                _logger.LogWarning(ex, "Validation error updating task {TaskId}", id);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating task {TaskId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // DELETE /api/tasks/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _tasks.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting task {TaskId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
