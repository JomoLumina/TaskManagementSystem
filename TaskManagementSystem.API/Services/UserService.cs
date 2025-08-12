using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.API.Data;
using TaskManagementSystem.API.Interfaces;
using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;
        public UserService(AppDbContext db) { _db = db; }

        public async Task<IEnumerable<User>> GetAllAsync() => await _db.Users.Select(u => new User { Id = u.Id, Username = u.Username, Email = u.Email, Role = u.Role, CreatedAt = u.CreatedAt }).ToListAsync();

        public async Task<User?> GetByIdAsync(Guid id) => await _db.Users.FindAsync(id);
    }
}
