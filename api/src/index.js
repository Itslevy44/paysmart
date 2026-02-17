const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(cors({
  origin: true, // Reflect the request origin, creating a "permissive" CORS policy
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Explicitly handle preflight requests for all routes
app.options('*', cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/callbacks', callbackRoutes); // Mounted at /api/callbacks
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'PaySmart API is running' });
});

// For Vercel, we need to export the app
module.exports = app;

// Only listen if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
