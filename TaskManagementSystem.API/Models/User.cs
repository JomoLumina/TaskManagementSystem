using System.ComponentModel.DataAnnotations;

namespace TaskManagementSystem.API.Models
{
    public class User
    {
        public Guid Id { get; set; }
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Email { get; set; }
        public string? Password { get; set; }
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}