using CodeWars_Backend.Data.Entities;
using CodeWars_Backend.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CodeWars_Backend.Extensions;
using CodeWars_Backend.Services.UrlShortenerService;
using CodeWars_Backend.Services.AuthenticationService;

namespace CodeWars
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenAnyIP(80);
                options.ListenAnyIP(5000);
            });

            builder.Services.AddAuthorization();

            builder.Services.AddIdentity<User, IdentityRole>(options =>
            {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;
            }).AddEntityFrameworkStores<ApplicationDbContext>()
              .AddDefaultTokenProviders();

            builder.Services
                .Configure<DataProtectionTokenProviderOptions>(options => options.TokenLifespan = TimeSpan.FromMinutes(15));

            builder.Services.AddTransient<IAuthenticationService, AuthenticationService>();
            builder.Services.AddTransient<IUrlShortnerService, UrlShortnerService>();

            builder.Services.AddTokenAuthentication(builder.Configuration);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection().UseCors(options =>
            {
                options.WithOrigins("http://localhost:3000")
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
            });

            app.UseAuthorization();

            app.MapControllers();

            app.Initialize();

            app.Run();
        }
    }
}
