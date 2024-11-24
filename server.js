// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
// const router = require("./routes/routes");
// const swaggerSpec = require("./docs/swaggerConfig");
// const swaggerUi = require("swagger-ui-express");

// require("./Config/db");
// dotenv.config();
// const cors = require("cors");
// const corsOptions = {
//   origin: "*",
//   credential: true,
// };

// const server = () => {
//   app.use(cors(corsOptions));
//   app.use(express.json());
//   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//   app.use("/healthCheck",(req,res)=>{
//     res.status(200).send("I am ok");
//   });
//   app.use("/v1", router);
//   return app;
// };

// module.exports = server;

const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/routes");
const swaggerSpec = require("./docs/swaggerConfig");
const swaggerUi = require("swagger-ui-express");
const { connectDB } = require("./Config/db");

dotenv.config();

const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
};

const server = async () => {
  await connectDB();  // Connect to the database

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/healthCheck", (req, res) => {
    res.status(200).send("I am ok");
  });
  app.use("/v1", router);
  app.use((req, res, next) => {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    console.error(error.message);
    res.json({
      message: error.message,
    });
  });

  return app;
};

module.exports = server;
