const { logger } = require("../utils");
const {
  getAllFoodEntriesService,
  getFoodEntryService,
  createFoodEntryService,
  updateFoodEntryService,
  deleteFoodEntryService,
  getAdminReportsService,
  getDailyLimitExceededReportService
} = require("../services");

// Controller for GET /foodentry
const getAllFoodEntries = async (req, res) => {
  try {
    logger.info("Inside getAllFoodEntries.");

    let user = req.user;

    // Call getAllFoodEntriesService available in services folder
    let response = await getAllFoodEntriesService(user);

    if (response.valid) {
      return res.status(200).json({ data: response.data });
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    logger.error("Error in getAllFoodEntries.");
    console.log(error);
    return res.status(500).json({ error: "Error while getting FoodEntries." });
  }
};

// Controller for GET /foodentry/:id
const getFoodEntry = async (req, res) => {
  try {
    logger.info("Inside getFoodEntry.");

    let user = req.user;
    let foodEntryId = req.params.id;

    // Call getFoodEntryService available in services folder
    let response = await getFoodEntryService(user, foodEntryId);

    if (response.valid) {
      return res.status(200).json({ data: response.data });
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    logger.error("Error in getFoodEntry.");
    console.log(error);
    return res.status(500).json({ error: "Error while getting FoodEntry." });
  }
};

// Controller for POST /foodentry
const createFoodEntry = async (req, res) => {
  try {
    logger.info("Inside createFoodEntry.");

    let { datetime, food, calories, user_id } = req.body;
    let user = req.user;

    // Call createFoodEntryService available in services folder
    let response = await createFoodEntryService(
      datetime,
      food,
      calories,
      user_id,
      user
    );

    if (response.valid) {
      return res.status(201).json({ data: response.data });
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    logger.error("Error in createFoodEntry.");
    console.log(error);
    return res.status(500).json({ error: "Error while creating FoodEntry." });
  }
};

// Controller for PUT /foodentry/:id
const updateFoodEntry = async (req, res) => {
  try {
    logger.info("Inside updateFoodEntry.");

    let { datetime, food, calories, user_id } = req.body;
    let user = req.user;
    let foodEntryId = req.params.id;

    // Call updateFoodEntryService available in services folder
    let response = await updateFoodEntryService(
      datetime,
      food,
      calories,
      user_id,
      user,
      foodEntryId
    );

    if (response.valid) {
      return res.status(200).json({ data: response.data });
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    logger.error("Error in updateFoodEntry.");
    console.log(error);
    return res.status(500).json({ error: "Error while updating FoodEntry." });
  }
};

// Controller for DELETE /foodentry/:id
const deleteFoodEntry = async (req, res) => {
  try {
    logger.info("Inside deleteFoodEntry.");

    let user = req.user;
    let foodEntryId = req.params.id;

    // Call deleteFoodEntryService available in services folder
    let response = await deleteFoodEntryService(user, foodEntryId);

    if (response.valid) {
      return res.status(200).json({ data: response.data });
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    logger.error("Error in deleteFoodEntry.");
    console.log(error);
    return res.status(500).json({ error: "Error while deleting FoodEntry." });
  }
};


// Controller for GET /foodentry/adminreports
const getAdminReports = async (req, res) => {
  try {
    logger.info("Inside getAdminReports.");

    let user = req.user;

    // Call getAdminReportsService available in services folder
    let response = await getAdminReportsService(user);

    if (response.valid) {
      return res.status(200).json({ data: response.data });
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    logger.error("Error in getAdminReports.");
    console.log(error);
    return res.status(500).json({ error: "Error while fetching Admin reports data." });
  }
};

// Controller for GET /foodentry/daily_limit_exceeded_report
const getDailyLimitExceededReport = async (req, res) => {
  try {
    logger.info("Inside getDailyLimitExceededReport.");

    let user = req.user;

    // Call getDailyLimitExceededReportService available in services folder
    let response = await getDailyLimitExceededReportService(user);

    if (response.valid) {
      return res.status(200).json({ data: response.data });
    } else {
      return res.status(400).json({ error: response.error });
    }
  } catch (error) {
    logger.error("Error in getDailyLimitExceededReport.");
    console.log(error);
    return res.status(500).json({ error: "Error while fetching Daily Limit Exceeded Report." });
  }
};

module.exports = {
  getAllFoodEntries,
  getFoodEntry,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
  getAdminReports,
  getDailyLimitExceededReport
};
