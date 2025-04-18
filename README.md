# MarketTec - Student Marketplace Platform

MarketTec is a mobile marketplace platform designed specifically for students at Tecnológico Nacional de México (TecNM) campuses. The platform enables students to buy, sell, and exchange products and services within their campus community in a secure, verified environment.

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database with TypeORM
- **Hexagonal Architecture** (Ports and Adapters pattern)
- **Docker** for containerization
- **JWT** for authentication

### Mobile App
- **Flutter** for cross-platform mobile development

## 📁 Project Structure

The backend follows a hexagonal architecture approach:

```
marketec-backend/
├── src/
│   ├── api/                  # Adapters (primary) - REST controllers, routes, validators
│   ├── application/          # Application services implementing use cases
│   ├── domain/               # Core business logic, entities, interfaces
│   ├── infrastructure/       # Adapters (secondary) - repositories, external services
│   ├── config/               # Application configuration
│   ├── utils/                # Utilities and helpers
│   └── server.ts             # Entry point
├── docs/                     # Documentation
├── docker-compose.dev.yml    # Docker configuration for development
├── docker-compose.prod.yml   # Docker configuration for production
├── Dockerfile.dev            # Development Dockerfile
├── Dockerfile                # Production Dockerfile
└── ...
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/marketec-backend.git
   cd marketec-backend
   ```

2. Create a `.env` file with your environment variables:
   ```
   NODE_ENV=development
   PORT=3000
   DB_HOST=postgres
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=markettec
   JWT_SECRET=your_secret_key
   ```

3. Start the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   This will:
   - Build the Node.js backend container using Dockerfile.dev
   - Start a PostgreSQL database
   - Start pgAdmin for database management
   - Mount your local code for hot reloading
   - Set up the necessary environment variables

4. The API will be available at:
   ```
   http://localhost:3000/api
   ```

5. pgAdmin will be available at:
   ```
   http://localhost:5050
   ```
   Use the following credentials:
   - Email: admin@markettec.com
   - Password: markettect123



### Running Migrations

1. Create a new migration:
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npm run migration:create -- src/infrastructure/database/migrations/MigrationName
   ```

2. Generate a migration from entity changes:
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npm run migration:generate -- src/infrastructure/database/migrations/MigrationName
   ```

3. Run migrations:
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npm run migration:run
   ```

4. Revert a migration:
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npm run migration:revert
   ```

### Database Seeding

To seed the database with initial data:
```bash
docker-compose -f docker-compose.dev.yml exec app npm run seed
```

## 🧪 Testing

Run tests using:
```bash
docker-compose -f docker-compose.dev.yml exec app npm test
```

For test coverage:
```bash
docker-compose -f docker-compose.dev.yml exec app npm run test:coverage
```

## 🚢 Production Deployment

To run the application in production mode:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 API Documentation

API documentation is available in the docs folder:
```
/docs/api
```

## 📱 Mobile App

The MarketTec mobile app is developed using Flutter and connects to this backend. See the mobile app repository for setup instructions.

## 🌟 Features

- Secure user authentication with institutional email verification
- Product listing and browsing with categories
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