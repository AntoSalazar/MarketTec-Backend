import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan'; // For HTTP request logging
import swaggerJsdoc from 'swagger-jsdoc'; // To generate Swagger spec from JSDoc
import swaggerUi from 'swagger-ui-express'; // To serve Swagger UI
import path from 'path'; // Needed for swaggerJsdoc options

import { AppDataSource } from '@infrastructure/database/dataSource';
import { environment } from '@config/environment';
import { logger } from '@config/logger';
import routes from '@api/routes'; // Your main API routes
import { notFoundHandler, errorHandler } from '@api/middlewares/errorHandler';
// import { setupStaticFileServing } from '@api/middlewares/staticfiles'; // Keep if needed
// import session from 'express-session'; // Keep if needed
// import { TypeormStore } from 'connect-typeorm'; // Keep if needed
// import { Session } from '@domain/entities/session/Session.entity'; // Keep if needed

// Initialize express app
const app = express();

// --- Core Middleware ---
app.use(cors({
  origin: environment.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Added OPTIONS for preflight requests
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Often needed if frontend sends cookies/auth headers
}));
app.use(helmet()); // Basic security headers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- HTTP Request Logging (Integrated with Winston) ---
const stream = {
  write: (message: string) => {
    logger.http(message.trim()); // Log HTTP requests via Winston
  },
};
// Use 'combined' format in production for detailed logs, 'dev' in development for color-coded concise logs
app.use(morgan(environment.nodeEnv === 'production' ? 'combined' : 'dev', { stream }));

// --- Static Files (Uncomment and configure if needed) ---
// app.use(setupStaticFileServing());

// --- Session Management (Uncomment and configure if needed) ---
/*
const initializeSession = async () => {
  if (!AppDataSource.isInitialized) {
    logger.warn('DataSource not initialized when setting up session. Ensure DB connects first.');
    // Handle this case - maybe wait or throw error
    return;
  }
  try {
    const sessionRepository = AppDataSource.getRepository(Session);
    app.use(session({
      secret: environment.session.secret,
      resave: environment.session.resave,
      saveUninitialized: environment.session.saveUninitialized,
      name: environment.session.name,
      cookie: {
        maxAge: environment.session.cookie.maxAge,
        secure: environment.session.cookie.secure, // Should be true in production (requires HTTPS)
        httpOnly: true, // Prevent client-side JS access
        sameSite: environment.session.cookie.sameSite,
      },
      store: new TypeormStore({
        cleanupLimit: 2, // Max number of simultaneous cleanup processes
        limitSubquery: false, // Adjust based on DB performance if needed
        ttl: environment.session.store.ttl, // Session time-to-live in seconds
      }).connect(sessionRepository),
    }));
    logger.info('Session middleware initialized with TypeORM store.');
  } catch (error) {
    logger.error('Failed to initialize session store:', error);
    // Decide if this is critical - maybe exit?
    // process.exit(1);
  }
};
*/

// --- Swagger API Documentation Setup ---
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Finsur API', // Your API Title
      version: '1.0.0', // Your API version
      description: 'API documentation for the Finsur application',
      contact: {
        name: 'API Support',
        // url: 'http://www.example.com/support', // Optional support URL
        // email: 'support@example.com', // Optional support email
      },
      license: { // Optional license info
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [ // Describe the servers where the API is hosted
      {
        url: `http://localhost:${environment.port}${environment.apiPrefix}`,
        description: 'Development server',
      },
      // Add other servers like staging or production here
      // {
      //   url: `https://api.yourdomain.com${environment.apiPrefix}`,
      //   description: 'Production server',
      // }
    ],
    components: { // Reusable components like security schemes, schemas
      securitySchemes: {
        bearerAuth: { // Example for JWT Bearer token
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      // Define reusable schemas here (e.g., for request bodies, responses)
      // schemas: {
      //   ErrorResponse: { ... }, // Define your standard error response schema
      //   User: { ... } // Define your User schema
      // }
    },
    security: [ // Global security requirements (can be overridden per operation)
      {
        bearerAuth: [], // Requires Bearer token authentication globally
      },
    ],
  },
  // Path to the API docs files containing JSDoc comments
  // Adjust the path according to your project structure
  apis: [
      path.join(__dirname, './api/routes/**/*.ts'), // Scan all .ts files in the routes directory
      path.join(__dirname, './domain/dto/**/*.ts'), // Scan DTO files if they contain schemas
      // Add paths to controllers if they contain the JSDoc comments
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Optional: Serve the raw swagger JSON spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// --- Main API Routes ---
app.use(environment.apiPrefix, routes);

// --- Error Handling Middleware (Must be LAST) ---
app.use(notFoundHandler); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

// --- Start Server Function ---
const startServer = async () => {
  try {
    logger.info('Connecting to database...');
    await AppDataSource.initialize();
    logger.info('Database connection established successfully.');

    // Initialize session management AFTER database connection is established
    // await initializeSession(); // Uncomment if using sessions

    const PORT = environment.port;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${environment.nodeEnv} mode`);
      logger.info(`API available at: http://localhost:${PORT}${environment.apiPrefix}`);
      logger.info(`API Docs available at: http://localhost:${PORT}/api-docs`); // Log Swagger UI URL
    });
  } catch (error) {
    logger.error('Failed to initialize application:', {
        message: (error instanceof Error) ? error.message : 'Unknown error',
        stack: (error instanceof Error) ? error.stack : undefined,
        error // Log the full error object
    });
    process.exit(1); // Exit if initialization fails
  }
};

// --- Graceful Shutdown / Error Handling ---
const handleExit = (signal: string) => {
  logger.info(`Received ${signal}. Closing server gracefully...`);
  // Add cleanup logic here (e.g., close DB connection if needed, though TypeORM might handle it)
  AppDataSource.destroy()
    .then(() => logger.info('Database connection closed.'))
    .catch(err => logger.error('Error closing database connection:', err))
    .finally(() => process.exit(0)); // Exit after cleanup
};

process.on('SIGINT', () => handleExit('SIGINT')); // Ctrl+C
process.on('SIGTERM', () => handleExit('SIGTERM')); // Termination signal

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', { reason, promise });
  // Decide if you want to exit. Exiting is often safer for unhandled rejections.
  // Consider implementing graceful shutdown here too before exiting.
  process.exit(1);
});

process.on('uncaughtException', (err, origin) => {
  logger.error('Uncaught Exception:', { message: err.message, stack: err.stack, origin });
  // It's generally recommended to exit after an uncaught exception.
  // Consider implementing graceful shutdown here too before exiting.
  process.exit(1);
});

// --- Start the Application ---
startServer();

export default app; // Export for testing or other potential uses
