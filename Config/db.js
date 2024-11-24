// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const logger = require("../utils/logger"); 

// dotenv.config();
// const conn = mongoose
//   .connect('mongodb://localhost:27017/Task2')
//   .then(() => {
//     logger.info("MongoDB is connected");
//     console.log("MongoDB is connected");

//   })
//   .catch((err) => {
//     logger.error("MongoDB connection error", err);
//   });

// module.exports = conn;

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");
const logger = require("../utils/logger");

dotenv.config();

let mongoServer;

const connectDB = async () => {
  console.log(">>>>>>>>>>",process.env.NODE_ENV);
  const dbURI = process.env.NODE_ENV === 'test'
    ? await getTestDBUri()
    : process.env.MONGODB_URL|| 'mongodb://localhost:27017/Task2';

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info("MongoDB is connected");
      console.log("MongoDB is connected");
    } catch (err) {
      logger.error("MongoDB connection error", err);
    }
  }
};

const getTestDBUri = async () => {
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
  }
  return mongoServer.getUri();
};

const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
};

const clearTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

module.exports = { connectDB, closeTestDB, clearTestDB };

