using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (!context.Users.Any())
            {
                var users = new List<User>
                                    {
                                        new User { Username = "Admin", Email = "admin@example.com", Password = BCrypt.Net.BCrypt.HashPassword("Admin@123"), Role = Role.ADMIN, CreatedAt = DateTime.UtcNow},
                                        new User { Username = "User", Email = "user@example.com", Password = BCrypt.Net.BCrypt.HashPassword("User@123"), Role = Role.USER, CreatedAt = DateTime.UtcNow                                        },
                                      };

                context.Users.AddRange(users);
                context.SaveChanges();
            }

            if (!context.Tasks.Any())
            {
                var admin = context.Users.First(u => u.Role == Role.ADMIN);
                var user = context.Users.First(u => u.Role == Role.USER);

                var tasks = new List<TaskItem>
                                {
                                    new TaskItem
                                    {
                                        Title = "Set up project structure",
                                        Description = "Initialize project with API and UI",
                                        Status = Models.TaskStatus.IN_PROGRESS,
                                        Priority = TaskPriorty.HIGH,
                                        CreatorId = admin.Id,
                                        AssigneeId = user.Id,
                                        CreatedAt = DateTime.UtcNow
                                    },
                                    new TaskItem
                                    {
                                        Title = "Implement login endpoint",
                                        Description = "Create secure login logic",
                                        Status = Models.TaskStatus.TODO,
                                        Priority = TaskPriorty.MEDIUM,
                                        CreatorId = admin.Id,
                                        AssigneeId = user.Id,
                                        CreatedAt = DateTime.UtcNow
                                    },
                                    new TaskItem
                                    {
                                        Title = "Create registration endpoint",
                                        Description = "Allow users to register accounts",
                                        Status = Models.TaskStatus.TODO,
                                        Priority = TaskPriorty.MEDIUM,
                                        CreatorId = user.Id,
                                        AssigneeId = user.Id,
                                        CreatedAt = DateTime.UtcNow
                                    },
                                    new TaskItem
                                    {
                                        Title = "Design database schema",
                                        Description = "Create models and relationships",
                                        Status = Models.TaskStatus.DONE,
                                        Priority = TaskPriorty.HIGH,
                                        CreatorId = admin.Id,
                                        AssigneeId = admin.Id,
                                        CreatedAt = DateTime.UtcNow
                                    },
                                    new TaskItem
                                    {
                                        Title = "Implement task CRUD API",
                                        Description = "Create endpoints to manage tasks",
                                        Status = Models.TaskStatus.IN_PROGRESS,
                                        Priority = TaskPriorty.HIGH,
                                        CreatorId = admin.Id,
                                        AssigneeId = user.Id,
                                        CreatedAt = DateTime.UtcNow
                                    },
                                    new TaskItem
                                    {
                                        Title = "Set up authentication middleware",
                                        Description = "Configure JWT authentication",
                                        Status = Models.TaskStatus.TODO,
                                        Priority = TaskPriorty.HIGH,
                                        CreatorId = admin.Id,
                                        AssigneeId = admin.Id,
                                        CreatedAt = DateTime.UtcNow
                                    },
                                    new TaskItem
                                    {
                                        Title = "Create frontend login page",
                                        Description = "Design and implement login UI",
                                        Status = Models.TaskStatus.TODO,
                                        Priority = TaskPriorty.MEDIUM,
                                        CreatorId = admin.Id,
                                        AssigneeId = user.Id,
                                        CreatedAt = DateTime.UtcNow
                                    },
                                    new TaskItem
                                    {
                                        Title = "Write unit tests for services",
                                        Description = "Ensure code quality with tests",
                                        Status = Models.TaskStatus.TODO,
                                        Priority = TaskPriorty.LOW,
                                        CreatorId = admin.Id,
                                        AssigneeId = user.Id,
                                        CreatedAt = DateTime.UtcNow
                                    },
                                    new TaskItem
                                    {
                                        Title = "Deploy to staging environment",
                                        Description = "Prepare and deploy build for testing",
                                        Status = Models.TaskStatus.TODO,
                                        Priority = TaskPriorty.MEDIUM,
                                        CreatorId = admin.Id,
                                        AssigneeId = user.Id,
                                        CreatedAt = DateTime.UtcNow
                                    }
                                };

                context.Tasks.AddRange(tasks);
                context.SaveChanges();

            }
        }
    }
}
