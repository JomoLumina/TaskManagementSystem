using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (!context.Users.Any())
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@local.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = Role.ADMIN,
                    CreatedAt = DateTime.UtcNow
                };

                var normalUser = new User
                {
                    Username = "jomo",
                    Email = "luminajomo@gmail.com",
                    Password = BCrypt.Net.BCrypt.HashPassword("Password@123"),
                    Role = Role.USER,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.AddRange(adminUser, normalUser);
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
                    }
                };

                context.Tasks.AddRange(tasks);
                context.SaveChanges();
            }
        }
    }
}
