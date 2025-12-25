# Backend - Fashion E-Commerce

Backend server for the Fashion E-Commerce platform built with Go and Gin framework.

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 15 or higher
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fashion-e-commerce/backend
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the configuration values:

```env
# Server Configuration
SERVER_PORT=8080          # Port for the server to listen on
GIN_MODE=debug           # debug or release

# Database Configuration
DB_HOST=localhost        # PostgreSQL host
DB_PORT=5432            # PostgreSQL port
DB_USER=postgres        # Database user
DB_PASSWORD=postgres    # Database password
DB_NAME=fashion_ecommerce  # Database name
DB_SSLMODE=disable      # SSL mode (disable for local dev)

# Application Environment
APP_ENV=development     # development or production
```

### 3. Database Setup

Create the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fashion_ecommerce;

# Exit psql
\q

# Run the schema file
psql -U postgres -d fashion_ecommerce -f ../database/DATABASE_DESIGN.sql
```

Verify tables are created:

```bash
psql -U postgres -d fashion_ecommerce -c "\dt"
```

### 4. Install Dependencies

```bash
go mod download
```

### 5. Run the Server

```bash
go run cmd/server/main.go
```

The server should start and display:
```
Server starting on port :8080
Database connected successfully
```

### 6. Verify Server is Running

Test the health endpoint:

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-25T10:00:00Z",
  "database": "connected"
}
```

## Development

### Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go           # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go         # Configuration management
│   ├── database/
│   │   ├── connection.go     # Database connection
│   │   └── migrations.go     # Migration stub
│   ├── handlers/
│   │   └── health.go         # HTTP handlers
│   ├── middleware/
│   │   ├── cors.go          # CORS middleware
│   │   ├── logger.go        # Request logging
│   │   └── recovery.go      # Panic recovery
│   ├── models/              # Data models (future)
│   ├── repositories/        # Data access layer (future)
│   └── services/            # Business logic (future)
├── .env.example             # Example environment variables
└── go.mod                   # Go dependencies
```

### Running in Debug Mode

The server runs in debug mode by default (set in .env):

```env
GIN_MODE=debug
```

This enables:
- Detailed request logging
- Error stack traces
- Hot reload with tools like `air` (optional)

### Adding Dependencies

```bash
# Add a new dependency
go get github.com/package/name

# Update go.mod and go.sum
go mod tidy

# Commit both files
git add go.mod go.sum
git commit -m "Add new dependency"
```

## API Endpoints

### Health Check

- **GET** `/health` or `/api/v1/health`
  - Returns server and database health status
  - Response: `200 OK` or `503 Service Unavailable`

## Troubleshooting

### Database Connection Issues

**Error:** `connection refused`

- Verify PostgreSQL is running: `pg_ctl status` or `sudo service postgresql status`
- Check host and port in `.env` match PostgreSQL configuration
- Verify firewall allows connections on port 5432

**Error:** `authentication failed`

- Verify username and password in `.env` are correct
- Check PostgreSQL `pg_hba.conf` allows local connections

**Error:** `database does not exist`

- Create the database: `CREATE DATABASE fashion_ecommerce;`
- Run the schema file as shown in setup instructions

**Error:** `too many connections`

- Check connection pool settings in `internal/database/connection.go`
- Verify no connection leaks in your code

### CORS Errors

If frontend shows CORS errors:

- Verify backend is running
- Check CORS middleware in `internal/middleware/cors.go` allows frontend origin
- Default allowed origins: `http://localhost:5173`, `http://localhost:3000`

### Port Already in Use

**Error:** `bind: address already in use`

Find and kill the process:

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in .env
SERVER_PORT=8081
```

## Configuration Reference

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SERVER_PORT` | HTTP server port | 8080 | No |
| `GIN_MODE` | Gin mode (debug/release) | debug | No |
| `DB_HOST` | PostgreSQL host | localhost | Yes |
| `DB_PORT` | PostgreSQL port | 5432 | No |
| `DB_USER` | Database user | postgres | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_NAME` | Database name | fashion_ecommerce | Yes |
| `DB_SSLMODE` | SSL mode | disable | No |
| `APP_ENV` | Application environment | development | No |

## Next Steps

- Implement authentication system
- Add product management endpoints
- Implement order processing
- Add payment gateway integration
- Set up logging and monitoring

## License

This project is developed as a graduation thesis.
