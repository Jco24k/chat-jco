const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://socket-chat-jco.onrender.com/api/auth/";

let user = null;
let socket = null;
let chatActualId = null;
// Referencias HTML
const formChat = document.querySelector("#formEnviar");
const formAddContact = document.querySelector("#form-add-contact");
const nombre = document.querySelector("#nombre-contact");
const numero = document.querySelector("#numero-contact");
const txtSearch = document.querySelector("#txtSearch");
const ulContact = document.querySelector("#divUsuarios");

// VALIDAR TOKEN
const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";

  if (token.length <= 10) {
    window.location = "../index.html";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  user = userDB;
  document.title = user.nombre;

  changeUser(user)
  await conectarSocket();
};

const conectarSocket = async () => {
  socket = io({
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  socket.on("connect", () => {
    console.log("Sockets online");
  });

  socket.on("disconnect", () => {
    console.log("Sockets offline");
  });

  //RECIBE LOS MENSAJES
  socket.on("recibir-chat", (chat) => {
    if (!chatActualId) chatActualId = chat.uid;
    if (chatActualId.toString() === chat.uid.toString())
      renderizarChats(chat, user);
  });

  //RECIBE CONTACTOS Y CHATS
  socket.on("recibir-all", (all) => {
    renderContactsChats(all, user);
    onClickAllUl(user);
    searchContacts()
  });
};

//ENVIA NUEVO MENSAJE
formChat.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const message = document.querySelector("#txtMensaje").value.trim();
  if (message) {
    const data = {
      message,
      chat: { uid: chatActualId },
      user: { uid: user.uid },
    };
    socket.emit("enviar-mensaje", data, (payload) => {
      renderizarChats(payload, user);
      document.querySelector("#txtMensaje").value = "";
    });
  }
});

//ENVIA NUEVO CONTACTO
formAddContact.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const errorNombre = document.querySelector("#error-nombre");
  const errorNumero = document.querySelector("#error-numero");
  let validate = true;
  if (!nombre.value) {
    errorNombre.textContent = "Nombre es requerido";
    validate = false;
  }
  if (!validNumber(numero.value)) {
    errorNumero.textContent = "Debe ingresar un numero celular valido";
    validate = false;
  }

  if (validate) {
    const data = {
      user,
      contacto: {
        nombre: nombre.value,
        numero: numero.value,
      },
    };

    socket.emit("enviar-contacto", data, (payload) => {
      errorNombre.textContent = "";
      errorNumero.textContent = "";
      (nombre.value = ""), (numero.value = "");
      if (!payload) {
        document.querySelector("#btn-close-modal").click();
      } else {
        Swal.fire({
          icon: "error",
          title: payload,
          text: "Digite un nombre y numero valido",
        });
      }
    });
  }
});

function validNumber(numero) {
  var patron = /^9[0-9]{8}$/;
  return patron.test(numero);
}

const ulContacts = document.querySelector("#divUsuarios");
function onClickAllUl(user) {
  const lis = ulContacts.querySelectorAll("li");
  lis.forEach((li) => {
    li.onclick = () => {
      chatActualId = li.id;
      socket.emit("traer-chat", chatActualId, (chat) => {
        renderizarChats(chat, user);
      });
    };
  });
}

txtSearch.addEventListener("keyup",searchContacts);

function searchContacts() {
  const { value } = txtSearch;
  const listContacts = ulContact.querySelectorAll("li");
  listContacts.forEach((liContact) => {
    const { textContent: valueNombre } =
      liContact.querySelector("#nombre-contact");
    const nombreCort = valueNombre
      .toString()
      .substring(0, value.length)
      .toLowerCase();
    if (nombreCort === value.toLowerCase()) liContact.style.display = "";
    else liContact.style.display = "none";
  });
}

const main = async () => {
  // Validar JWT
  await validarJWT();
};

main();
