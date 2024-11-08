namespace CodeWars_Backend.Models
{
    public class UrlShortenerModel
    {
        public string? LongUrl { get; set; }
        public bool IsCustom { get; set; }
        public string? Custom { get; set; }
        public int? Length { get; set; }
        public bool CustomDate { get; set; }
        public DateTime? ValidUntil { get; set; }
        public int? ValidClicks { get; set; }
        public string? Password { get; set; }
    }
}
