const User = require("../models/User.js");

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { userId: req.params.id },
    });

    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).send({
      status: "success",
      message: "User retrieved successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (e) {
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};

module.exports = { getUserById };
