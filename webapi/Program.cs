using webapi.Models;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore;
using webapi.Services;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("FinancialPlannerContextConnection") ?? throw new InvalidOperationException("Connection string 'FinancialPlannerContextConnection' not found.");
builder.Services.AddDbContext<UserContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddScoped<webapi.DataCRUD.UserDataCRUD>();
builder.Services.AddScoped<UserService>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//Create RSA key on server start
//RSA rsa = RSA.Create();
//byte[] asciiByteMessage = System.Text.Encoding.ASCII.GetBytes(rsa.ToXmlString(false));
try
{
    DeleteKey("MachineKeyStore");
}
catch
{
    var parameters = new CspParameters
    {
        KeyContainerName = "MachineKeyStore"
    };

    using var rsa = new RSACryptoServiceProvider(parameters)
    {
        // Delete the key entry in the container.
        PersistKeyInCsp = false
    };
}

static void DeleteKey(string locationName)
{
    // Create the CspParameters object and set the location name
    var parameters = new CspParameters
    {
        KeyContainerName = locationName
    };

    // Create a new instance of RSACryptoServiceProvider that accesses
    // the key.
    using var rsa = new RSACryptoServiceProvider(parameters)
    {
        // Delete the key.
        PersistKeyInCsp = false
    };

    rsa.Clear();
}

app.Run();
