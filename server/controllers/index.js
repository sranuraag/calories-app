const { createUser, loginUser, getAllUsers, getCurrentUser } = require("./User");

const {
  getAllFoodEntries,
  getFoodEntry,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  getAdminReports,
  getDailyLimitExceededReport
} = require("./FoodEntry");

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
  getAllFoodEntries,
  getFoodEntry,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  getAdminReports,
  getDailyLimitExceededReport
};
