require("dotenv").config();
const express = require("express");
const { UserRouter, FoodEntryRouter } = require("./routes");
const { logger } = require("./utils"); 

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes defined for different resources
app.use("/users", UserRouter);
app.use("/foodentry", FoodEntryRouter);

const PORT = process.env.PORT || 3001;

const application = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = application; 
