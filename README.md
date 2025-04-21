
# MarketTec - Student Marketplace Platform

MarketTec is a mobile marketplace platform designed specifically for students at Tecnológico Nacional de México (TecNM) campuses. The platform enables students to buy, sell, and exchange products and services within their campus community in a secure, verified environment.

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database with TypeORM
    - **Note:** In development (`NODE_ENV=development`), `synchronize: true` is enabled in the TypeORM configuration (`src/config/database.ts` or similar). This automatically updates your database schema based on your entity definitions. **WARNING:** This is convenient for development but **unsafe for production**. Production deployments should use `synchronize: false` and rely on database migrations.
- **Hexagonal Architecture** (Ports and Adapters pattern)
- **Docker** for containerization
- **JWT** for authentication

### Mobile App
- **Flutter** for cross-platform mobile development

## 📁 Project Structure

The backend follows a hexagonal architecture approach:


marketec-backend/
├── src/
│   ├── api/                  # Adapters (primary) - REST controllers, routes, validators
│   ├── application/          # Application services implementing use cases
│   ├── domain/               # Core business logic, entities, interfaces
│   ├── infrastructure/       # Adapters (secondary) - repositories, external services, migrations
│   ├── config/               # Application configuration (incl. database)
│   ├── utils/                # Utilities and helpers
│   └── server.ts             # Entry point
├── docs/                     # Documentation
├── docker-compose.dev.yml    # Docker configuration for development
├── docker-compose.prod.yml   # Docker configuration for production
├── Dockerfile.dev            # Development Dockerfile
├── Dockerfile                # Production Dockerfile
├── .env                      # Local environment variables (!!! IMPORTANT: Keep secure, don't commit secrets !!!)
└── ...


## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose (using the modern `docker compose` syntax)
- Git

### Development Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/AntoSalazar/MarketTec-Backend](https://github.com/AntoSalazar/MarketTec-Backend)
    cd marketec-backend
    ```

2.  **Create `.env` file:** Create a file named `.env` in the root of the `marketec-backend` directory. Copy the contents below, replacing `your_secret_key` with a strong, unique secret.
    ```dotenv
    NODE_ENV=development
    PORT=3000

    # Database connection details MUST match docker-compose.dev.yml
    DB_HOST=postgres
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_DATABASE=markettec # Ensure this matches POSTGRES_DB in docker-compose

    # JWT Secret
    JWT_SECRET=your_secret_key
    ```
    **Important:** Ensure `DB_DATABASE` matches the `POSTGRES_DB` value in `docker-compose.dev.yml`.

3.  **Start the development environment:**
    ```bash
    docker compose -f docker-compose.dev.yml up --build
    ```
    This command will:
    * Build the Node.js backend container (`app`) using `Dockerfile.dev`.
    * Start a PostgreSQL container (`postgres`) based on the settings in `docker-compose.dev.yml`, creating the database specified in `POSTGRES_DB` on first run.
    * Start a pgAdmin container (`pgadmin`) for database management.
    * Mount your local code (`./`) into the `app` container at `/app` for hot reloading.
    * Load environment variables from the `.env` file into the `app` container.

4.  **API Access:** The backend API should be available at:
    `http://localhost:3000` (or check `server.ts` / Express setup for specific base paths like `/api`)

5.  **pgAdmin Access:** The pgAdmin web interface will be available at:
    `http://localhost:5050`

### Accessing the Database via pgAdmin

1.  Navigate to `http://localhost:5050`.
2.  Log in with the default credentials:
    * Email: `admin@markettec.com`
    * Password: `markettect123`
3.  Register a new server connection:
    * Right-click "Servers" -> "Register" -> "Server...".
    * **General Tab:** Give it a name (e.g., `MarketTec Dev DB`).
    * **Connection Tab:**
        * Host name/address: `postgres` (the service name from `docker-compose.dev.yml`)
        * Port: `5432` (the internal container port)
        * Maintenance database: `markettec` (or `postgres`)
        * Username: `postgres`
        * Password: `postgres`
        * Optionally save the password.
    * Click **Save**.
4.  You can now browse the `markettec` database under Servers -> [Your Server Name] -> Databases -> markettec.

### Troubleshooting Common Issues

* **`Mounts denied: The path ... is not shared from the host`**:
    * **Cause:** Docker Desktop does not have permission to access your project directory for volume mounting.
    * **Fix:** Open Docker Desktop -> Settings -> Resources -> File Sharing. Add the path to your project directory (e.g., `/media/teracrow/Anto/Dev/marketec-backend` or a parent directory like `/media/teracrow/Anto`). Click "Apply & Restart".

* **`Bind for 0.0.0.0:5432 failed: port is already allocated`** (or similar port conflict for 3000, 5050):
    * **Cause:** Another process on your host machine (could be another Docker container, a native service like PostgreSQL, or another app) is already using the port Docker Compose is trying to map.
    * **Fix:**
        1.  Stop the current containers: `docker compose -f docker-compose.dev.yml down`
        2.  Find the process using the port (e.g., `sudo lsof -i :5432` on Linux/macOS or `netstat -ano | findstr "5432"` on Windows) and stop it. Check `docker ps` for other containers using the port.
        3.  If you can't stop the other process, change the *host* port mapping in `docker-compose.dev.yml`. For example, change `ports: - "5432:5432"` to `ports: - "5433:5432"`. You would then access Postgres *from your host* via port 5433, but containers connect internally using `postgres:5432`. Remember to update any host-based connection tools (like pgAdmin if connected via localhost).

