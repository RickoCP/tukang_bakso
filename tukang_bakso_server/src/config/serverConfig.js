require("dotenv").config();

const config = {
//   port: process.env.PORT || 5000,
//   origin: process.env.ORIGIN || "http://localhost:3000",
  port: process.env.PORT,
  origin: process.env.ORIGIN,
};

module.exports = config;
