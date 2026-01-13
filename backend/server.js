const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().then(() => {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/images', require('./routes/imageRoutes'));

  app.get('/', (req, res) => {
    res.json({ message: 'Image Generator API is running' });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});
