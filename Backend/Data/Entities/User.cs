using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace CodeWars_Backend.Data.Entities
{
    public class User : IdentityUser
    {
        [Required]
        public string? FullName { get; set; }
    }
}
