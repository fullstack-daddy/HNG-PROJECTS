const express = require("express");
require("dotenv").config();
const sequelize = require("./config/database").default;
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
const organisationRoutes = require("./routes/organisations");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", organisationRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

module.exports = app;
