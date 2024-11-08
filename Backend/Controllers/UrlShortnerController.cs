using CodeWars_Backend.Models;
using CodeWars_Backend.Services.UrlShortenerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CodeWars_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UrlShortnerController : ControllerBase
    {
        private readonly IUrlShortnerService urlShortnerService;

        public UrlShortnerController(IUrlShortnerService urlShortnerService)
        {
            this.urlShortnerService = urlShortnerService;
        }

        [HttpGet("Mine")]
        [Authorize]
        public async Task<IActionResult> Mine()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest();
            }

            var mine = await urlShortnerService.GetMine(userId);

            return Ok(mine);
        }

        [HttpPost("Add")]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] UrlShortenerModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await urlShortnerService.AddAsync(model, User.FindFirstValue(ClaimTypes.NameIdentifier));

            return result ? Ok() : BadRequest();
        }

        [HttpDelete("Delete")]
        [Authorize]
        public async Task<IActionResult> Delete([FromQuery] int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await urlShortnerService.DeleteAsync(id, userId);

            return result ? Ok() : BadRequest();
        }

        [HttpPut("Edit")]
        [Authorize]
        public async Task<IActionResult> Edit([FromBody] UrlEditModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await urlShortnerService.EditAsync(model, userId);

            return result ? Ok() : BadRequest();
        }

        [HttpGet("Open")]
        public async Task<IActionResult> Open([FromQuery] string? suffix, string? password)
        {
            var getUrl = await urlShortnerService.OpenUrl(suffix, password);

            if (getUrl.Result == "Password needed")
            {
                return Unauthorized(new { Result = "Password needed" }); // Returns 401 status
            }

            if (getUrl.Result != "Ok")
            {
                return BadRequest(new { Result = getUrl.Result });
            }

            return Ok(new { Result = getUrl.Result, Url = getUrl.Url });
        }
    }
}
