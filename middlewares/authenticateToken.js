const jwt = require("jsonwebtoken");
const SystemResponse = require("../utils/response-handler/SystemResponse");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json(SystemResponse.unAuthenticated("UnAuthorized"));
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
    if (err) {
      return res
        .status(403)
        .json(SystemResponse.unAuthenticated("Invalid or expired token."));
    }
    req.body.email = data.email;

    next();
  });
};

module.exports = authenticateToken;
