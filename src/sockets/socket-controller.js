const { Socket } = require("socket.io");
const { ComprobarJWT } = require("../helpers");
const {
  connectarUsuarioGeneral,
  findUserChat,
  desconnectedUser,
  addMessageChat,
  findAllChatUser,
  createContactChat,
  findChatId,
} = require("../controllers/chat");

let socket = null;
let io = null;

const socketController = async (socketGlobal = new Socket(), ioGlobal) => {
  (socket = socketGlobal), (io = ioGlobal);
  const user = await ComprobarJWT(socket.handshake.headers.authorization);
  if (!user) {
    return socket.disconnect();
  }
  const { _id: uid } = user;

  await initUser(uid.toString());

  socket.on("disconnect", async () => {
    await desconnectedUser(uid);
    const usersContacts = await findAllChatUser({ uid });
    usersContacts.forEach(async({ users, tipo }) => {
      if (tipo === "privado") {
        const { _id: uid2 } = users[0];
        io.to(uid2.toString()).emit("recibir-all", await findAllChatUser({ uid:uid2 }));
      }
    });

    // await sendContacts(uid);
  });

  socket.on("traer-chat", async (id, callback) => {
    const chat = await findChatId(id, uid);
    callback(chat);
  });

  socket.on("enviar-mensaje", async ({ message, chat, user }, callback) => {
    await addMessageChat(chat, user, message);
    const { _id: uid, ...details } = await findChatId(chat.uid, user.uid);
    details.users.forEach((user) => {
      io.to(user._id.toString()).emit("recibir-chat", { uid, ...details });
    });
    callback({ uid, ...details });
  });

  socket.on("enviar-contacto", async ({ user, contacto }, callback) => {
    const { ok, msg } = await createContactChat(user, contacto);
    if (!ok) return callback(msg);
    const usersContacts = await findAllChatUser({ uid });
    socket.emit("recibir-all", usersContacts);
    callback(null);
  });
};

const initUser = async (uid) => {
  //CREAR SALA CON ID USUARIO
  socket.join(uid.toString());
  //AGREGAR A LAS SALA
  await connectarUsuarioGeneral({ uid });
  //ENVIAR DATOS AL CLIENTE
  const { users, messages, ...chat } = await findUserChat();
  io.emit("users-general", users);
  socket.emit("recibir-mensajes", messages);

  socket.emit("recibir-chat", await findUserChat());

  //ENVIAR CONTACTOS
  await sendContacts(uid);
};

const sendContacts = async (uid) => {
  const usersContacts = await findAllChatUser({ uid });
  socket.emit("recibir-all", usersContacts);

  usersContacts.forEach(async ({ users, tipo }) => {
    if (tipo === "privado") {
      const { _id: uid2 } = users[0];
      io.to(uid2.toString()).emit("recibir-all",await findAllChatUser({ uid:uid2 }));
    }
  });
};

module.exports = {
  socketController,
};
