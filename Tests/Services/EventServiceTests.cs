using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Models;
using EventManagement.Services.Implementations;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.Tests.Services
{
    public class EventServiceTests
    {
        private EventDbContext GetDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<EventDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new EventDbContext(options);
        }

        [Fact]
        public async Task CreateEventAsync_ShouldCreateEvent_WhenValidDtoProvided()
        {
            // Arrange
            var dbContext = GetDbContext(nameof(CreateEventAsync_ShouldCreateEvent_WhenValidDtoProvided));
            var service = new EventService(dbContext);

            var dto = new CreateEventDto
            {
                Name = "Conference",
                Location = "Hall A",
                StartTime = DateTime.SpecifyKind(DateTime.Now.AddHours(2), DateTimeKind.Utc),
                EndTime = DateTime.SpecifyKind(DateTime.Now.AddHours(4), DateTimeKind.Utc),
                MaxCapacity = 100,
                TimeZone = "Asia/Kolkata"
            };

            // Act
            var result = await service.CreateEventAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Conference", result.Name);
            Assert.Equal("Hall A", result.Location);
            Assert.Equal(100, result.MaxCapacity);
            Assert.False(result.IsFullyBooked);
        }

        [Fact]
        public async Task CreateEventAsync_ShouldThrowArgumentException_WhenInvalidTimeZone()
        {
            // Arrange
            var dbContext = GetDbContext(nameof(CreateEventAsync_ShouldThrowArgumentException_WhenInvalidTimeZone));
            var service = new EventService(dbContext);

            var dto = new CreateEventDto
            {
                Name = "Meeting",
                Location = "Room 101",
                StartTime = DateTime.Now,
                EndTime = DateTime.Now.AddHours(1),
                MaxCapacity = 50,
                TimeZone = "Invalid/TimeZone"
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => service.CreateEventAsync(dto));
        }

        [Fact]
        public async Task GetUpcomingEventsAsync_ShouldReturnOnlyFutureEvents()
        {
            // Arrange
            var dbContext = GetDbContext(nameof(GetUpcomingEventsAsync_ShouldReturnOnlyFutureEvents));
            dbContext.Events.AddRange(
                new Event
                {
                    Name = "Past Event",
                    Location = "Auditorium",
                    StartTimeUtc = DateTime.UtcNow.AddHours(-3),
                    EndTimeUtc = DateTime.UtcNow.AddHours(-2),
                    MaxCapacity = 50,
                    CreatedAt = DateTime.UtcNow
                },
                new Event
                {
                    Name = "Future Event",
                    Location = "Conference Room",
                    StartTimeUtc = DateTime.UtcNow.AddHours(2),
                    EndTimeUtc = DateTime.UtcNow.AddHours(3),
                    MaxCapacity = 100,
                    CreatedAt = DateTime.UtcNow
                });
            dbContext.SaveChanges();

            var service = new EventService(dbContext);

            // Act
            var events = await service.GetUpcomingEventsAsync("Asia/Kolkata");

            // Assert
            Assert.Single(events);
            Assert.Equal("Future Event", events[0].Name);
        }

        [Fact]
        public async Task GetEventByIdAsync_ShouldReturnEvent_WhenEventExists()
        {
            // Arrange
            var dbContext = GetDbContext(nameof(GetEventByIdAsync_ShouldReturnEvent_WhenEventExists));
            var evt = new Event
            {
                Name = "Hackathon",
                Location = "Lab",
                StartTimeUtc = DateTime.UtcNow.AddHours(1),
                EndTimeUtc = DateTime.UtcNow.AddHours(2),
                MaxCapacity = 20,
                CreatedAt = DateTime.UtcNow
            };
            dbContext.Events.Add(evt);
            dbContext.SaveChanges();

            var service = new EventService(dbContext);

            // Act
            var result = await service.GetEventByIdAsync(evt.Id, "Asia/Kolkata");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Hackathon", result!.Name);
        }

        [Fact]
        public async Task GetEventByIdAsync_ShouldReturnNull_WhenEventDoesNotExist()
        {
            // Arrange
            var dbContext = GetDbContext(nameof(GetEventByIdAsync_ShouldReturnNull_WhenEventDoesNotExist));
            var service = new EventService(dbContext);

            // Act
            var result = await service.GetEventByIdAsync(999, "Asia/Kolkata");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteEventByIdAsync_ShouldReturnTrue_WhenEventExists()
        {
            // Arrange
            var dbContext = GetDbContext(nameof(DeleteEventByIdAsync_ShouldReturnTrue_WhenEventExists));
            var evt = new Event
            {
                Name = "Workshop",
                Location = "Studio",
                StartTimeUtc = DateTime.UtcNow.AddHours(1),
                EndTimeUtc = DateTime.UtcNow.AddHours(2),
                MaxCapacity = 10,
                CreatedAt = DateTime.UtcNow
            };
            dbContext.Events.Add(evt);
            dbContext.SaveChanges();

            var service = new EventService(dbContext);

            // Act
            var result = await service.DeleteEventByIdAsync(evt.Id);

            // Assert
            Assert.True(result);
            Assert.Empty(dbContext.Events);
        }

        [Fact]
        public async Task DeleteEventByIdAsync_ShouldReturnFalse_WhenEventDoesNotExist()
        {
            // Arrange
            var dbContext = GetDbContext(nameof(DeleteEventByIdAsync_ShouldReturnFalse_WhenEventDoesNotExist));
            var service = new EventService(dbContext);

            // Act
            var result = await service.DeleteEventByIdAsync(12345);

            // Assert
            Assert.False(result);
        }
    }
}
