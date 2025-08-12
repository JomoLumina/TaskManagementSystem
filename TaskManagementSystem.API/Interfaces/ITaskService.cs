using TaskManagementSystem.API.DTOs;
using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.Interfaces
{
    public interface ITaskService
    {
        Task<TaskItem> CreateAsync(CreateTaskRequest req, Guid creatorId);
        Task<TaskItem?> GetByIdAsync(Guid id);
        Task<IEnumerable<TaskItem>> QueryAsync(Models.TaskStatus? status, Guid? assignee);
        Task<TaskItem> UpdateAsync(Guid id, UpdateTaskRequest req);
        Task DeleteAsync(Guid id);
    }
}
