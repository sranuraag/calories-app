const { logger } = require("../utils");
const { db_createUser } = require("../database");
const {
  sanitizeUserDetails,
  getUser,
  loginUserService,
  getAllUsersService
} = require("../services");

// Controller for POST /users
const createUser = async (req, res) => {
  try {
    logger.debug("Inside create User controller");

    console.log(req.body);

    // Extract user details from request body
    let { first_name, last_name, email, password } = req.body;

    // Validate and sanitize user data before inserting into DB
    let user = await sanitizeUserDetails(
      first_name,
      last_name,
      email,
      password
    );

    // Check if email already exists
    let getUserResponse = await getUser(user.email);
    let emailExists = getUserResponse.length > 0 ? true : false;

    if (user.valid && !emailExists) {
      await db_createUser(
        user.first_name,
        user.last_name,
        user.email,
        user.password
      );
    } else if (!user.valid) {
      return res.status(400).json({ error: user.error });
    } else if (emailExists) {
      let error = user.error;
      return res.status(400).json({ error: "Email already exists." });
    }

    return res.status(201).json({ status: "success" });
  } catch (error) {
    logger.error("Error in createUser.");
    console.log(error);
    return res.status(500).json({ error: "Error while creating user." });
  }
};

// Controller for POST /users/login
const loginUser = async (req, res) => {
  try {
    logger.info("Inside loginUser.");

    let { email, password } = req.body;

    // Call loginUserService available in services folder
    let user = await loginUserService(email, password);

    if (user.valid) {
      return res
        .status(200)
        .json({ status: "success", jwt: user.jwt, user: user.user });
    } else {
      return res.status(400).json({ error: user.error });
    }
  } catch (error) {
    logger.error("Error in loginUser.");
    console.log(error);
    return res.status(500).json({ error: "Error while logging in user." });
  }
};

// Controller for GET /users
const getAllUsers = async (req, res) => {
  try {
    logger.info("Inside getAllUsers.");

    let user = req.user;

    // Call getAllUsersService available in services folder
    let response = await getAllUsersService(user);

    if (response.valid) {
      return res.status(200).json({ status: "success", data: response.data });
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    logger.error("Error in getAllUsers.");
    console.log(error);
    return res.status(500).json({ error: "Error while fetching users." });
  }
};

module.exports = { createUser, loginUser, getAllUsers };
