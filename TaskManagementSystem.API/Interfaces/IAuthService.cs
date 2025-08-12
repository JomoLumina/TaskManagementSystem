using TaskManagementSystem.API.DTOs;

namespace TaskManagementSystem.API.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest req);
        Task<AuthResponse> LoginAsync(LoginRequest req);
    }
}
