const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quizify_db';
  
  try {
    console.log('Attempting to connect to MongoDB server...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn('Local MongoDB connection failed or not available. Initializing In-Memory MongoDB Server...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected successfully at ${mongoUri}`);
    } catch (memErr) {
      console.error(`Error starting MongoMemoryServer: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
