using CodeWars_Backend.Data.Entities;
using CodeWars_Backend.Models;
using CodeWars_Backend.Services.AuthenticationService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CodeWars_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService authenticationService;
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;

        public AuthenticationController(IAuthenticationService authenticationService,
                                        UserManager<User> userManager, 
                                        SignInManager<User> signInManager)
        {
            this.authenticationService = authenticationService;
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        [HttpGet("Register")]
        public async Task<IActionResult> Register([FromQuery] RegisterModel registerModel)
        {
            var user = new User
            {
                Email = registerModel.Email,
                FullName = registerModel.FullName,
                UserName = registerModel.Email,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, registerModel.Password);

            if (result.Succeeded)
            {
                await signInManager.SignInAsync(user, isPersistent: false);

                string token = await authenticationService.GenerateToken(user.Id);

                return Ok(new { Token = token });
            }

            return BadRequest(result);
        }

        [HttpGet("Login")]
        public async Task<IActionResult> Login([FromQuery] LoginModel loginModel)
        {
            var user = await userManager.FindByEmailAsync(loginModel.Email);

            if (user != null)
            {
                var result = await signInManager.PasswordSignInAsync(user, loginModel.Password, true, false);

                if (result.Succeeded)
                {
                    string token = await authenticationService.GenerateToken(user.Id);

                    return Ok(new { Token = token });
                }
            }

            return BadRequest();
        }

        [HttpGet("IsAuthenticated")]
        public async Task<IActionResult> IsAuthenticated()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Ok(new { IsAuthenticated = true, UserId = User.FindFirstValue(ClaimTypes.NameIdentifier) });
            }

            return Ok(new { IsAuthenticated = false });
        }
    }
}
