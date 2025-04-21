import dotenv from 'dotenv';
import path from 'path';
import { Secret } from 'jsonwebtoken';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

// Environment configuration
export const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'markettec',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
  
  // JWT Authentication
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here' as Secret,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key_here' as Secret,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  
  uploads: {
    baseDir: process.env.UPLOAD_BASE_DIR || path.join(process.cwd(), 'uploads'),
    productsDir: process.env.UPLOAD_PRODUCTS_DIR || path.join(process.cwd(), 'uploads/products'),
    categoriesDir: process.env.UPLOAD_CATEGORIES_DIR || path.join(process.cwd(),'uploads/categories'),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES 
      ? process.env.ALLOWED_MIME_TYPES.split(',') 
      : ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },

session: {
  secret: process.env.SESSION_SECRET || 'cart-session-secret-key-change-me',
  cookie: {
    maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || '604800000', 10), // Default 7 days
    secure: process.env.NODE_ENV === 'production'? true : false,
    sameSite: 'lax' as 'lax' | 'strict' | 'none' | undefined
  },
  resave: false,
  saveUninitialized: false,
  name: 'hardware.sid',
  store: {
    ttl: parseInt(process.env.SESSION_TTL || '86400', 10) // 1 day in seconds
  }
},

stripe: {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publicKey: process.env.STRIPE_PUBLIC_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  // Define your success and cancel URLs (can be frontend routes)
  checkoutSuccessUrl: process.env.STRIPE_CHECKOUT_SUCCESS_URL || 'http://localhost:3000/checkout-success', // Example frontend URL
  checkoutCancelUrl: process.env.STRIPE_CHECKOUT_CANCEL_URL || 'http://localhost:3000/checkout-cancel',   // Example frontend URL
},


email: {
  // SMTP Transport Options (for nodemailer)
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  // Set 'secure: true' if using port 465, false for 587 (typically uses STARTTLS)
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
      user: process.env.EMAIL_USER || 'user@example.com',
      pass: process.env.EMAIL_PASSWORD || 'password', // Use environment variables!
  },
  // Default sender address
  from: process.env.EMAIL_FROM || 'Your Hardware Store <noreply@yourhardwarestore.com>',
  // Default admin recipient for notifications
  adminRecipient: process.env.ADMIN_EMAIL || 'admin@yourhardwarestore.com',
  // Other email related settings
  storeName: process.env.STORE_NAME || 'Your Hardware Store',
  // Base URL used for links within emails (e.g., view order)
  baseUrl: process.env.BASE_URL || 'http://localhost:3000', // Use your frontend base URL
},
};