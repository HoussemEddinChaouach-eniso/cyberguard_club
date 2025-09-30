const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Custom static file serving that excludes index.html
app.use((req, res, next) => {
  // Don't serve index.html as static file - it's our Node.js entry point
  if (req.url === '/' || req.url === '/index.html') {
    return next();
  }
  express.static('.')(req, res, next);
});

// Import the flag state handler
const flagStateHandler = require('./api/flag-state');

// API route
app.all('/api/flag-state', async (req, res) => {
  try {
    // Call the handler directly
    await flagStateHandler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cyberguards eniso.html'));
});

// Catch all other routes and serve the main HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'cyberguards eniso.html'));
});

app.listen(port, () => {
  console.log(`🚀 CyberGuards CTF Server running on port ${port}`);
  console.log(`🌐 Access at: http://localhost:${port}`);
});