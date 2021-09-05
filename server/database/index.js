const { db_createUser, db_getUser } = require("./User");
const { db_getAllFoodEntries, db_getFoodEntry, db_createFoodEntry, db_updateFoodEntry, db_deleteFoodEntry } = require('./FoodEntry'); 

module.exports = {
  db_createUser,
  db_getUser,
  db_getAllFoodEntries,
  db_getFoodEntry,
  db_createFoodEntry,
  db_updateFoodEntry,
  db_deleteFoodEntry
};
