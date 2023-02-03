const mongoose = require("mongoose");
const dbConnection = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO_DB, {
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
