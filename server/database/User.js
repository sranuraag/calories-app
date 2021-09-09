const { executeQuery } = require("./dbConnection");
const { logger } = require("../utils");

const db_createUser = async (first_name, last_name, email, hashedPassword) => {
  try {
    logger.info("Inside db_createUser.");
    let query = `insert into users (first_name, last_name, email, password, role) values ('${first_name}','${last_name}','${email}','${hashedPassword}', 'User')`;
    let result = await executeQuery(query);
    console.log(result);
    return result;
  } catch (error) {
    logger.error("Error in db_createUser.");
    console.log(error);
    throw new Error();
  }
};

const db_getUser = async (email) => {
  try {
    logger.info("Inside db_getUser.");

    let query = `select * from users where email = '${email}'`;

    let result = await executeQuery(query);

    return result;
  } catch (error) {
    logger.error("Error in db_getUser");
    console.log(error);
    throw new Error();
  }
};

const db_getUserById = async (user_id) => {
  try {
    logger.info("Inside db_getUserById.");

    let query = `select * from users where id = '${user_id}'`;

    let result = await executeQuery(query);

    return result;
  } catch (error) {
    logger.error("Error in db_getUserById");
    console.log(error);
    throw new Error();
  }
};

const db_getAllUsers = async () => {
  try {
    logger.info("Inside db_getAllUsers.");

    let query = `select id, email, first_name, last_name, role from users where role != 'Admin'`;

    let result = await executeQuery(query);

    return result;

  } catch (error) {
    logger.error("Error in db_getAllUsers");
    console.log(error);
    throw new Error();
  }
}

module.exports = {
  db_createUser,
  db_getUser,
  db_getUserById,
  db_getAllUsers
};
