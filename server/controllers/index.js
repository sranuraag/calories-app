const { createUser, loginUser } = require("./User");

const {
  getAllFoodEntries,
  getFoodEntry,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
} = require("./FoodEntry");

module.exports = {
  createUser,
  loginUser,
  getAllFoodEntries,
  getFoodEntry,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
};
