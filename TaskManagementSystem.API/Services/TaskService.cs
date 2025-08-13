using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.API.Data;
using TaskManagementSystem.API.DTOs;
using TaskManagementSystem.API.Interfaces;
using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _db;
        public TaskService(AppDbContext db) { _db = db; }

        public async Task<TaskItem> CreateAsync(CreateTaskRequest req, Guid creatorId)
        {
            var t = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = req.Title,
                Description = req.Description,
                Priority = req.Priority,
                Status = Models.TaskStatus.TODO,
                AssigneeId = req.AssigneeId,
                CreatorId = creatorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Tasks.Add(t);
            await _db.SaveChangesAsync();
            return t;
        }

        public async Task<TaskItem?> GetByIdAsync(Guid id) => await _db.Tasks.FindAsync(id);

        public async Task<IEnumerable<TaskItem>> QueryAsync(Models.TaskStatus? status, Guid? assignee)
        {
            var q = _db.Tasks.AsQueryable();
            if (status.HasValue) q = q.Where(t => t.Status == status.Value);
            if (assignee.HasValue) q = q.Where(t => t.AssigneeId == assignee.Value);
            return await q.ToListAsync();
        }

        public async Task<TaskItem> UpdateAsync(Guid id, UpdateTaskRequest req)
        {
            var t = await _db.Tasks.FindAsync(id) ?? throw new ApplicationException("Task not found");

            t.Title = req.Title;
            t.Description = req.Description;
            t.Status = req.Status;
            t.Priority = req.Priority;
            t.AssigneeId = req.AssigneeId;
            t.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return t;
        }

        public async Task DeleteAsync(Guid id)
        {
            var t = await _db.Tasks.FindAsync(id) ?? throw new ApplicationException("Task not found");
            _db.Tasks.Remove(t);
            await _db.SaveChangesAsync();
        }
    }
}