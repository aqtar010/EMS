using EventManagement.Controllers;
using EventManagement.DTOs;
using EventManagement.Services.Contracts;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace EventManagement.Tests.Controllers
{
    public class EventsControllerTests
    {
        private readonly Mock<IEventService> _eventServiceMock;
        private readonly Mock<IAttendeeService> _attendeeServiceMock;
        private readonly EventsController _controller;

        public EventsControllerTests()
        {
            _eventServiceMock = new Mock<IEventService>();
            _attendeeServiceMock = new Mock<IAttendeeService>();
            _controller = new EventsController(_eventServiceMock.Object, _attendeeServiceMock.Object);
        }

        #region CreateEvent Tests

        [Fact]
        public async Task CreateEvent_ValidDto_ReturnsCreatedEvent()
        {
            // Arrange
            var createDto = new CreateEventDto { Name = "Test Event" };
            var eventDto = new EventDto { Id = 1, Name = "Test Event" };

            _eventServiceMock.Setup(s => s.CreateEventAsync(createDto)).ReturnsAsync(eventDto);

            // Act
            var result = await _controller.CreateEvent(createDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetEvent", createdResult.ActionName);
            Assert.Equal(eventDto, createdResult.Value);
        }

        [Fact]
        public async Task CreateEvent_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var createDto = new CreateEventDto();
            _controller.ModelState.AddModelError("Name", "Required");

            // Act
            var result = await _controller.CreateEvent(createDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        #endregion

        #region GetEvents Tests

        [Fact]
        public async Task GetEvents_ReturnsOkWithEvents()
        {
            var events = new List<EventDto> { new EventDto { Id = 1, Name = "Event 1" } };
            _eventServiceMock.Setup(s => s.GetUpcomingEventsAsync("Asia/Kolkata")).ReturnsAsync(events);

            var result = await _controller.GetEvents();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEvents = Assert.IsType<List<EventDto>>(okResult.Value);
            Assert.Single(returnedEvents);
        }

        [Fact]
        public async Task GetEvents_NoEvents_ReturnsEmptyList()
        {
            _eventServiceMock.Setup(s => s.GetUpcomingEventsAsync("Asia/Kolkata"))
                             .ReturnsAsync(new List<EventDto>());

            var result = await _controller.GetEvents();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEvents = Assert.IsType<List<EventDto>>(okResult.Value);
            Assert.Empty(returnedEvents);
        }

        #endregion

        #region GetEvent Tests

        [Fact]
        public async Task GetEvent_EventExists_ReturnsOk()
        {
            var eventDto = new EventDto { Id = 1, Name = "Found Event" };
            _eventServiceMock.Setup(s => s.GetEventByIdAsync(1, "Asia/Kolkata")).ReturnsAsync(eventDto);

            var result = await _controller.GetEvent(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(eventDto, okResult.Value);
        }

        [Fact]
        public async Task GetEvent_EventDoesNotExist_ReturnsNotFound()
        {
            _eventServiceMock.Setup(s => s.GetEventByIdAsync(99, "Asia/Kolkata"))
                             .ReturnsAsync((EventDto?)null);

            var result = await _controller.GetEvent(99);

            var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Contains("not found", notFound.Value!.ToString(), StringComparison.OrdinalIgnoreCase);
        }

        #endregion

        #region RegisterAttendee Tests

        [Fact]
        public async Task RegisterAttendee_ValidRequest_ReturnsCreatedAttendee()
        {
            var registerDto = new RegisterAttendeeDto { Name = "John Doe" };
            var attendeeDto = new AttendeeDto { Id = 10, Name = "John Doe" };

            _attendeeServiceMock.Setup(s => s.RegisterAttendeeAsync(1, registerDto))
                                .ReturnsAsync(attendeeDto);

            var result = await _controller.RegisterAttendee(1, registerDto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(attendeeDto, createdResult.Value);
        }

        [Fact]
        public async Task RegisterAttendee_InvalidModelState_ReturnsBadRequest()
        {
            var registerDto = new RegisterAttendeeDto();
            _controller.ModelState.AddModelError("Name", "Required");

            var result = await _controller.RegisterAttendee(1, registerDto);

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        #endregion

        #region GetAttendees Tests

        [Fact]
        public async Task GetAttendees_ReturnsPagedResult()
        {
            var paged = new PagedResult<AttendeeDto>
            {
                TotalAttendees = 1,
                Attendees = new List<AttendeeDto> { new AttendeeDto { Id = 1, Name = "Alice" } },
                PageNumber = 1,
                PageSize = 10,
                TotalPages = 1,
            };

            _attendeeServiceMock.Setup(s => s.GetAttendeesAsync(1, 1, 10)).ReturnsAsync(paged);

            var result = await _controller.GetAttendees(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            // Convert anonymous object to Dictionary<string, object>
            var dict = okResult.Value!.GetType()
                .GetProperties()
                .ToDictionary(p => p.Name, p => p.GetValue(okResult.Value));

            Assert.Equal(1, dict["TotalAttendees"]);
        }

        [Fact]
        public async Task GetAttendees_PageSizeTooLarge_IsCappedAt100()
        {
            var paged = new PagedResult<AttendeeDto> { TotalAttendees = 0, Attendees = new List<AttendeeDto>(), PageNumber = 1, PageSize = 100, TotalPages = 0 };
            _attendeeServiceMock.Setup(s => s.GetAttendeesAsync(1, 1, 100)).ReturnsAsync(paged);

            var result = await _controller.GetAttendees(1, 1, 500); // request >100

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            // Convert anonymous object to Dictionary<string, object>
            var dict = okResult.Value!.GetType()
                .GetProperties()
                .ToDictionary(p => p.Name, p => p.GetValue(okResult.Value));

            Assert.Equal(1, dict["PageNumber"]);
            Assert.Equal(100, dict["PageSize"]);
        }

        [Fact]
        public async Task GetAttendees_PageNumberLessThan1_DefaultsTo1()
        {
            var paged = new PagedResult<AttendeeDto>
            {
                TotalAttendees = 0,
                Attendees = new List<AttendeeDto>(),
                PageNumber = 1,
                PageSize = 10,
                TotalPages = 0,
            };

            _attendeeServiceMock.Setup(s => s.GetAttendeesAsync(1, 1, 10)).ReturnsAsync(paged);

            var result = await _controller.GetAttendees(1, 0, 10); // invalid page number

            var okResult = Assert.IsType<OkObjectResult>(result.Result);

            // Convert anonymous object to Dictionary<string, object>
            var dict = okResult.Value!.GetType()
                .GetProperties()
                .ToDictionary(p => p.Name, p => p.GetValue(okResult.Value));

            Assert.Equal(1, dict["PageNumber"]);
            Assert.Equal(10, dict["PageSize"]);
        }


        #endregion

        #region DeleteEvent Tests

        [Fact]
        public async Task DeleteEvent_EventNotFound_ReturnsNotFound()
        {
            _eventServiceMock.Setup(s => s.GetEventByIdAsync(1, "Asia/Kolkata")).ReturnsAsync((EventDto?)null);

            var result = await _controller.DeleteEvent(1);

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Contains("not found", notFound.Value!.ToString(), StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task DeleteEvent_DeleteFails_ReturnsBadRequest()
        {
            var eventDto = new EventDto { Id = 1, Name = "Event 1" };
            _eventServiceMock.Setup(s => s.GetEventByIdAsync(1, "Asia/Kolkata")).ReturnsAsync(eventDto);
            _eventServiceMock.Setup(s => s.DeleteEventByIdAsync(1)).ReturnsAsync(false);

            var result = await _controller.DeleteEvent(1);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("Failed", badRequest.Value!.ToString(), StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task DeleteEvent_Success_ReturnsNoContent()
        {
            var eventDto = new EventDto { Id = 1, Name = "Event 1" };
            _eventServiceMock.Setup(s => s.GetEventByIdAsync(1, "Asia/Kolkata")).ReturnsAsync(eventDto);
            _eventServiceMock.Setup(s => s.DeleteEventByIdAsync(1)).ReturnsAsync(true);

            var result = await _controller.DeleteEvent(1);

            Assert.IsType<NoContentResult>(result);
        }

        #endregion
    }
}
