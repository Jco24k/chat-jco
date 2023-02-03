const MessageModel = require("../models/message");

const createMessage = async (message, userId) => {
  const messageNew = new MessageModel({
    user: userId,
    message,
  });
  return await messageNew.save();
};



module.exports = {
  createMessage,
};
