const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Trivia Tiles API',
    version: '1.0.0',
    description: 'Backend API for the Trivia Tiles word puzzle game',
    endpoints: {
      health: '/health',
      puzzle: '/api/puzzle',
      analytics: '/api/analytics'
    },
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'trivia-tiles-server',
    version: '1.0.0'
  });
});

// API Routes
app.get('/api/puzzle', (req, res) => {
  const samplePuzzle = {
    center: 'A',
    outer: ['B', 'C', 'D', 'E', 'F', 'G'],
    validWords: ['CAB', 'BAD', 'FAD', 'FACE', 'AGED', 'BADGE', 'FADED'],
    triviaClues: [
      "This city is famously known as the 'City of Light.'",
      "This city is home to the Louvre museum.",
      "You can visit the Eiffel Tower here.",
      "It's the capital city of France."
    ],
    finalTrivia: {
      question: "What city do these clues describe?",
      answer: "Paris"
    }
  };
  res.json(samplePuzzle);
});

// Analytics endpoint
app.post('/api/analytics', (req, res) => {
  console.log('Analytics event:', req.body);
  res.json({ success: true });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Trivia Tiles server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 API endpoint: http://localhost:${PORT}/api/puzzle`);
});
