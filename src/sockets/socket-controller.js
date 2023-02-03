const { Socket } = require("socket.io");
const { ComprobarJWT } = require("../helpers");
const {
  connectarUsuarioGeneral,
  findUserChat,
  desconnectedUser,
  addMessageChat,
  findAllChatUser,
  createContactChat,
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

  await initUser(uid);

  socket.on("disconnect", async () => {
    await desconnectedUser(uid);
    const { users } = await findUserChat();
    io.emit("users-general", users);
    
    await sendContacts(uid);
  });

  socket.on("enviar-mensaje", async ({ message, chat, user }, callback) => {
    await addMessageChat(chat, user, message);
    const { messages } = await findUserChat();
    io.emit("recibir-mensajes", messages);
    callback();
  });

  socket.on("enviar-contacto", async ({ user, contacto }, callback) => {
    const { ok, msg } = await createContactChat(user, contacto);
    if (!ok) return callback(msg);
    socket.emit(
      "recibir-all-chat",
      await findAllChatUser({ uid })
    );
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
  socket.emit("recibir-chat", chat);

  //ENVIAR CONTACTOS
  await sendContacts(uid);
  
};

const sendContacts = async(uid) => {
//ENVIAR CONTACTOS (ONLINE OR OFFLINE)
const usersContacts = await findAllChatUser({ uid });
socket.emit("recibir-all", usersContacts);

socket.emit("recibir-all-chat", await findAllChatUser({ uid }));
for (const { users, tipo } of usersContacts) {
  if (tipo !== "grupal") {
    const { _id: id } = users[0];
    const findChats = await findAllChatUser({ uid: id });
    io.to(id.toString()).emit("recibir-all-chat", findChats);
  }
}
};

module.exports = {
  socketController,
};
