using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Exceptions;
using EventManagement.Models;
using EventManagement.Services.Implementations;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.Tests.Services
{
    public class AttendeeServiceTests
    {
        private EventDbContext GetDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<EventDbContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new EventDbContext(options);
        }

        [Fact]
        public async Task RegisterAttendee_Success()
        {
            // Arrange
            var context = GetDbContext(nameof(RegisterAttendee_Success));
            var evt = new Event { Id = 1, Name = "Test Event", MaxCapacity = 10 };
            context.Events.Add(evt);
            await context.SaveChangesAsync();

            var service = new AttendeeService(context);
            var dto = new RegisterAttendeeDto { Name = "Alice", Email = "alice@test.com" };

            // Act
            var result = await service.RegisterAttendeeAsync(1, dto);

            // Assert
            Assert.Equal("Alice", result.Name);
            Assert.Equal("alice@test.com", result.Email);
            Assert.True(result.Id > 0);
        }

        [Fact]
        public async Task RegisterAttendee_EventNotFound_ThrowsNotFoundException()
        {
            var context = GetDbContext(nameof(RegisterAttendee_EventNotFound_ThrowsNotFoundException));
            var service = new AttendeeService(context);
            var dto = new RegisterAttendeeDto { Name = "Bob", Email = "bob@test.com" };

            await Assert.ThrowsAsync<NotFoundException>(() => service.RegisterAttendeeAsync(99, dto));
        }

        [Fact]
        public async Task RegisterAttendee_EventFull_ThrowsEventFullException()
        {
            var context = GetDbContext(nameof(RegisterAttendee_EventFull_ThrowsEventFullException));
            var evt = new Event { Id = 1, Name = "Full Event", MaxCapacity = 1 };
            context.Events.Add(evt);
            await context.SaveChangesAsync();

            var service = new AttendeeService(context);
            var dto = new RegisterAttendeeDto { Name = "Carl", Email = "carl@test.com" };
            var dto2 = new RegisterAttendeeDto { Name = "Carl1", Email = "carl1@test.com" };
            await service.RegisterAttendeeAsync(1, dto);

            await Assert.ThrowsAsync<EventFullException>(() => service.RegisterAttendeeAsync(1, dto2));
        }

        [Fact]
        public async Task RegisterAttendee_DuplicateEmail_ThrowsDuplicateAttendeeException()
        {
            var context = GetDbContext(nameof(RegisterAttendee_DuplicateEmail_ThrowsDuplicateAttendeeException));
            var evt = new Event { Id = 1, Name = "Test Event", MaxCapacity = 10 };
            context.Events.Add(evt);
            context.Attendees.Add(new Attendee { Name = "Alice", Email = "alice@test.com", EventId = 1, RegisteredAt = DateTime.UtcNow });
            await context.SaveChangesAsync();

            var service = new AttendeeService(context);
            var dto = new RegisterAttendeeDto { Name = "Alice Again", Email = "alice@test.com" };

            await Assert.ThrowsAsync<DuplicateAttendeeException>(() => service.RegisterAttendeeAsync(1, dto));
        }

        [Fact]
        public async Task GetAttendees_ReturnsPagedResult()
        {
            var context = GetDbContext(nameof(GetAttendees_ReturnsPagedResult));
            var evt = new Event { Id = 1, Name = "Test Event", MaxCapacity = 10 };
            context.Events.Add(evt);

            context.Attendees.AddRange(
                new Attendee { Name = "Alice", Email = "alice@test.com", EventId = 1, RegisteredAt = DateTime.UtcNow.AddMinutes(-2) },
                new Attendee { Name = "Bob", Email = "bob@test.com", EventId = 1, RegisteredAt = DateTime.UtcNow.AddMinutes(-1) },
                new Attendee { Name = "Charlie", Email = "charlie@test.com", EventId = 1, RegisteredAt = DateTime.UtcNow }
            );
            await context.SaveChangesAsync();

            var service = new AttendeeService(context);

            // Act
            var result = await service.GetAttendeesAsync(1, pageNumber: 1, pageSize: 2);

            // Assert
            Assert.Equal(3, result.TotalAttendees);
            Assert.Equal(2, result.Attendees.Count);
            Assert.Equal(2, result.TotalPages);
            Assert.Equal(1, result.PageNumber);
            Assert.Equal(2, result.PageSize);
        }

        [Fact]
        public async Task GetAttendees_EventNotFound_ThrowsNotFoundException()
        {
            var context = GetDbContext(nameof(GetAttendees_EventNotFound_ThrowsNotFoundException));
            var service = new AttendeeService(context);

            await Assert.ThrowsAsync<NotFoundException>(() => service.GetAttendeesAsync(42, 1, 10));
        }
    }
}
