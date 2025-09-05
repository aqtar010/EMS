using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Models;
using EventManagement.Utilities;

namespace EventManagement.Services
{
    public class EventService : IEventService
    {
        private readonly EventDbContext _context;

        public EventService(EventDbContext context)
        {
            _context = context;
        }

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
                CreatedAt = DateTime.UtcNow
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

        private EventDto MapToDto(Event evt, string timeZone)
        {
            return new EventDto
            {
                Id = evt.Id,
                Name = evt.Name,
                Location = evt.Location,
                StartTime = TimeZoneHelper.ConvertFromUtc(evt.StartTimeUtc, timeZone),
                EndTime = TimeZoneHelper.ConvertFromUtc(evt.EndTimeUtc, timeZone),
                MaxCapacity = evt.MaxCapacity,
                CurrentAttendeeCount = evt.CurrentAttendeeCount,
                IsFullyBooked = evt.IsFullyBooked,
                TimeZone = timeZone
            };
        }
    }
}