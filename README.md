# Location Management API

A RESTful API built with NestJS for managing locations with geocoding capabilities using OpenStreetMap's Nominatim service.

## 🚀 Features

- **Location Management**: CRUD operations for locations (offices, stores, landmarks)
- **Geocoding**: Address to coordinates conversion using OpenStreetMap
- **Reverse Geocoding**: Coordinates to address conversion
- **Caching**: Redis caching for improved performance (10-minute TTL for geocoding, 10-minute TTL for location queries)
- **Pagination**: Efficient pagination with configurable limits (5, 10, 25 items per page)
- **Rate Limiting**: Built-in throttling (20 requests per 60 seconds)
- **Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Proper error handling with meaningful error messages
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Cache**: Redis (via ioredis)
- **Geocoding**: OpenStreetMap Nominatim API
- **Security**: Helmet.js
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI (@nestjs/swagger)

## 📁 Project Structure

```
src/
├── app.controller.ts          # Root and health check endpoints
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── database/                  # Database configurations
│   ├── mongodb.module.ts      # MongoDB module
│   ├── mongodb.service.ts     # MongoDB connection service
│   ├── mongoose.config.ts     # Mongoose configuration
│   └── redis/                 # Redis configuration
│       ├── redis.module.ts
│       └── redis.service.ts
├── location/                  # Location feature module
│   ├── location.controller.ts # Location endpoints
│   ├── location.service.ts    # Location business logic
│   ├── locations.module.ts    # Location module
│   └── create-location.dto.ts # Location DTOs
├── osm/                       # OpenStreetMap geocoding module
│   ├── osm.controller.ts      # Geocoding endpoints
│   ├── osm.service.ts         # Geocoding service
│   ├── osm.module.ts          # OSM module
│   └── osm.dto.ts             # Geocoding DTOs
└── schemas/                   # MongoDB schemas
    └── locations.schema.ts    # Location schema
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- Redis instance
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ronyderra/prod-lm-backend.git
cd prod-lm-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/location-management
REDIS_URL=redis://localhost:6379
GEO_BASE_URL=https://nominatim.openstreetmap.org
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

5. Access the Swagger documentation:
```
http://localhost:3001/api
```

The Swagger UI provides interactive API documentation where you can test all endpoints directly from your browser.

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3001` | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `REDIS_URL` | Redis connection string | - | Yes |
| `GEO_BASE_URL` | OpenStreetMap Nominatim API URL | `https://nominatim.openstreetmap.org` | No |

## 📚 API Documentation

### Swagger UI

Interactive API documentation is available at:
```
http://localhost:3001/api
```

The Swagger UI provides:
- Complete API documentation with all endpoints
- Request/response schemas
- Try it out functionality - test endpoints directly from the browser
- Example requests and responses
- Validation rules and constraints

## 🔌 API Endpoints

### Root & Health

#### `GET /`
Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Location Management API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "locations": "/locations",
    "osm": "/osm",
    "swagger": "/api"
  }
}
```

#### `GET /api`
Swagger UI documentation interface.

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45
}
```

### Locations

#### `GET /locations`
Get all locations with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number (must be >= 1)
- `limit` (number, default: 10) - Items per page (allowed: 5, 10, 25)
- `category` (string, optional) - Filter by category: `office`, `store`, or `landmark`
- `name` (string, optional) - Filter by name

**Example:**
```bash
GET /locations?page=1&limit=10&category=office
```

