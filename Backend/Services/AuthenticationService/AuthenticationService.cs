using CodeWars_Backend.Data;
using CodeWars_Backend.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CodeWars_Backend.Services.AuthenticationService
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly ApplicationDbContext context;
        private readonly UserManager<User> userManager;
        private string _secretKey = "C@deWars?Secret@@Token1234567890!@#$";
        private string _issuer = "http://localhost:5000";
        private string _audience = "http://localhost:5000";

        public AuthenticationService(ApplicationDbContext context,
                                     UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        public async Task<string> GenerateToken(string userId)
        {
            var tokenExpiration = DateTime.UtcNow.AddDays(7);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var user = await context.Users.FindAsync(userId);

            if (user is null)
            {
                return string.Empty;
            }

            var roles = await userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: tokenExpiration,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
