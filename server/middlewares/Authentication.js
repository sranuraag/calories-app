const { logger } = require("../utils");
const jwt = require('jsonwebtoken'); 

// Middleware for JWT authentication and extracting user data
const authenticate = async (req, res, next) => {
  try {
    logger.info("Inside authenticate.");

    // Expecting Bearer token in authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ error: "Forbidden." });
    }

    // Verifying the token and adding user data to request
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden." });
      }

      req.user = user;
      
      next();

    });
  } catch (error) {
    logger.error("Error in authenticate.");
    console.log(error);
    return res.status(403).json({ error: "Error during authentication." });
  }
};

module.exports = {
  authenticate,
};
