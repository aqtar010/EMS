using System.Collections.Generic;

namespace EventManagement.DTOs
{
    public class PagedResult<T>
    {
        public List<T> Attendees { get; set; } = new List<T>();
        public int TotalAttendees { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
    }
}