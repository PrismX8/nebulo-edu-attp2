const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

// Load environment variables from .env file
dotenv.config();

const weakJwtSecrets = new Set(['secret', 'default_secret', 'change_me', 'changeme', 'password']);
const configuredJwtSecret = String(process.env.JWT_SECRET || '').trim();
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && (!configuredJwtSecret || weakJwtSecrets.has(configuredJwtSecret.toLowerCase()) || configuredJwtSecret.length < 32)) {
  throw new Error('JWT_SECRET must be set to a strong random value in production.');
}

const jwtSecret = configuredJwtSecret || crypto.randomBytes(48).toString('hex');
if (!configuredJwtSecret && !isProduction) {
  console.warn('JWT_SECRET is not set. Using a temporary development secret for this server process.');
}

module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB Configuration
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/k-chat',
  
  // JWT Configuration
  jwtSecret,
  jwtExpiration: '24h',
  
  // File Storage Configuration
  uploadPath: process.env.UPLOAD_PATH || './uploads',

  // GitHub Configuration
  github: {
    token: process.env.GITHUB_TOKEN,
  },
  
  // SQLite Configuration (alternative/secondary DB)
  sqliteUrl: process.env.DATABASE_URL,
  
  // Application Configuration
  appDebug: process.env.APP_DEBUG === 'true',
  mcpPort: process.env.MCP_PORT || 1337,
};
