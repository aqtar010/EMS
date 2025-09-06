using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Hosting;
using System.Net;
using System.Text.Json;

namespace EventManagement.Tests.Middleware
{
    public class ExceptionHandlingMiddlewareTests
    {
        private static IHostBuilder CreateHostBuilder(RequestDelegate handler)
        {
            return Host.CreateDefaultBuilder()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseTestServer()
                        .Configure(app =>
                        {
                            app.UseMiddleware<ExceptionHandlingMiddleware>();
                            app.Run(handler);
                        });
                });
        }

        [Fact]
        public async Task Middleware_WhenEventFullException_ReturnsForbidden()
        {
            // Arrange
            var host = await CreateHostBuilder(context =>
            {
                throw new EventFullException("Event is full");
            }).StartAsync();

            var client = host.GetTestClient();

            // Act
            var response = await client.GetAsync("/");

            // Assert
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);

            var json = await response.Content.ReadAsStringAsync();
            var obj = JsonSerializer.Deserialize<JsonElement>(json);

            Assert.Equal("Event is full", obj.GetProperty("message").GetString());
        }

        [Fact]
        public async Task Middleware_WhenDuplicateAttendeeException_ReturnsConflict()
        {
            // Arrange
            var host = await CreateHostBuilder(context =>
            {
                throw new DuplicateAttendeeException("Attendee already registered");
            }).StartAsync();

            var client = host.GetTestClient();

            // Act
            var response = await client.GetAsync("/");

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);

            var json = await response.Content.ReadAsStringAsync();
            var obj = JsonSerializer.Deserialize<JsonElement>(json);

            Assert.Equal("Attendee already registered", obj.GetProperty("message").GetString());
        }

        [Fact]
        public async Task Middleware_WhenUnhandledException_ReturnsInternalServerError()
        {
            // Arrange
            var host = await CreateHostBuilder(context =>
            {
                throw new Exception("Something went wrong");
            }).StartAsync();

            var client = host.GetTestClient();

            // Act
            var response = await client.GetAsync("/");

            // Assert
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);

            var json = await response.Content.ReadAsStringAsync();
            var obj = JsonSerializer.Deserialize<JsonElement>(json);

            Assert.Equal("An unexpected error occurred.", obj.GetProperty("message").GetString());
        }
    }
}