* **`database "your_db_name" does not exist`**:
    * **Cause:** The application is trying to connect to a database name that doesn't match the one created by the `postgres` container or specified in your environment variables. Often happens if `DB_DATABASE` in `.env` isn't read correctly, causing the app to use a hardcoded default (like `"finsur"` in earlier examples).
    * **Fix:**
        1.  Verify `DB_DATABASE` in your `.env` file exactly matches `POSTGRES_DB` in the `postgres` service environment within `docker-compose.dev.yml` (e.g., both should be `markettec`).
        2.  Ensure the `app` service in `docker-compose.dev.yml` has `env_file: - .env`.
        3.  Perform a clean restart to ensure the database is created correctly and the `.env` file is read fresh:
            ```bash
            # Stop containers and REMOVE volumes (including database data!)
            docker compose -f docker-compose.dev.yml down -v
            # Restart
            docker compose -f docker-compose.dev.yml up --build
            ```

### Docker Configuration

*(Note: The top-level `version: "3.8"` attribute in docker-compose files is optional with modern `docker compose` and can be removed if desired.)*

#### Development (docker-compose.dev.yml)
```yaml
# version: "3.8" # Obsolete, can be removed
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      # Mount local code into container for hot-reloading
      - ./:/app
      # Use a named volume for node_modules to avoid overwriting container modules
      - node_modules:/app/node_modules
    env_file:
      # Load environment variables from .env file
      - .env
    depends_on:
      postgres:
        # Wait for postgres to be healthy before starting app
        condition: service_healthy
    # Command to run the app in development mode (e.g., with hot-reloading)
    command: ["npm", "run", "dev"]

  postgres:
    image: postgres:15-alpine
    restart: always
    ports:
      # Map host port 5432 to container port 5432
      - "5432:5432"
    environment:
      # Credentials and database name for PostgreSQL
      # POSTGRES_DB will be created on first launch if it doesn't exist
      POSTGRES_USER: postgres # Must match DB_USERNAME in .env
      POSTGRES_PASSWORD: postgres # Must match DB_PASSWORD in .env
      POSTGRES_DB: markettec # Must match DB_DATABASE in .env
    volumes:
      # Persist database data using a named volume
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      # Check if Postgres is ready to accept connections
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  pgadmin:
    image: dpage/pgadmin4
    restart: always
    ports:
      # Map host port 5050 to container port 80
      - "5050:80"
    environment:
      # Default login for pgAdmin web interface
      PGADMIN_DEFAULT_EMAIL: admin@markettec.com
      PGADMIN_DEFAULT_PASSWORD: markettect123
    depends_on:
      # Ensure postgres starts before pgadmin
      - postgres
    volumes:
      # Persist pgAdmin configuration and server definitions
      - pgadmin_data:/var/lib/pgadmin

# Define named volumes for data persistence
volumes:
  node_modules:
  postgres_data:
  pgadmin_data:

```

#### Development Dockerfile (Dockerfile.dev)
```dockerfile
# Use official Node.js 18 Alpine image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
# This layer is cached if package files don't change
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Default command to run the app in development mode
# (Matches the command in docker-compose.dev.yml)
CMD ["npm", "run", "dev"]
```

### Database Seeding

To seed the database with initial data (if a seed script exists):
```bash
docker compose -f docker-compose.dev.yml exec app npm run seed
```

## 🧪 Testing

Run tests using:
```bash
docker compose -f docker-compose.dev.yml exec app npm test
```

For test coverage:
```bash
docker compose -f docker-compose.dev.yml exec app npm run test:coverage
```

## 🚢 Production Deployment

**Important:** Production requires a different setup. You **must** disable TypeORM's `synchronize: true` and use database migrations. The `docker-compose.prod.yml` and `Dockerfile` (not `Dockerfile.dev`) should be configured for a production build and environment.

To run the application in production mode (using the production configs):

```bash
docker compose -f docker-compose.prod.yml up -d
```

*(Ensure your `docker-compose.prod.yml` and `Dockerfile` are properly set up for production needs, including handling migrations, setting `NODE_ENV=production`, managing secrets securely, and potentially using a multi-stage build for smaller images.)*

## 📝 API Documentation

API documentation is available in the docs folder:
```
/docs/api
```

## 📱 Mobile App

The MarketTec mobile app is developed using Flutter and connects to this backend. See the mobile app repository for setup instructions.

## 🌟 Features

- Secure user authentication with institutional email verification
- Product listing and Browse with categories
- Real-time messaging between buyers and sellers
- Transaction and meeting coordination
- Review and rating system
- Shopping cart for multi-item purchases
- Subscription plans for premium features
- Promotional tools for sellers
- Comprehensive safety features including user verification and reporting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- TecNM community for inspiration and feedback
- All the contributors who invest their time and effort
```