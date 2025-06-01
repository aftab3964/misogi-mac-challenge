const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Add this CORS configuration
app.use(cors({
  origin: '*', // In production, replace '*' with the actual frontend URL for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB connection error:", err));



const pdfRoutes = require('./routes/pdf');
app.use('/api/pdf', pdfRoutes);

const queryRoutes = require('./routes/query');
app.use('/api/query', queryRoutes);


app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
