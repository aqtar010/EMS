using EventManagement.Exceptions;
using EventManagement.Middleware;
using FluentAssertions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Hosting;
using System.Net;
using System.Text.Json;

namespace EventManagement.Tests.Middleware
{
    public class ErrorHandlingMiddlewareTests
    {
        private static IHostBuilder CreateHostBuilder(Func<HttpContext, Task> handler)
        {
            return Host.CreateDefaultBuilder()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseTestServer()
                        .Configure(app =>
                        {
                            app.UseMiddleware<ErrorHandlingMiddleware>();
                            app.Run(new RequestDelegate(handler));
                        });
                });
        }

        [Fact]
        public async Task Should_Return_NotFound_When_NotFoundException_Thrown()
        {
            var host = await CreateHostBuilder(_ => throw new NotFoundException("Event not found")).StartAsync();
            var client = host.GetTestClient();

            var response = await client.GetAsync("/");
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);

            var body = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<JsonElement>(body);
            json.GetProperty("message").GetString().Should().Be("Event not found");
        }

        [Fact]
        public async Task Should_Return_BadRequest_When_BusinessException_Thrown()
        {
            var host = await CreateHostBuilder(_ => throw new BusinessException("Invalid business rule")).StartAsync();
            var client = host.GetTestClient();

            var response = await client.GetAsync("/");
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var body = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<JsonElement>(body);
            json.GetProperty("message").GetString().Should().Be("Invalid business rule");
        }

        [Fact]
        public async Task Should_Return_BadRequest_When_ArgumentException_Thrown()
        {
            var host = await CreateHostBuilder(_ => throw new ArgumentException("Bad input")).StartAsync();
            var client = host.GetTestClient();

            var response = await client.GetAsync("/");
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

            var body = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<JsonElement>(body);
            json.GetProperty("message").GetString().Should().Be("Bad input");
        }

        [Fact]
        public async Task Should_Return_InternalServerError_When_UnhandledException_Thrown()
        {
            var host = await CreateHostBuilder(_ => throw new Exception("Something broke")).StartAsync();
            var client = host.GetTestClient();

            var response = await client.GetAsync("/");
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);

            var body = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<JsonElement>(body);
            json.GetProperty("message").GetString().Should().Be("An error occurred while processing your request");
            json.GetProperty("details").GetString().Should().Be("Something broke");
        }

        [Fact]
        public async Task Should_Pass_Request_Through_When_No_Exception()
        {
            var host = await CreateHostBuilder(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.OK;
                await context.Response.WriteAsync("{\"ok\":true}");
            }).StartAsync();

            var client = host.GetTestClient();
            var response = await client.GetAsync("/");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var body = await response.Content.ReadAsStringAsync();
            body.Should().Contain("\"ok\":true");
        }
    }
}
