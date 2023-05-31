const express = require('express');
const characters = require('./routes/characters');
const cors = require('cors');

const app = express();
const port = 3001;

// Apply CORS middleware to all routes
app.use(cors());

// Använd JSON-middleware
app.use(express.json());

const validApiKey = '5';

const authenticateApiKey = (req, res, next) => {
  const apiKey = req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({ message: 'Inga karaktärer till dig! Din api key saknas.' });
    // returnera 401
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({ message: 'Invalid API key' });
  }

  next();
};

app.use((req, res, next) => {
  authenticateApiKey(req, res, next);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/characters', characters);

// Starta servern på angiven port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
