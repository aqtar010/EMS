using System;
using System.Collections.Generic;

namespace EventManagement.DTOs
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public int MaxCapacity { get; set; }
        public int CurrentAttendeeCount { get; set; }
        public bool IsFullyBooked { get; set; }
        public string TimeZone { get; set; } = string.Empty;
    }
}