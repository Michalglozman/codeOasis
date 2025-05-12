// Vercel serverless handler for Express
const { createServer } = require('http');
const app = require('./dist/index');

const server = createServer(app);
module.exports = server; 