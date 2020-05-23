// LOGUEO GOOGLE
let usuario = {};

function logearConGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      usuario = result;
      vestirUsuario();
      console.log("te logueaste con exito tatito");
    })
    .catch((error) => console.log(error, "error tato"));
}
function desloguear() {
  firebase
    .auth()
    .signOut()
    .then((result) => {
      console.log("Te deslogueaste");
      desvestirUsuario();
    })
    .catch((err) => console.log("hay error tatito"));
}
function vestirUsuario() {
  btn.style.display = "none";
  off.style.display = "inline-block";
  name.innerHTML = usuario.user.displayName;
  pic.src = usuario.user.photoURL;
  obtenerPuntuacionFinal();
  mostrarVotos();
}
function desvestirUsuario() {
  btn.style.display = "inline-block";
  off.style.display = "none";
  name.innerHTML = "Hola querido";
  pic.src = "https://www.w3schools.com/howto/img_avatar.png";
}
document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      usuario = { user: user };
      vestirUsuario();
    }
  });
  // FIN LOGUEO GOOGLE
});
