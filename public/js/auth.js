const form_chat = document.querySelector("#form-chat");
const msj = document.getElementById("mensajeLogin");

const url = "http://localhost:3000/api/auth/login";

function validNumber(numero) {
  var patron = /^9[0-9]{8}$/;
  return patron.test(numero);
}

form_chat.addEventListener("submit", (ev) => {
  ev.preventDefault();
  msj.innerText = "";
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
    const formData = {
      nombre: nombre.value, 
      numero: telefono.value,
    };
    console.log(formData)
    fetch(url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then(({ msg, token }) => {
        if (msg) {
          return console.error(msg);
        }
        localStorage.setItem("token", token);
        window.location = "/templates/chat.html";
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
