// Simple test file to verify deployment
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ 
    message: 'Sri Chakra Dairy Backend Test',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend is working!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

module.exports = app;
