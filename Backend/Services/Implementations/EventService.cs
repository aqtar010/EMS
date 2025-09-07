using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Models;
using EventManagement.Services.Contracts;
using EventManagement.Utilities;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.Services.Implementations
{
    public class EventService(EventDbContext context) : IEventService
    {
        private readonly EventDbContext _context = context;

        public async Task<EventDto> CreateEventAsync(CreateEventDto dto)
        {
            // Validate timezone
            if (!TimeZoneHelper.IsValidTimeZone(dto.TimeZone))
            {
                throw new ArgumentException($"Invalid timezone: {dto.TimeZone}");
            }

            // Convert to UTC for storage
            var startTimeUtc = TimeZoneHelper.ConvertToUtc(dto.StartTime, dto.TimeZone);
            var endTimeUtc = TimeZoneHelper.ConvertToUtc(dto.EndTime, dto.TimeZone);

            var evt = new Event
            {
                Name = dto.Name,
                Location = dto.Location,
                StartTimeUtc = startTimeUtc,
                EndTimeUtc = endTimeUtc,
                MaxCapacity = dto.MaxCapacity,
                CreatedAt = DateTime.UtcNow,
                EventTimeZone = dto.TimeZone
            };

            _context.Events.Add(evt);
            await _context.SaveChangesAsync();

            return MapToDto(evt, dto.TimeZone);
        }

        public async Task<List<EventDto>> GetUpcomingEventsAsync(string timeZone)
        {
            var currentUtc = DateTime.UtcNow;

            var events = await _context.Events
                .Include(e => e.Attendees)
                .Where(e => e.StartTimeUtc > currentUtc)
                .OrderBy(e => e.StartTimeUtc)
                .ToListAsync();

            return events.Select(e => MapToDto(e, timeZone)).ToList();
        }

        public async Task<EventDto?> GetEventByIdAsync(int id, string timeZone)
        {
            var evt = await _context.Events
                .Include(e => e.Attendees)
                .FirstOrDefaultAsync(e => e.Id == id);

            return evt != null ? MapToDto(evt, timeZone) : null;
        }

        private static EventDto MapToDto(Event evt, string timeZone)
        {
            return new()
            {
                Id = evt.Id,
                Name = evt.Name,
                Location = evt.Location,
                StartTime = TimeZoneHelper.ConvertFromUtc(evt.StartTimeUtc, timeZone),
                EndTime = TimeZoneHelper.ConvertFromUtc(evt.EndTimeUtc, timeZone),
                MaxCapacity = evt.MaxCapacity,
                CurrentAttendeeCount = evt.CurrentAttendeeCount,
                IsFullyBooked = evt.IsFullyBooked,
                TimeZone = evt.EventTimeZone
            };
        }

        public Task<bool> DeleteEventByIdAsync(int id)
        {
            var evt = _context.Events.Include(e => e.Attendees).FirstOrDefault(e => e.Id == id);
            if (evt == null)
            {
                return Task.FromResult(false);
            }
            evt.Attendees.Clear(); // Remove associated attendees
            _context.Events.Remove(evt);
            _context.SaveChanges();
            return Task.FromResult(true);
        }
    }
}