using TaskManagementSystem.API.Models;

namespace TaskManagementSystem.API.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(Guid id);
    }
}