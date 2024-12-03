const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Example API key stored in .env file
const API_KEY = "123456789";

// Middleware to authenticate the API key
app.use((req, res, next) => {
  const userApiKey = req.header('X-API-Key');
  if (userApiKey && userApiKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
});

// Example endpoint
app.get('/ping', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));