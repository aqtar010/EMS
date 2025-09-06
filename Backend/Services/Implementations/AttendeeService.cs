using EventManagement.Data;
using EventManagement.DTOs;
using EventManagement.Exceptions;
using EventManagement.Models;
using EventManagement.Services.Contracts;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.Services.Implementations
{
    public class AttendeeService(EventDbContext context) : IAttendeeService
    {
        private readonly EventDbContext _context = context;

        public async Task<AttendeeDto> RegisterAttendeeAsync(int eventId, RegisterAttendeeDto dto)
        {
            var evt = await _context.Events
                .Include(e => e.Attendees)
                .FirstOrDefaultAsync(e => e.Id == eventId) ?? throw new NotFoundException($"Event with ID {eventId} not found");

            // Check if event is fully booked
            if (evt.IsFullyBooked)
            {
                throw new EventFullException("Event is fully booked.");
            }

            // Check for duplicate registration
            var attendeeAlreadyRegistered = await _context.Attendees
                .AnyAsync(a => a.EventId == eventId && a.Email == dto.Email);

            if (attendeeAlreadyRegistered)
            {
                throw new DuplicateAttendeeException("Attendee already registered for this event.");
            }

            var attendee = new Attendee
            {
                Name = dto.Name,
                Email = dto.Email,
                EventId = eventId,
                RegisteredAt = DateTime.UtcNow
            };

            _context.Attendees.Add(attendee);
            await _context.SaveChangesAsync();

            return new AttendeeDto
            {
                Id = attendee.Id,
                Name = attendee.Name,
                Email = attendee.Email,
                RegisteredAt = attendee.RegisteredAt
            };
        }

        public async Task<PagedResult<AttendeeDto>> GetAttendeesAsync(int eventId, int pageNumber, int pageSize)
        {
            var evt = await _context.Events.FindAsync(eventId) ?? throw new NotFoundException($"Event with ID {eventId} not found");
            var query = _context.Attendees
                .Where(a => a.EventId == eventId)
                .OrderBy(a => a.RegisteredAt);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var attendees = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AttendeeDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Email = a.Email,
                    RegisteredAt = a.RegisteredAt
                })
                .ToListAsync();

            return new PagedResult<AttendeeDto>
            {
                Items = attendees,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages
            };
        }
    }
}