const { logger } = require("../utils");
const moment = require("moment");
const { executeQuery } = require("./dbConnection");

// Get all FoodEntry records from DB accessible to current user
const db_getAllFoodEntries = async (user) => {
  try {
    logger.info("Inside db_getAllFoodEntries.");

    let query = "";

    if (user.role === "Admin") {
      query = `select 
      a.id as id, 
      a.datetime as datetime, 
      a.food as food, 
      a.calories as calories, 
      a.user_id as user_id, 
      b.email as email, 
      c.total_calories as total_calories,
      b.daily_limit as daily_limit
    from 
      foodentries a, 
      users b, 
      (
        select 
          sum(calories) as total_calories, 
          user_id, 
          to_char(datetime, 'DD-MM-YYYY') as formatted_date 
        from 
          foodentries 
        group by 
          user_id, 
          formatted_date
      ) c 
    where 
      a.user_id = b.id 
      and to_char(a.datetime, 'DD-MM-YYYY') = c.formatted_date 
      and a.user_id = c.user_id 
      order by a.user_id, a.datetime desc`;
    } else {
      query = `select 
      a.id as id, 
      a.datetime as datetime, 
      a.food as food, 
      a.calories as calories, 
      a.user_id as user_id, 
      b.email as email, 
      c.total_calories as total_calories,
      b.daily_limit as daily_limit
    from 
      foodentries a, 
      users b, 
      (
        select 
          sum(calories) as total_calories, 
          user_id, 
          to_char(datetime, 'DD-MM-YYYY') as formatted_date 
        from 
          foodentries where user_id = ${user.id}
        group by 
          user_id, 
          formatted_date
      ) c 
    where 
      a.user_id = b.id 
      and a.user_id = ${user.id}
      and to_char(a.datetime, 'DD-MM-YYYY') = c.formatted_date 
      and a.user_id = c.user_id 
      order by a.user_id, a.datetime desc
    `;
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

    let query = `select id, datetime, food, calories, user_id from foodentries 
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

    let query = `insert into foodentries (datetime, food, calories, user_id, created_at) values (
            '${datetime}', '${food}', ${calorie}, ${user_id}, '${moment().toISOString()}'
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
      query += `datetime='${datetime}',`;
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

// Get Admin Report data from DB
const db_getAdminReport = async () => {
  try {
    logger.info("Inside db_getAdminReport.");

    let query = `select count(*) from foodentries where created_at >= current_date - 6`;

    let response = await executeQuery(query);

    let lastWeekCount = response[0].count;

    query = `select count(*) from foodentries where created_at >= current_date - 13 and created_at < current_date - 6`;

    response = await executeQuery(query);

    let lastToLastWeekCount = response[0].count;

    query = `select 
    round(
      avg(calories):: numeric, 
      2
    ) as avg, 
    b.email, 
    b.id 
  from 
    foodentries a, 
    users b 
  where 
    a.user_id = b.id 
    and created_at >= current_date - 6 
  group by 
    b.email, 
    b.id 
  order by 
    b.id
  `;

    let avgCalories = await executeQuery(query);

    return {
      lastWeekCount,
      lastToLastWeekCount,
      avgCalories,
    };
  } catch (error) {
    logger.error("Error in db_getAdminReport.");
    console.log(error);
    throw new Error();
  }
};

// Get Admin Report data from DB
const db_getDailyLimitExceededReport = async (user) => {
  try {
    logger.info("Inside db_getDailyLimitExceededReport.");

    let query = "";

    if (user.role === "Admin") {
      query = `select 
    a.total_calories as total_calories, 
    a.formatted_date as formatted_date, 
    b.email as email 
  from 
    (
      select 
        sum(calories) as total_calories, 
        to_char(datetime, 'DD-Mon-YYYY') as formatted_date, 
        user_id 
      from 
        foodentries 
      group by 
        formatted_date, 
        user_id
    ) a, 
    users b 
  where 
    a.user_id = b.id 
    and a.total_calories > b.daily_limit 
  order by 
    b.id, 
    to_date(a.formatted_date, 'DD-Mon-YYYY') desc
  `;
    } else {
      query = `select 
      a.total_calories as total_calories, 
      a.formatted_date as formatted_date, 
      b.email as email 
    from 
      (
        select 
          sum(calories) as total_calories, 
          to_char(datetime, 'DD-Mon-YYYY') as formatted_date, 
          user_id 
        from 
          foodentries 
        where 
          user_id = ${user.id} 
        group by 
          formatted_date, 
          user_id
      ) a, 
      users b 
    where 
      a.user_id = b.id 
      and b.id = ${user.id} 
      and a.total_calories > b.daily_limit 
    order by 
      b.id, 
      to_date(a.formatted_date, 'DD-Mon-YYYY') desc
    `;
    }

    let response = await executeQuery(query);

    return response;
  } catch (error) {
    logger.error("Error in db_getDailyLimitExceededReport.");
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
  db_getAdminReport,
  db_getDailyLimitExceededReport,
};
