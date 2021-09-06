const express = require("express");
const { createUser, loginUser, getAllUsers } = require("../controllers");
const { authenticate } = require("../middlewares"); 

const UserRouter = express.Router();

UserRouter.get("/", authenticate, getAllUsers);

UserRouter.post("/", createUser);

UserRouter.post("/login", loginUser);

module.exports = { UserRouter };
