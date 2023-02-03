const ulUsuarios = document.querySelector("#divUsuarios"); //UL CONTACTS
const userImage = document.querySelector("#user-image");
const ulMensajes = document.querySelector("#ulMensajes");
const divChatbox = document.querySelector("#divChatbox"); //DIV MESSAGE
let idChatGeneral = ''

function sendMessages (){
  const ul = ulUsuarios.querySelectorAll("li");
  ul.forEach(li => {
    li.onclick = function(){
      const uid = this.id;
      renderizarChats(uid)
    }
  });
}

function renderizarUsuarios(personas) {

  var html = "";

  for (var i = 0; i < personas.length; i++) {
    const { _id:uid ,img,tipo,users,nombre:nombreChat } = personas[i];
    if(nombreChat ==='general') idChatGeneral = uid
    const nombre = tipo === 'privado' ? users[0].nombre : personas[i].nombre
    const estado = tipo !== 'privado' ? 'Online': ( !users[0].fecha_activo ? 'Inactive' : (users[0].online ? 'Online': 'Offline'))
    html += `<li id="${uid}">`;
    html +=
      '    <a data-id="' +
      uid +
      `"  href="javascript:void(0)"><img src="${img?img : '../resources/user-image.jpg'}" alt="user-img" class="img-circle"> <span>` +
      nombre[0].toUpperCase()+nombre.substring(1) +
      ` <small class="text-${tipo !== 'privado' ? 'success': (users[0].online ? 'success':'danger' )}">
      ${estado}</small></span></a>`;
    html += "</li>";
  }

  ulUsuarios.innerHTML = html;
  sendMessages();
}



function renderizarMensajes(mensajes, userActual) {
  var html = '';
  var adminClass = 'info';
  mensajes.forEach(({fecha, message , user: {nombre,img , _id:uid } }) => {
    var fechaMessage = new Date(fecha);
    var hora = fechaMessage.getHours() + ':' + fechaMessage.getMinutes();
    
    if (user.nombre === 'Administrador') {
        adminClass = 'danger';
    }
    
    if (userActual.uid === uid) {
      html += '<li class="reverse">';
      html += '    <div class="chat-content">';
      html += '        <h5>' + nombre + '</h5>';
      html += '        <div class="box bg-light-inverse">' + message + '</div>';
      html += '    </div>';
      html += `    <div class="chat-img"><img src="${img?img : '../resources/user-image.jpg'}" alt="user" /></div>`;
      html += '    <div class="chat-time">' + hora + '</div>';
      html += '</li>';

  } else {

      html += '<li class="animated fadeIn">';

      if (nombre !== 'Administrador') {
          html += `    <div class="chat-img"><img src="${img?img : '../resources/user-image.jpg'}" alt="user" /></div>`;
      }

      html += '    <div class="chat-content">';
      html += '        <h5>' + nombre + '</h5>';
      html += '        <div class="box bg-light-' + adminClass + '">' + message + '</div>';
      html += '    </div>';
      html += '    <div class="chat-time">' + hora + '</div>';
      html += '</li>';

  }
  });

  


  divChatbox.innerHTML += html;

  document.getElementById("divChatbox").scrollTop = document.getElementById("divChatbox").scrollHeight;

}


function renderizarChats (uid = idChatGeneral){
  const ulUsuario = document.querySelector("#divChatbox").cloneNode(true);
  ulUsuario.setAttribute("id",uid);
  console.log(ulUsuario)

}