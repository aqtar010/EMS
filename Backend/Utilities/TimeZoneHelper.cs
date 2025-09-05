using System;
using TimeZoneConverter;

namespace EventManagement.Utilities
{
    public static class TimeZoneHelper
    {
        public static DateTime ConvertToUtc(DateTime dateTime, string timeZoneId)
        {
            try
            {
                if (dateTime.Kind == DateTimeKind.Utc)
                    return dateTime; // Already UTC

                // Ensure Unspecified so TimeZoneInfo interprets correctly
                if (dateTime.Kind == DateTimeKind.Unspecified)
                    dateTime = DateTime.SpecifyKind(dateTime, DateTimeKind.Unspecified);

                var timeZone = TZConvert.GetTimeZoneInfo(timeZoneId);
                return TimeZoneInfo.ConvertTimeToUtc(dateTime, timeZone);
            }
            catch
            {
                var istTimeZone = TZConvert.GetTimeZoneInfo("Asia/Kolkata");
                return TimeZoneInfo.ConvertTimeToUtc(dateTime, istTimeZone);
            }
        }

        public static DateTime ConvertFromUtc(DateTime utcDateTime, string timeZoneId)
        {
            try
            {
                // Ensure input is UTC
                if (utcDateTime.Kind != DateTimeKind.Utc)
                    utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);

                var timeZone = TZConvert.GetTimeZoneInfo(timeZoneId);
                return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, timeZone);
            }
            catch
            {
                var istTimeZone = TZConvert.GetTimeZoneInfo("Asia/Kolkata");
                return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, istTimeZone);
            }
        }


        public static bool IsValidTimeZone(string timeZoneId)
        {
            try
            {
                TZConvert.GetTimeZoneInfo(timeZoneId);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}