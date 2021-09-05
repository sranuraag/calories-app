const express = require("express");
const { createUser, loginUser } = require("../controllers");

const UserRouter = express.Router();

UserRouter.post("/", createUser);

UserRouter.post("/login", loginUser);

module.exports = { UserRouter };
