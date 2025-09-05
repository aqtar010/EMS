using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EventManagement.DTOs;

namespace EventManagement.Services
{
	public interface IEventService
	{
		Task<EventDto> CreateEventAsync(CreateEventDto dto);
		Task<List<EventDto>> GetUpcomingEventsAsync(string timeZone);
		Task<EventDto?> GetEventByIdAsync(int id, string timeZone);
	}
}