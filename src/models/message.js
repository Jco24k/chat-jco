const { Schema, model } = require("mongoose");

const MessageSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: [true, "El mensaje es obligatorio"],
  },
  fecha: {
    type: Date,
    required: [false],
    default: Date.now,
  },
});

MessageSchema.methods.toJSON = function () {
  const { __v, _id, ...detailsMensj } = this.toObject();
  detailsMensj.uid = _id;
  return detailsMensj;
};

module.exports = model("Message", MessageSchema);
