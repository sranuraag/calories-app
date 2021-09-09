const { db_createUser, db_getUser, db_getUserById, db_getAllUsers } = require("./User");
const { db_getAllFoodEntries, db_getFoodEntry, db_createFoodEntry, db_updateFoodEntry, db_deleteFoodEntry, db_getAdminReport, db_getDailyLimitExceededReport, db_insertTestData } = require('./FoodEntry'); 

module.exports = {
  db_createUser,
  db_getUser,
  db_getUserById,
  db_getAllUsers,
  db_getAllFoodEntries,
  db_getFoodEntry,
  db_createFoodEntry,
  db_updateFoodEntry,
  db_deleteFoodEntry,
  db_getAdminReport,
  db_getDailyLimitExceededReport,
  db_insertTestData
};
