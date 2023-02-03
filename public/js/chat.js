const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://restserver-curso-fher.herokuapp.com/api/auth/";

let user = null;
let socket = null;
let chatActual = null;
// Referencias HTML
const formChat = document.querySelector("#formEnviar");
const formAddContact = document.querySelector("#form-add-contact");
const nombre = document.querySelector("#nombre-contact");
const numero = document.querySelector("#numero-contact");



// const btnAddContact = document.querySelector("#btn-add-contact");

// const ulusers = document.querySelector('#ulusers');
// const ulMensajes = document.querySelector('#ulMensajes');
// const btnSalir   = document.querySelector('#btnSalir');

// Validar el token del localstorage
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

  socket.on("users-general", (users) => {
    // console.log(users);
  });

  socket.on("recibir-mensajes", (messages) => {
    renderizarMensajes(messages, user);
    // console.log(messages);
  });

  socket.on("recibir-chat", (chat) => {
    chatActual = chat;
    // console.log(chat)
  });

  socket.on("recibir-all-chat", (chats) => {
    
    renderizarUsuarios(chats)
  });

  socket.on("recibir-all", (all) => {
    console.log(all)
  });

  socket.on("mensaje-privado", ( payload ) => {
      console.log('Privado:', payload )
  });

  socket.on("recibir-contactos", (contactos) => {
    // renderizarUsuarios([
    //   user,
    //   ...contactos.map(({ contacto: { _id: uid, ...detailsCont } }) => ({
    //     uid,
    //     ...detailsCont,
    //   })),
    // ]);
  });
};

formChat.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const message = document.querySelector("#txtMensaje").value.trim();
  if (message) {
    const data = {
      message,
      chat: { uid: chatActual.uid },
      user: { uid: user.uid },
    };

    socket.emit("enviar-mensaje", data, () => {
      document.querySelector("#txtMensaje").value = "";
    });
  }
});

// btnAddContact.addEventListener("click", () => {
//   console.log('add')
// })

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


const dibujarMensajes = (mensajes = []) => {
  let mensajesHTML = "";
  mensajes.forEach(({ user, mensaje }) => {
    mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${user}: </span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
  });

  ulMensajes.innerHTML = mensajesHTML;
};


const main = async () => {
  // Validar JWT
  await validarJWT();
};

main();
