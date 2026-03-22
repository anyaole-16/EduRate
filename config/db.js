const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI environment variable is not set. Provide a MongoDB Atlas connection string.');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 10000, // Increased for Atlas network latency
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;