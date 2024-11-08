using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeWars_Backend.Data.Entities
{
    public class ShortUrl
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? LongUrl { get; set; }

        [Required]
        public string? ShortenedUrl { get; set; }

        [Required]
        public DateTime ValidUntil { get; set; }

        [Required]
        public int ValidClicks { get; set; }

        [Required]
        public string? Password { get; set; }

        [Required]
        public string? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        [Required]
        public int Clicks { get; set; }
    }
}
