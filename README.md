# Event Management System (EMS)

A full-stack web application for managing events and attendees, built with .NET 8 backend and Next.js frontend.

## Features

- **Event Management**: Create, view, and delete events
- **Attendee Registration**: Register attendees for events with validation
- **Attendee Management**: View paginated list of attendees for each event
- **Time Zone Support**: Handle events across different time zones
- **Responsive UI**: Modern, responsive frontend built with Next.js and Tailwind CSS
- **RESTful API**: Well-documented API with Swagger/OpenAPI
- **Data Persistence**: SQLite database with Entity Framework Core

## Tech Stack

### Backend
- **Framework**: .NET 8.0
- **Database**: SQLite (with Entity Framework Core)
- **API Documentation**: Swagger/OpenAPI
- **Testing**: xUnit

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios

## Prerequisites

- .NET 8.0 SDK
- Node.js 18+ and npm
- SQLite (optional, can use in-memory for development)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aqtar010/EMS/
   cd EMS
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   dotnet restore
   dotnet build
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

## Usage

1. **Start the Backend**
   ```bash
   cd Backend
   dotnet run
   ```
   The API will be available at `https://localhost:5001` (or `http://localhost:5000` for HTTP).
   Swagger documentation: `https://localhost:5001/swagger`

2. **Start the Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## API Endpoints

### Events
- `GET /api/events` - Get all upcoming events
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create a new event
- `DELETE /api/events/{id}` - Delete an event

### Attendees
- `POST /api/events/{eventId}/register` - Register an attendee for an event
- `GET /api/events/{eventId}/attendees` - Get paginated list of attendees for an event

All endpoints support time zone parameters (default: Asia/Kolkata).

## Testing

Run backend tests:
```bash
cd Backend
dotnet test
```

## Project Structure

```
EMS/
├── Backend/                 # .NET Web API
│   ├── Controllers/         # API controllers
│   ├── Data/               # Database context
│   ├── DTOs/               # Data transfer objects
│   ├── Models/             # Entity models
│   ├── Services/           # Business logic
│   └── Tests/              # Unit tests
├── Frontend/               # Next.js application
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities
│   └── public/             # Static assets
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
