if (process.env.NODE_ENV !== 'production') {
  // Only load .env files in non-production environments
  const dotenv = require('dotenv');
  dotenv.config();
}

// Your server code continues... 