**Response:**
```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Downtown Office",
      "category": "office",
      "coordinates": {
        "lon": -122.4194,
        "lat": 37.7749
      },
      "address": "123 Main St",
      "notes": "Main office",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### `POST /locations`
Create a new location.

**Request Body:**
```json
{
  "name": "Central Park Store",
  "category": "store",
  "coordinates": {
    "lon": -73.9654,
    "lat": 40.7829
  },
  "address": "123 Main Street, New York, NY 10001",
  "notes": "Main retail location"
}
```

**Validation:**
- `name`: Required string
- `category`: Required enum (`office`, `store`, `landmark`)
- `coordinates.lon`: Required number between -180 and 180
- `coordinates.lat`: Required number between -90 and 90
- `address`: Optional string
- `notes`: Optional string

#### `PUT /locations/:id`
Update a location by ID.

**Request Body:** (same as POST, all fields optional except those you want to update)

#### `DELETE /locations/:id`
Delete a location by ID.

### OpenStreetMap Geocoding

#### `GET /osm/search`
Convert an address to coordinates.

**Query Parameters:**
- `query` (string, required) - Address to search for

**Example:**
```bash
GET /osm/search?query=Tel Aviv
```

**Response:**
```json
{
  "place_id": 123456,
  "licence": "...",
  "osm_type": "way",
  "display_name": "Tel Aviv, Israel",
  "lat": "32.0853",
  "lon": "34.7818",
  ...
}
```

#### `GET /osm/reverse`
Convert coordinates to an address.

**Query Parameters:**
- `lat` (number, required) - Latitude (-90 to 90)
- `lon` (number, required) - Longitude (-180 to 180)

**Example:**
```bash
GET /osm/reverse?lat=32.0853&lon=34.7818
```

**Response:**
```json
{
  "place_id": 123456,
  "licence": "...",
  "display_name": "Tel Aviv, Israel",
  "address": {
    "city": "Tel Aviv",
    "country": "Israel",
    ...
  }
}
```

## 💾 Data Models

### Location

```typescript
{
  _id: string;                    // MongoDB ObjectId
  name: string;                   // Required
  category: 'office' | 'store' | 'landmark';  // Required
  coordinates: {
    lon: number;                  // Required, -180 to 180
    lat: number;                  // Required, -90 to 90
  };
  address?: string;               // Optional
  notes?: string;                 // Optional
  createdAt: Date;                // Auto-generated
  updatedAt: Date;                // Auto-generated
}
```

## 🔒 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Enabled (configure for production)
- **Rate Limiting**: 20 requests per 60 seconds per IP
- **Input Validation**: All inputs validated using DTOs
- **Error Handling**: Proper error responses without exposing internals

## 🚀 Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm run build           # Build TypeScript to JavaScript
npm start               # Start production server
npm run start:prod      # Start production server (alias)
```

## 🧪 Testing Endpoints

### Using cURL

**Create a location:**
```bash
curl -X POST http://localhost:3001/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Office",
    "category": "office",
    "coordinates": {
      "lon": -122.4194,
      "lat": 37.7749
    }
  }'
```

**Get all locations:**
```bash
curl http://localhost:3001/locations?page=1&limit=10
```

**Search for coordinates:**
```bash
curl "http://localhost:3001/osm/search?query=New York"
```

**Reverse geocode:**
```bash
curl "http://localhost:3001/osm/reverse?lat=40.7128&lon=-74.0060"
```

## 📊 Caching Strategy

- **Geocoding Results**: Cached in Redis for 10 minutes (600 seconds)
- **Location Queries**: Cached in Redis for 10 minutes
- **Cache Invalidation**: Location cache is cleared on create/update/delete operations
- **Cache Keys**:
  - Geocoding: `osm:addressToCoordinates:{query}` or `osm:coordinatesToAddress:{lat}:{lon}`
  - Locations: `locations:page={page}:limit={limit}:filters={filters}`

## 🏗️ Architecture

This is a **stateless** RESTful API:
- No server-side sessions
- All state stored in MongoDB and Redis
- Horizontally scalable
- Each request is independent

## 🐛 Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Validation error message",
  "error": "Bad Request"
}
```

## 📦 Dependencies

### Production
- `@nestjs/*` - NestJS framework
- `mongoose` - MongoDB ODM
- `ioredis` - Redis client
- `axios` - HTTP client for geocoding
- `helmet` - Security middleware
- `class-validator` - Validation decorators
- `class-transformer` - Object transformation

### Development
- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server with hot reload
- `eslint` - Linting
- `prettier` - Code formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC

## 👤 Author

[Your Name]

---

For more information, visit the [GitHub repository](https://github.com/ronyderra/prod-lm-backend).
