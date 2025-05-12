// Vercel serverless handler for Express
const { createServer } = require('http');

// Import the Express app - try/catch to handle potential import errors
let app;
try {
  app = require('./dist/index');
  
  // If app is an object with a default property (ES module), use the default export
  if (app && app.default && typeof app.default.listen === 'function') {
    app = app.default;
  }
} catch (error) {
  console.error('Error importing app:', error);
  
  // Create a minimal Express-like error response
  app = (req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Server initialization failed',
      message: error.message
    }));
  };
}

// Create and export the server
const server = createServer(app);
module.exports = server; 