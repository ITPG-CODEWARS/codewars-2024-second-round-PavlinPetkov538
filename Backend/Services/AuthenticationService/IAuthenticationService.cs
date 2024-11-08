namespace CodeWars_Backend.Services.AuthenticationService
{
    public interface IAuthenticationService
    {
        Task<string> GenerateToken(string userId);
    }
}
