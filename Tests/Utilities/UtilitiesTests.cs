using EventManagement.Utilities;
using System;
using TimeZoneConverter;
using Xunit;

namespace EventManagement.Tests.Utilities
{
    public class TimeZoneHelperTests
    {
        [Fact]
        public void ConvertToUtc_ShouldReturnSame_WhenAlreadyUtc()
        {
            // Arrange
            var utcDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

            // Act
            var result = TimeZoneHelper.ConvertToUtc(utcDate, "Asia/Kolkata");

            // Assert
            Assert.Equal(utcDate, result);
        }

        [Theory]
        [InlineData("Asia/Kolkata")]
        [InlineData("America/New_York")]
        [InlineData("Europe/London")]
        public void ConvertToUtc_ShouldConvertFromUnspecified(string timeZoneId)
        {
            // Arrange
            var localDate = new DateTime(2025, 1, 1, 9, 0, 0, DateTimeKind.Unspecified);

            // Act
            var result = TimeZoneHelper.ConvertToUtc(localDate, timeZoneId);

            // Assert: Equivalent to system conversion
            var expected = TimeZoneInfo.ConvertTimeToUtc(localDate, TZConvert.GetTimeZoneInfo(timeZoneId));
            Assert.Equal(expected, result);
        }

        [Fact]
        public void ConvertToUtc_ShouldFallbackToIst_WhenInvalidTimeZone()
        {
            // Arrange
            var date = new DateTime(2025, 1, 1, 10, 0, 0, DateTimeKind.Unspecified);

            // Act
            var result = TimeZoneHelper.ConvertToUtc(date, "Invalid/Zone");

            // Assert
            var expected = TimeZoneInfo.ConvertTimeToUtc(date, TZConvert.GetTimeZoneInfo("Asia/Kolkata"));
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("Asia/Kolkata")]
        [InlineData("America/New_York")]
        [InlineData("Europe/London")]
        public void ConvertFromUtc_ShouldConvertToTargetTimeZone(string timeZoneId)
        {
            // Arrange
            var utcDate = new DateTime(2025, 1, 1, 3, 0, 0, DateTimeKind.Utc);

            // Act
            var result = TimeZoneHelper.ConvertFromUtc(utcDate, timeZoneId);

            // Assert
            var expected = TimeZoneInfo.ConvertTimeFromUtc(utcDate, TZConvert.GetTimeZoneInfo(timeZoneId));
            Assert.Equal(expected, result);
        }

        [Fact]
        public void ConvertFromUtc_ShouldFallbackToIst_WhenInvalidTimeZone()
        {
            // Arrange
            var utcDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Act
            var result = TimeZoneHelper.ConvertFromUtc(utcDate, "Invalid/Zone");

            // Assert
            var expected = TimeZoneInfo.ConvertTimeFromUtc(utcDate, TZConvert.GetTimeZoneInfo("Asia/Kolkata"));
            Assert.Equal(expected, result);
        }

        [Fact]
        public void ConvertFromUtc_ShouldFixNonUtcInput()
        {
            // Arrange: Wrong kind
            var utcDateWrongKind = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Local);

            // Act
            var result = TimeZoneHelper.ConvertFromUtc(utcDateWrongKind, "Asia/Kolkata");

            // Assert
            var expected = TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.SpecifyKind(utcDateWrongKind, DateTimeKind.Utc),
                TZConvert.GetTimeZoneInfo("Asia/Kolkata"));
            Assert.Equal(expected, result);
        }

        [Theory]
        [InlineData("Asia/Kolkata", true)]
        [InlineData("America/New_York", true)]
        [InlineData("Europe/London", true)]
        [InlineData("Invalid/Zone", false)]
        public void IsValidTimeZone_ShouldWorkCorrectly(string timeZoneId, bool expected)
        {
            // Act
            var result = TimeZoneHelper.IsValidTimeZone(timeZoneId);

            // Assert
            Assert.Equal(expected, result);
        }
    }
}
