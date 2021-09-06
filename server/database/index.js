const { db_createUser, db_getUser, db_getAllUsers } = require("./User");
const { db_getAllFoodEntries, db_getFoodEntry, db_createFoodEntry, db_updateFoodEntry, db_deleteFoodEntry } = require('./FoodEntry'); 

module.exports = {
  db_createUser,
  db_getUser,
  db_getAllUsers,
  db_getAllFoodEntries,
  db_getFoodEntry,
  db_createFoodEntry,
  db_updateFoodEntry,
  db_deleteFoodEntry
};
