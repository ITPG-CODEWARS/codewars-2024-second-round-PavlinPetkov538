using CodeWars_Backend.Data.Entities;

namespace CodeWars_Backend.Models
{
    public class UrlsDisplayModel
    {
        public int Id { get; set; }

        public string? LongUrl { get; set; }

        public string? ShortenedUrl { get; set; }

        public DateTime ValidUntil { get; set; }

        public int ValidClicks { get; set; }

        public string? Password { get; set; }

        public int Clicks { get; set; }
    }
}
