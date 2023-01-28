const { Schema, model } = require("mongoose");

const MessageSchema = Schema({
  fecha: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  visto: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Message", MessageSchema);
