/**
 * Default configuration for UBG Chat
 * IMPORTANT: This file should NOT contain any actual credentials
 * All sensitive values are loaded from environment variables
 */

module.exports = {
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    debug: process.env.APP_DEBUG === 'true'
  },
  
  database: {
    sqlite: {
      enabled: true,
      url: process.env.DATABASE_URL
    }
  },

  storage: {
    local: {
      enabled: true,
      path: './uploads'
    }
  },

  integrations: {
    // GitHub integration
    github: {
      enabled: process.env.GITHUB_TOKEN ? true : false,
      token: process.env.GITHUB_TOKEN
    }
  }
};
