const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const elementRoutes = require('./routes/element');
const partRoutes = require('./routes/part');
const userRoutes = require('./routes/user');
const standardAlloyRoutes = require('./routes/standardAlloy');

const initializeDatabase = require('./utils/databaseInitializer'); // Import initializer

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/elements', elementRoutes);
app.use('/parts', partRoutes);
app.use('/user', userRoutes);
app.use('/standardAlloy', standardAlloyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Database connection and server start
const startServer = async () => {
  try {
    const mongoURI = 'mongodb://127.0.0.1:27017/CompactnessCalculator'; // Hardcoded MongoDB URI

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Initialize the database with default data
    await initializeDatabase();

    const port = 4000; // Default port
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

startServer();
