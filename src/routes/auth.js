const express = require("express");
const { check } = require("express-validator");
const validate = require("../middlewares/validation.js");
const { register, login } = require("../controllers/authController.js").default;

const router = express.Router();

router.post(
  "/register",
  validate([
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").not().isEmpty().withMessage("Password is required"),
  ]),
  register
);

router.post(
  "/login",
  validate([
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").not().isEmpty().withMessage("Password is required"),
  ]),
  login
);

module.exports = router;
