const dotenv = require("dotenv");
const punycode = require('punycode/');

dotenv.config();

console.log('process:', process.env);

const serverSetup = require("./server");
const logger = require("./utils/logger"); 
const PORT = process.env.PORT || 4001;

serverSetup().then(app => {
  app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
    logger.info(`Server started at PORT ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  logger.error('Failed to start server:', err);
});
