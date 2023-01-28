const mongoose = require("mongoose");
const dbConnection = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
    })
    .then(() => console.log("Connected Database"))
    .catch((err) => {
      console.log(err);
      throw new Error("Error connect Database");
    });
};

module.exports = {
  dbConnection,
};
