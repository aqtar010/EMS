using EventManagement.Converter;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EventManagement.DTOs
{
	public class CreateEventDto
	{
		[Required]
		[StringLength(200)]
		public string Name { get; set; } = string.Empty;

		[Required]
		[StringLength(300)]
		public string Location { get; set; } = string.Empty;

		[Required]
        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime StartTime { get; set; }

		[Required]
        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime EndTime { get; set; }

		[Required]
		[Range(1, 10000)]
		public int MaxCapacity { get; set; }

		[Required]
		public string TimeZone { get; set; } = "Asia/Kolkata"; // Default to IST

		public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
		{
			if (EndTime <= StartTime)
			{
				yield return new ValidationResult("End time must be after start time",
					[nameof(EndTime)]);
			}

			if (StartTime < DateTime.Now)
			{
				yield return new ValidationResult("Event cannot be scheduled in the past",
					[nameof(StartTime)]);
			}
		}
	}
}