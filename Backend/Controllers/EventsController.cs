using EventManagement.DTOs;
using EventManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IAttendeeService _attendeeService;

        public EventsController(IEventService eventService, IAttendeeService attendeeService)
        {
            _eventService = eventService;
            _attendeeService = attendeeService;
        }

        /// <summary>
        /// Creates a new event
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(EventDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<EventDto>> CreateEvent([FromBody] CreateEventDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var evt = await _eventService.CreateEventAsync(dto);
            return CreatedAtAction(nameof(GetEvent), new { id = evt.Id }, evt);
        }

        /// <summary>
        /// Gets all upcoming events
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<EventDto>), 200)]
        public async Task<ActionResult<List<EventDto>>> GetEvents([FromQuery] string timeZone = "Asia/Kolkata")
        {
            var events = await _eventService.GetUpcomingEventsAsync(timeZone);
            return Ok(events);
        }

        /// <summary>
        /// Gets a specific event by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(EventDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<EventDto>> GetEvent(int id, [FromQuery] string timeZone = "Asia/Kolkata")
        {
            var evt = await _eventService.GetEventByIdAsync(id, timeZone);
            if (evt == null)
            {
                return NotFound(new { message = $"Event with ID {id} not found" });
            }
            return Ok(evt);
        }

        /// <summary>
        /// Registers an attendee for an event
        /// </summary>
        [HttpPost("{eventId}/register")]
        [ProducesResponseType(typeof(AttendeeDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<AttendeeDto>> RegisterAttendee(int eventId, [FromBody] RegisterAttendeeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var attendee = await _attendeeService.RegisterAttendeeAsync(eventId, dto);
            return CreatedAtAction(nameof(GetAttendees), new { eventId }, attendee);
        }

        /// <summary>
        /// Gets all attendees for an event with pagination
        /// </summary>
        [HttpGet("{eventId}/attendees")]
        [ProducesResponseType(typeof(PagedResult<AttendeeDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<PagedResult<AttendeeDto>>> GetAttendees(
            int eventId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100; // Max page size

            var attendees = await _attendeeService.GetAttendeesAsync(eventId, pageNumber, pageSize);
            return Ok(attendees);
        }
    }
}