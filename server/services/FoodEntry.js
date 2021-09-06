const moment = require('moment'); 
const { logger } = require("../utils");
const {
  db_getAllFoodEntries,
  db_getFoodEntry,
  db_createFoodEntry,
  db_updateFoodEntry,
  db_deleteFoodEntry,
} = require("../database");

const getAllFoodEntriesService = async (user) => {
  try {
    logger.info("Inside getAllFoodEntriesService.");

    // Get all food entries
    let response = await db_getAllFoodEntries(user);

    return {
      valid: true,
      data: response,
    };
  } catch (error) {
    logger.error("Error in getAllFoodEntriesService");
    console.log(error);
    throw new Error();
  }
};

const getFoodEntryService = async (user, foodEntryId) => {
  try {
    logger.info("Inside getFoodEntryService.");

    // Get FoodEntry based on ID
    let response = await db_getFoodEntry(foodEntryId);

    if (response.length === 0) {
      return {
        valid: false,
        error: "FoodEntry record not found.",
      };
    }

    // Validating if user has access to the FoodEntry record
    if (user.role === "Admin") {
      return {
        valid: true,
        data: response,
      };
    } else {
      if (response[0].user_id === user.id) {
        return {
          valid: true,
          data: response,
        };
      } else {
        return {
          valid: false,
          error: "User does not have access to this FoodEntry record.",
        };
      }
    }
  } catch (error) {
    logger.error("Error in getFoodEntryService");
    console.log(error);
    throw new Error();
  }
};

const createFoodEntryService = async (
  datetime,
  food,
  calories,
  user_id,
  user
) => {
  try {
    logger.info("Inside createFoodEntryService.");

    // Validating if mandatory fields are present
    if (!(datetime && food && calories)) {
      return {
        valid: false,
        error: "DateTime, Food and Calories are mandatory fields.",
      };
    }

    // Only Admin can create FoodEntry on behalf of other users
    if (user.role !== "Admin" && user_id) {
      return {
        valid: false,
        error: "Only Admin user can provide User ID while creating FoodEntry.",
      };
    }

    // Admin has to specify User ID mandatorily while creating FoodEntry
    if (user.role == "Admin" && !user_id) {
      return {
        valid: false,
        error: "User ID is mandatory to be provided for Admin user.",
      };
    }

    // Validating that datetime provided is not future dated
    if (datetime > moment().valueOf()) {
      return {
        valid: false,
        error: "Date/Time cannot be future dated.",
      };
    }

    // Setting the current user ID as the one for FoodEntry record
    if (!user_id) {
      user_id = user.id;
    }

    // Create Food Entry
    let response = await db_createFoodEntry(datetime, food, calories, user_id);

    return {
      valid: true,
      data: response,
    };
  } catch (error) {
    logger.error("Error in createFoodEntryService");
    console.log(error);
    throw new Error();
  }
};

const updateFoodEntryService = async (
  datetime,
  food,
  calories,
  user_id,
  user,
  foodEntryId
) => {
  try {
    logger.info("Inside updateFoodEntryService.");

    // Checking if atleast one of the fields are being updated
    if (!(datetime || food || calories || user_id)) {
      return {
        valid: false,
        error: "Nothing to update.",
      };
    }

    // Only Admin user can update FoodEntry records on behalf of other users
    if (user.role !== "Admin" && user_id) {
      return {
        valid: false,
        error: "Only Admin user can provide User ID while updating FoodEntry.",
      };
    }

    // Validating that datetime provided is not future dated
    if (datetime && datetime > moment().valueOf()) {
      return {
        valid: false,
        error: "Date/Time cannot be future dated.",
      };
    }

    // Validation to check if FoodEntry record exists
    let response = await db_getFoodEntry(foodEntryId);

    if (response.length === 0) {
      return {
        valid: false,
        error: "FoodEntry record not found.",
      };
    }

    // Admin user can update FoodEntry record on behalf of other users
    if (user.role === "Admin" || response[0].user_id === user.id) {
      response = await db_updateFoodEntry(
        datetime,
        food,
        calories,
        user_id,
        foodEntryId
      );

      return {
        valid: true,
        data: response,
      };
    } else {
      return {
        valid: false,
        error: "User does not have access to this FoodEntry record.",
      };
    }
  } catch (error) {
    logger.error("Error in updateFoodEntryService");
    console.log(error);
    throw new Error();
  }
};

const deleteFoodEntryService = async (user, foodEntryId) => {
  try {
    logger.info("Inside deleteFoodEntryService.");

    // Checking if the FoodEntry record exists
    let response = await db_getFoodEntry(foodEntryId);

    if (response.length === 0) {
      return {
        valid: false,
        error: "FoodEntry record not found.",
      };
    }

    // Admin user can delete FoodEntry record on behalf of other users
    if (user.role === "Admin" || response[0].user_id === user.id) {
      response = await db_deleteFoodEntry(foodEntryId);

      return {
        valid: true,
        data: response,
      };
    } else {
      return {
        valid: false,
        error: "User does not have access to this FoodEntry record.",
      };
    }
  } catch (error) {
    logger.error("Error in deleteFoodEntryService");
    console.log(error);
    throw new Error();
  }
};

module.exports = {
  getAllFoodEntriesService,
  getFoodEntryService,
  createFoodEntryService,
  updateFoodEntryService,
  deleteFoodEntryService,
};
