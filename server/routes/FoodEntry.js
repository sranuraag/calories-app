const express = require("express");

const {
  getAllFoodEntries,
  getFoodEntry,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  getAdminReports,
  getDailyLimitExceededReport
} = require("../controllers");

const { authenticate } = require("../middlewares");

const FoodEntryRouter = express.Router();

FoodEntryRouter.use(authenticate);

FoodEntryRouter.get("/adminreports", getAdminReports)

FoodEntryRouter.get("/daily_limit_exceeded_report", getDailyLimitExceededReport)

FoodEntryRouter.get("/", getAllFoodEntries);

FoodEntryRouter.get("/:id", getFoodEntry);

FoodEntryRouter.post("/", createFoodEntry);

FoodEntryRouter.put("/:id", updateFoodEntry);

FoodEntryRouter.delete("/:id", deleteFoodEntry);

module.exports = { FoodEntryRouter };
