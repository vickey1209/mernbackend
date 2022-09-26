const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/registration";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("connection success");
  })
  .catch((e) => {
    console.log("no connection");
  });
