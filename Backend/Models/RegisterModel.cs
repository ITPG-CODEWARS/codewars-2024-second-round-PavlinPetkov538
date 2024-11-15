﻿using System.ComponentModel.DataAnnotations;

namespace CodeWars_Backend.Models
{
    public class RegisterModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        public string FullName { get; set; } = null!;
    }
}
