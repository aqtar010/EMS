public class EventFullException : Exception
{
    public EventFullException(string message) : base(message) { }
}

public class DuplicateAttendeeException : Exception
{
    public DuplicateAttendeeException(string message) : base(message) { }
}