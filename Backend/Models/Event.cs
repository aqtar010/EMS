using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EventManagement.Models
{
    public class Event
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(300)]
        public string Location { get; set; } = string.Empty;

        [Required]
        public DateTime StartTimeUtc { get; set; }

        [Required]
        public DateTime EndTimeUtc { get; set; }

        [Range(1, 10000)]
        public int MaxCapacity { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Attendee> Attendees { get; set; } = new List<Attendee>();

        public int CurrentAttendeeCount => Attendees?.Count ?? 0;
        public bool IsFullyBooked => CurrentAttendeeCount >= MaxCapacity;
    }
}