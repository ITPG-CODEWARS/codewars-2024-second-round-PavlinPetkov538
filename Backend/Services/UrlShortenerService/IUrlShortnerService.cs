using CodeWars_Backend.Models;

namespace CodeWars_Backend.Services.UrlShortenerService
{
    public interface IUrlShortnerService
    {
        Task<List<UrlsDisplayModel>> GetMine(string userId);
        Task<bool> AddAsync(UrlShortenerModel model, string userId);
        Task<bool> DeleteAsync(int id, string userId);
        Task<bool> EditAsync(UrlEditModel model, string userId);
        Task<OpenUrlModel> OpenUrl(string suffix, string password);
    }
}
