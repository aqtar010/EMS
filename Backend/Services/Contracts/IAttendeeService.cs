using System.Threading.Tasks;
using EventManagement.DTOs;

namespace EventManagement.Services.Contracts
{
    public interface IAttendeeService
    {
        Task<AttendeeDto> RegisterAttendeeAsync(int eventId, RegisterAttendeeDto dto);
        Task<PagedResult<AttendeeDto>> GetAttendeesAsync(int eventId, int pageNumber, int pageSize);
    }
}