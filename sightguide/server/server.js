const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes.js');
const contactRoutes = require('./routes/contact.routes.js');
const logRoutes = require('./routes/log.routes.js');

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/logs', logRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
