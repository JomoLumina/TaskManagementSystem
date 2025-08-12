namespace TaskManagementSystem.API.Models
{
    public enum TaskStatus { TODO = 1, IN_PROGRESS = 2, DONE = 3}
    public enum TaskPriorty { HIGH = 1, MEDIUM= 2, LOW= 3 }

    public class TaskItem
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public TaskStatus Status { get; set; }
        public TaskPriorty Priority { get; set; }
        public Guid? AssigneeId { get; set; }
        public Guid CreatorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
