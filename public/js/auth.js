const form_chat = document.querySelector("#form-chat");

const url = "http://localhost:3000/api/auth/";

function validNumber(numero) {
  var patron = /^9[0-9]{8}$/;
  return patron.test(numero);
}
const msj = document.getElementById("mensajeLogin");

form_chat.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const nombre = document.querySelector("#nombre");
  const telefono = document.querySelector("#telefono");
  if (!nombre.value) msj.innerText = "Nombre es requerido";
  if (!validNumber(telefono.value))
    msj.innerText = "Debe ingresar un numero celular valido";
  if (msj.innerText) {
    Swal.fire({
      icon: "error",
      title: msj.innerHTML,
      text: "Digite un nombre y numero valido",
    });
  } else {
    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ){
            return console.error( msg );
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err)
    })
  }
});
