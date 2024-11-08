namespace CodeWars_Backend.Models
{
    public class UrlEditModel
    {
        public int Id { get; set; }

        public string? LongUrl { get; set; }

        public DateTime ValidUntil { get; set; }

        public int ValidClicks { get; set; }

        public string? Password { get; set; }
    }
}
