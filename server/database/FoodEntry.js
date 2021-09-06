const { logger } = require("../utils");
const moment = require("moment");
const { executeQuery } = require("./dbConnection");

// Get all FoodEntry records from DB accessible to current user
const db_getAllFoodEntries = async (user) => {
  try {
    logger.info("Inside db_getAllFoodEntries.");

    let query = "";

    if (user.role === "Admin") {
      query = `select a.id as id, EXTRACT( EPOCH FROM a.datetime ) as datetime, a.food as food, a.calories as calories, a.user_id as user_id, b.email as email  from foodentries a, users b where 
      a.user_id = b.id`;
    } else {
      query = `select a.id as id, EXTRACT( EPOCH FROM a.datetime ) as datetime, a.food as food, a.calories as calories, a.user_id as user_id, b.email as email  from foodentries a, users b where 
      a.user_id = b.id and user_id = ${user.id}`;
    }

    let response = await executeQuery(query);

    return response;
  } catch (error) {
    logger.error("Error in db_getAllFoodEntries.");
    console.log(error);
    throw new Error();
  }
};

// Get FoodEntry record based on ID
const db_getFoodEntry = async (foodEntryId) => {
  try {
    logger.info("Inside db_getFoodEntry.");

    let query = `select id, EXTRACT( EPOCH FROM datetime ), food, calories, user_id from foodentries 
    where id = ${foodEntryId}`;

    let response = await executeQuery(query);

    return response;
  } catch (error) {
    logger.error("Error in db_getFoodEntry.");
    console.log(error);
    throw new Error();
  }
};

// Create FoodEntry record in DB
const db_createFoodEntry = async (datetime, food, calorie, user_id) => {
  try {
    logger.info("Inside db_createFoodEntry.");

    let query = `insert into foodentries (datetime, food, calories, user_id) values (
            to_timestamp(${datetime}), '${food}', ${calorie}, ${user_id}
        )`;

    let response = await executeQuery(query);

    return response;
  } catch (error) {
    logger.error("Error in db_createFoodEntry.");
    console.log(error);
    throw new Error();
  }
};

// Update FoodEntry record in DB
const db_updateFoodEntry = async (
  datetime,
  food,
  calories,
  user_id,
  foodEntryId
) => {
  try {
    logger.info("Inside db_createFoodEntry.");

    let query = `update foodentries set `;

    if (datetime) {
      query += `datetime=to_timestamp(${datetime}),`;
    }
    if (food) {
      query += `food='${food}',`;
    }
    if (calories) {
      query += `calories=${calories},`;
    }
    if (user_id) {
      query += `user_id=${user_id},`;
    }

    query = query.replace(/,\s*$/, "");

    query += `where id=${foodEntryId}`;

    let response = await executeQuery(query);

    return response;
  } catch (error) {
    logger.error("Error in db_createFoodEntry.");
    console.log(error);
    throw new Error();
  }
};

// Delete FoodEntry record in DB
const db_deleteFoodEntry = async (foodEntryId) => {
  try {
    logger.info("Inside db_deleteFoodEntry.");

    let query = `delete from foodentries where id = ${foodEntryId}`;

    let response = await executeQuery(query);

    return response;
  } catch (error) {
    logger.error("Error in db_deleteFoodEntry.");
    console.log(error);
    throw new Error();
  }
};

module.exports = {
  db_getAllFoodEntries,
  db_getFoodEntry,
  db_createFoodEntry,
  db_updateFoodEntry,
  db_deleteFoodEntry,
};
