using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}