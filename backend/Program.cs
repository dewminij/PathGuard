using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add Entity Framework Core with Azure SQL
builder.Services.AddDbContext<PathGuardDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("PathGuardDb")
    )
);

// Add Microsoft Entra ID authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// Add authorization using entra group objects ID's for the PathGuard application and helps to achiev RBAC
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PathGuardReader", policy =>
        policy.RequireClaim(
            "groups",
            "1329a6d9-d443-47a1-805e-fdee32b0635c"
        ));

    options.AddPolicy("PathGuardOperator", policy =>
        policy.RequireClaim(
            "groups",
            "6c72bcdc-6c75-4e4c-8754-e801f725e4e4"
        ));

    options.AddPolicy("PathGuardAdministrator", policy =>
        policy.RequireClaim(
            "groups",
            "5a47cafe-ae1e-4001-9f6e-a7609f36c94e"
        ));

    options.AddPolicy("PathGuardGlobalAdministrator", policy =>
        policy.RequireClaim(
            "groups",
            "8a987d35-6034-497d-bb14-ae51df48326b"
        ));
});

// Add controllers
builder.Services.AddScoped<AlertService>();
builder.Services.AddScoped<NormalizationService>();
builder.Services.AddControllers();
builder.Services.AddScoped<CorrelationService>();
builder.Services.AddScoped<IncidentService>(); //on 26/11/2026
builder.Services.AddScoped<MitreMappingService>();
builder.Services.AddScoped<AttackPathService>();

// Allow the React frontend to call the backend API
builder.Services.AddCors(options =>
{
    options.AddPolicy("PathGuardFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add Swagger details for the authorization and add MASL entra configurations too
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your Microsoft Entra ID access token."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("PathGuardFrontend");

// Authentication MUST come before Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
