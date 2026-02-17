const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const sandboxRoutes = require('./routes/sandboxRoutes');
const callbackRoutes = require('./routes/callbackRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/callbacks', callbackRoutes); // Mounted at /api/callbacks

app.get('/', (req, res) => {
  res.json({ message: 'PaySmart API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
