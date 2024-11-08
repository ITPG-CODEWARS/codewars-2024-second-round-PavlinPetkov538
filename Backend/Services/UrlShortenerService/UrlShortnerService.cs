using CodeWars_Backend.Data;
using CodeWars_Backend.Data.Entities;
using CodeWars_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace CodeWars_Backend.Services.UrlShortenerService
{
    public class UrlShortnerService : IUrlShortnerService
    {
        private readonly ApplicationDbContext context;
        private readonly Random random;

        public UrlShortnerService(ApplicationDbContext context)
        {
            this.context = context;
            this.random = new Random();
        }

        public async Task<bool> AddAsync(UrlShortenerModel model, string userId)
        {
            var prefix = "http://localhost:3000/";

            var url = new ShortUrl()
            {
                UserId = userId,
                Clicks = 0,
                LongUrl = model.LongUrl,
                Password = string.IsNullOrEmpty(model.Password) ? string.Empty : model.Password,
                ValidClicks = model.ValidClicks ?? -1,
                ValidUntil = model.CustomDate ? model.ValidUntil ?? DateTime.Now : DateTime.MinValue,
                ShortenedUrl = !model.IsCustom ? prefix + GenerateUrl(model.Length ?? 5) : prefix + model.Custom
            };

            await context.Urls.AddAsync(url);
            await context.SaveChangesAsync();

            return await context.Urls.ContainsAsync(url);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var url = await context.Urls.FindAsync(id);

            if (url is null || url.UserId != userId)
            {
                return false;
            }

            context.Urls.Remove(url);

            await context.SaveChangesAsync();

            return !await context.Urls.ContainsAsync(url);
        }

        public async Task<bool> EditAsync(UrlEditModel model, string userId)
        {
            var url = await context.Urls.FindAsync(model.Id);

            if (url is null || url.UserId != userId)
            {
                return false;
            }

            url.LongUrl = model.LongUrl;
            url.ValidUntil = model.ValidUntil;
            url.ValidClicks = model.ValidClicks;
            url.Password = model.Password;

            await context.SaveChangesAsync();

            return true;
        }

        public async Task<List<UrlsDisplayModel>> GetMine(string userId)
            => await context.Urls
                .Where(x => x.UserId == userId)
                .Select(x => new UrlsDisplayModel()
                {
                    Clicks = x.Clicks / 2,
                    Id = x.Id,
                    LongUrl = x.LongUrl,
                    Password = x.Password,
                    ShortenedUrl = x.ShortenedUrl,
                    ValidClicks = x.ValidClicks,
                    ValidUntil = x.ValidUntil
                }).ToListAsync();

        public async Task<OpenUrlModel> OpenUrl(string suffix, string password)
        {
            var url = await context.Urls.FirstOrDefaultAsync(x => x.ShortenedUrl!.EndsWith(suffix));

            if (url is null)
            {
                return new OpenUrlModel() { Result = "No url with such suffix found" };
            }

            if (!string.IsNullOrEmpty(url.Password) && string.IsNullOrEmpty(password))
            {
                return new OpenUrlModel() { Result = "Password needed" };
            }

            if (!string.IsNullOrEmpty(url.Password) && url.Password != password)
            {
                return new OpenUrlModel() { Result = "Wrong password" };
            }

            if (url.ValidUntil < DateTime.Now && url.ValidUntil != default(DateTime))
            {
                return new OpenUrlModel() { Result = "Expired url" };
            }

            if (url.ValidClicks == 0)
            {
                return new OpenUrlModel() { Result = "Clicks count" };
            }

            url.Clicks += 0;

            await context.SaveChangesAsync();

            return new OpenUrlModel() { Result = "Ok", Url = url.LongUrl };
        }

        private string GenerateUrl(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            StringBuilder password = new StringBuilder(length);

            for (int i = 0; i < length; i++)
            {
                password.Append(chars[random.Next(chars.Length)]);
            }

            return password.ToString();
        }
    }
}
