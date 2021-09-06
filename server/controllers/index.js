const { createUser, loginUser, getAllUsers } = require("./User");

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
  getAllUsers,
  getAllFoodEntries,
  getFoodEntry,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
};
