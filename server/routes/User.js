const express = require("express");
const { createUser, loginUser, getAllUsers, getCurrentUser } = require("../controllers");
const { authenticate } = require("../middlewares"); 

const UserRouter = express.Router();

UserRouter.get("/", authenticate, getCurrentUser);

UserRouter.get("/getAllUsers", authenticate, getAllUsers);

UserRouter.post("/", createUser);

UserRouter.post("/login", loginUser);

module.exports = { UserRouter };
