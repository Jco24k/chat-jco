const { Schema, model } = require("mongoose");

const ChatSchema = Schema({
  users: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  messages: {
    type: [Schema.Types.ObjectId],
    ref: "Message",
    required: false,
  },
  fecha: {
    type: Date,
    required: false,
    default: Date.now,
  },
  nombre: {
    type: String,
    deafult: null,
  },
  tipo: {
    type: String,
    required: true,
    default: "privado",
  },
  img: {
    type: String,
    required: [false],
    default: null
  },
});

ChatSchema.methods.toJSON = function () {
  const { __v, _id, ...detailsChat } = this.toObject();
  detailsChat.uid = _id;
  return detailsChat;
};

module.exports = model("Chat", ChatSchema);
