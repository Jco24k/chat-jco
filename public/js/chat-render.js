const boxMessage = document.querySelector("#box-messages-chats");
const titleChat = document.querySelector("#title-chat");

function renderContactsChats(listChats, user) {
  const ulUsuarios = document.querySelector("#divUsuarios");
  ulUsuarios.innerHTML = "";
  for (const chatContact of listChats) {
    const li = renderizarUsuarios(chatContact, user);
    ulUsuarios.appendChild(li);
  }
}

function renderizarUsuarios(chat) {
  var html = "";

  const { _id: uid, img, tipo, users } = chat;
  const nombre = tipo === "privado" ? users[0].nombre : chat.nombre;
  const estado =
    tipo !== "privado"
      ? "Online"
      : !users[0].fecha_activo
      ? "Inactive"
      : users[0].online
      ? "Online"
      : "Offline";

  const numero = tipo !== "privado" ? "Grupo" : users[0].numero;
  const li = document.createElement("li");

  li.setAttribute("id", uid);
  html +=
    '    <a data-id=""' +
    `"  href="javascript:void(0)"><img src="${
      img ? img : "../resources/user-image.jpg"
    }" alt="user-img" class="img-circle"> <span><span id="nombre-contact" style="font-weight: 500;">` +
    nombre[0].toUpperCase() +
    nombre.substring(1) +
    "</span>" +
    ` <small class="text-${
      tipo !== "privado" ? "success" : users[0].online ? "success" : "danger"
    }"><span id="numero-contact">${numero}</span> - 
      ${estado}</small></span></a>`;
  li.innerHTML = html;
  return li;
}

function renderizarChats(chat, user) {
  const { _id: uid, tipo, users, messages } = chat;
  const nombre = tipo === "privado" ? users[0].nombre : chat.nombre;
  titleChat.innerHTML = nombre.toUpperCase();
  boxMessage.innerHTML = "";
  const ul = document.createElement("ul");
  ul.setAttribute("class", "chat-list p-20");
  ul.setAttribute("id", uid + "ct");

  const li = renderizarMensajes(messages, user);
  ul.innerHTML = li;
  boxMessage.appendChild(ul);
  ul.scrollTop = ul.scrollHeight;
}

function renderizarMensajes(mensajes, userActual) {
  var html = "";
  var adminClass = "info";
  mensajes.forEach(({ fecha, message, user: { nombre, img, _id: uid } }) => {
    var fechaMessage = new Date(fecha);
    var hora = fechaMessage.getHours() + ":" + fechaMessage.getMinutes();

    if (user.nombre === "Administrador") {
      adminClass = "danger";
    }

    if (userActual.uid.toString() === uid.toString()) {
      html += '<li class="reverse">';
      html += '    <div class="chat-content">';
      html += "        <h5>" + nombre + "</h5>";
      html += '    <div class="chat-time">' + hora + "</div>";
      html += '        <div class="box bg-light-inverse">' + message + "</div>";
      html += `    <div class="chat-img"><img src="${
        img ? img : "../resources/user-image.jpg"
      }" alt="user" /></div>`;
      html += "    </div>";
      html += "</li>";
    } else {
      html += '<li class="animated fadeIn">';

      if (nombre !== "Administrador") {
        html += `    <div class="chat-img"><img src="${
          img ? img : "../resources/user-image.jpg"
        }" alt="user" /></div>`;
      }

      html += '    <div class="chat-content">';
      html += "        <h5>" + nombre + "</h5>";
      html +=
        '        <div class="box bg-light-' +
        adminClass +
        '">' +
        message +
        "</div>";
        html += '    <div class="chat-time">' + hora + "</div>";
      html += "    </div>";
      html += "</li>";
    }
  });
  return html;
}

function changeUser(user) {
  let { img, nombre } = user;
  img = img ? img : "../resources/user-image.jpg";
  document.getElementById("txt-user-img").src = img;
  document.getElementById("txt-user-nombre").textContent = `${
    nombre[0].toUpperCase() + nombre.substring(1)
  } (Tú)`;
}
