using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.DTOs
{
    public record CreateTaskRequest(string Title, string Description, TaskPriorty Priority, Guid? AssigneeId);
    public record UpdateTaskRequest(string Title, string Description, Models.TaskStatus Status, TaskPriorty Priority, Guid? AssigneeId);
}
