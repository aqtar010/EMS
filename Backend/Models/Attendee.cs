using System;
using System.ComponentModel.DataAnnotations;

namespace EventManagement.Models
{
    public class Attendee
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        public int EventId { get; set; }
        public Event Event { get; set; } = null!;

        public DateTime RegisteredAt { get; set; }
    }
}
