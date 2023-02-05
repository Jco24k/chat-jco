const { response } = require("express");

const ChatModel = require("../models/chat");
const UserModel = require("../models/user");
const { createMessage } = require("./message");
const { Types } = require("mongoose");
const { guardarUsuario } = require("./auth");
const chat = require("../models/chat");

const connectarUsuarioGeneral = async ({ uid }) => {
  await ChatModel.findOneAndUpdate(
    { nombre: "general" },
    {
      $setOnInsert: { nombre: "general", tipo: "grupal" },
      $addToSet: { users: uid },
    },
    {
      upsert: true,
      new: true,
    }
  );

  await UserModel.findByIdAndUpdate(uid, {
    online: true,
    fehca_activo: Date.now,
  });
};

const findUserChat = async (nombre = "general") => {
  const chat = await ChatModel.findOne({ nombre })
    .populate("users")
    .populate({
      path: "messages",
      populate: {
        path: "user",
        model: "User",
      },
    });

  return chat ? chat.toJSON() : [];
};

const findChatId = async (id, userId) => {
  const chats = await ChatModel.find({ _id: id })
    .populate("users")
    .populate({
      path: "messages",
      populate: {
        path: "user",
        model: "User",
      },
    });
  return chats.map((chat) => {
    const filteredUsers = chat.users.filter(
      ({ _id: uid }) => uid.toString() !== userId.toString()
    );
    return { ...chat.toObject(), users: filteredUsers };
  })[0];
};

const desconnectedUser = async (id) => {
  await UserModel.findByIdAndUpdate(id, {
    online: false,
    fecha_activo: new Date(),
  });
};

const addMessageChat = async (chat, user, message) => {
  const newMessage = await createMessage(message, Types.ObjectId(user.uid));
  const chatFind = await ChatModel.findById(chat.uid);
  chatFind.messages.push(newMessage._id);
  await chatFind.save();
  return 
};

const findAllChatUser = async ({ uid }) => {
  let chats = await ChatModel.find({ users: { $in: [uid] } })
    .populate("users")
    .populate("messages")
    .populate({
      path: "messages",
      populate: {
        path: "user",
        model: "User",
      },
    });
  return chats.map((chat) => {
    const filteredUsers = chat.users.filter(
      ({ _id: userId }) => userId.toString() !== uid.toString()
    );
    return { ...chat.toObject(), users: filteredUsers };
  });
};

const findOneChatUser = async (uidUser, uidContact) => {
  return await ChatModel.find({
    $and: [
      { users: { $all: [uidUser, uidContact] } },
      { nombre: { $ne: "general" } },
    ],
  });
};

const createContactChat = async (user, contacto) => {
  if (+user.numero === +contacto.numero)
    return {
      ok: false,
      msg: "El contacto a agregar tiene el mismo numero del propietario",
    };
  const { _id: uid, nombre } = await guardarUsuario(contacto);
  const chastFind = await findOneChatUser(user.uid, uid);
  if (chastFind.length)
    return {
      ok: false,
      msg: "El contacto que deseas arregar ya existe en tus amigos",
    };

  const newChat = new ChatModel({
    users: [user.uid, uid],
    nombre,
  });
  await newChat.save();
  return { ok: true };
};

module.exports = {
  connectarUsuarioGeneral,
  findUserChat,
  desconnectedUser,
  addMessageChat,
  findAllChatUser,
  createContactChat,
  findChatId,
};
