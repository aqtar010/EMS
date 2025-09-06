using EventManagement.DTOs;

namespace EventManagement.Services.Contracts
{
	public interface IEventService
	{
		Task<EventDto> CreateEventAsync(CreateEventDto dto);
		Task<List<EventDto>> GetUpcomingEventsAsync(string timeZone);
		Task<EventDto?> GetEventByIdAsync(int id, string timeZone);
		Task<bool> DeleteEventByIdAsync(int id);
    }
}