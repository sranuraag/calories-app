const { logger } = require("../utils");
const bcrypt = require("bcrypt");
const { db_getUser, db_getAllUsers } = require("../database");
const jwt = require("jsonwebtoken");

const sanitizeUserDetails = async (first_name, last_name, email, password) => {
  try {
    logger.info("Inside sanitizeUserDetails");

    // Handling undefined
    first_name = first_name ? first_name : "";
    last_name = last_name ? last_name : "";

    const email_regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Validate that email and password have non-empty values
    if (!(email && password)) {
      logger.error("Email or password is blank.");
      return {
        valid: false,
        error: "Email and Password fields cannot be blank.",
      };
    }

    email = email.toLowerCase();

    // Validate email is of valid format
    if (!email_regex.test(email)) {
      logger.error("Email is not valid.");
      return {
        valid: false,
        error: "Email is not valid.",
      };
    }

    // Hash password for storing in DB
    const hashedPassword = await bcrypt.hash(password, 10);

    return {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      valid: true,
    };
  } catch (error) {
    logger.error("Error in sanitizeUserDetails.");
    console.log(error);
    throw new Error();
  }
};

const getUser = async (email) => {
  try {
    logger.info("Inside getUser.");

    // Get user based on email
    let queryResponse = await db_getUser(email);

    return queryResponse;
  } catch (error) {
    logger.error("Error in getUser.");
    console.log(error);
    throw new Error();
  }
};

const loginUserService = async (email, password) => {
  try {
    logger.info("Inside loginUserService.");

    // Check if email or password fields are blank
    if (!(email && password)) {
      return {
        valid: false,
        error: "Email and Password fields cannot be blank.",
      };
    }

    email = email.toLowerCase();

    let getUserResponse = await getUser(email);

    console.log(getUserResponse);

    if (getUserResponse.length > 0) {
      let user = getUserResponse[0];
      if (await bcrypt.compare(password, user.password)) {
        delete user["password"];
        console.log(user);
        let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        return {
          valid: true,
          jwt: accessToken,
          user: user,
        };
      } else {
        return {
          valid: false,
          error: "Password is incorrect.",
        };
      }
    } else {
      return {
        valid: false,
        error: "User not found.",
      };
    }
  } catch (error) {
    logger.error("Error in loginUserService.");
    console.log(error);
    throw new Error();
  }
};

const getAllUsersService = async (user) => {
  try {
    logger.info("Inside getAllUsersService.");

    // Validating that current user is an Admin
    if (user.role !== 'Admin') {
      return {
        valid: false,
        error: 'Only Admin user can access user details.'
      }
    }

    // Get all user details
    let queryResponse = await db_getAllUsers();

    return {
      valid: true,
      data: queryResponse
    };
  } catch (error) {
    logger.error("Error in getAllUsersService.");
    console.log(error);
    throw new Error();
  }
}

module.exports = {
  sanitizeUserDetails,
  getUser,
  loginUserService,
  getAllUsersService
};
