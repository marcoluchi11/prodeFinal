const firebaseConfig = {
  apiKey: "AIzaSyCnfaxXE-0-JfV2p9mMs5jLhgcNKs9pL9c",
  authDomain: "prode-eb49d.firebaseapp.com",
  databaseURL: "https://prode-eb49d.firebaseio.com",
  projectId: "prode-eb49d",
  storageBucket: "prode-eb49d.appspot.com",
  messagingSenderId: "845486145738",
  appId: "1:845486145738:web:22172e10a5ee13c8d57433",
  measurementId: "G-38VR1R9WZX",
};
// FIREBASE CONFIG
firebase.initializeApp(firebaseConfig);
let btn = document.getElementById("login");
let name = document.getElementById("nombre");
let off = document.getElementById("logout");
let pic = document.getElementById("image");
let formulario = document.getElementById("resultados");
let inputs = document.getElementsByClassName("form-check-input");
let etiquetas = document.getElementsByClassName("form-check-label");
let arrayResultados = new Array();
let resultadosJugadores = new Array();
let PuntuacionJugadores = new Array();
let resultadosDeLaFecha = [
  "Pierde",
  "Pierde",
  "Pierde",
  "Pierde",
  "Pierde",
  "Pierde",
  "Pierde",
];

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      arrayResultados.push(etiquetas[i].textContent);
    }
  }
  //Validacion de todas las opciones
  if (jQuery.isEmptyObject(usuario)) {
    alert("Haga click en login para jugar");
    return;
  }
  if (arrayResultados.length < 7) {
    arrayResultados = [];
    alert("Error. Ingrese todas las respuestas");
    return;
  }
  if (recorrerArrVotos()) {
    formulario.reset();
    return;
  }
  guardarResultados();

  formulario.reset();
  alert("Tus resultados se han enviado con exito");
});

btn.addEventListener("click", (e) => {
  e.preventDefault();
  logearConGoogle();
});

off.addEventListener("click", (e) => {
  e.preventDefault();
  desloguear();
});
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

// SE GUARDAN RESULTADOS
function guardarResultados() {
  if (usuario.user.displayName === undefined) {
    return false;
  }

  const record = {
    nombre: usuario.user.displayName,
    resultados: arrayResultados,
  };
  const db = firebase.database();
  const dbRef = db.ref("Datos");
  const newResultado = dbRef.push();
  newResultado.set(record);
}

//SE OBTIENEN LOS VALORES DE LA DATABASE DE LOS JUGADORES
function obtenerValores() {
  firebase
    .database()
    .ref("Datos")
    .once("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        resultadosJugadores.push({
          nombre: childSnapshot.val().nombre,
          resultados: childSnapshot.val().resultados,
        });
      });
    });
}
//SE MUESTRAN VOTOS EN PANTALLA
function mostrarVotos() {
  const db = firebase.database();
  const dbRef = db.ref("Datos");
  dbRef.on("child_added", (snapshot) => {
    let resultado = snapshot.val().resultados;
    for (let i = 0; i < resultado.length; i++) {
      let item = document.createElement("li");
      item.innerHTML =
        "Resultado " + (i + 1) + ": " + "<strong>" + resultado[i] + "</strong>";
      lista.appendChild(item);
    }
    let item2 = document.createElement("li");
    item2.id = "puntuacion";
    let puntosUsuario = PuntuacionJugadores.find(buscarIndex);
    if (puntosUsuario === undefined) {
      item2.innerHTML = "Puntuacion: " + "<strong>" + 0 + "</strong>";
    } else {
      item2.innerHTML =
        "Puntuacion: " + "<strong>" + puntosUsuario.puntuacion + "</strong>";
    }

    lista.appendChild(item2);
  });
}
// Se cargan en la DB los resultados de la fecha
// MEJOR PASAR POR PARAMETRO
function guardarResultadosDeLaFecha() {
  const record = {
    results: resultadosDeLaFecha,
  };
  const db = firebase.database();
  const dbRef = db.ref("ResultadosFecha");
  const newResultado = dbRef.push();
  newResultado.set(record);
  actualizarPuntuacion();
  obtenerPuntuacionFinal();
  mostrarPuntuacionFinal();
}
// ACTUALIZAR PUNTUACION COMPARANDO LOS DATOS DE LA FECHA
//
function recorrerArrVotos() {
  obtenerValores();
  for (let i = 0; i < resultadosJugadores.length; i++) {
    if (usuario.user.displayName === resultadosJugadores[i].nombre) {
      alert("Error, Ud. ya ha votado");
      return true;
    }
  }
}
//SE ACTUALIZA PUNTUACION EN LA DB
function actualizarPuntuacion() {
  obtenerValores();
  for (let i = 0; i < resultadosJugadores.length; i++) {
    let puntos = 0;
    for (let j = 0; j < resultadosDeLaFecha.length; j++) {
      if (resultadosJugadores[i].resultados[j] === resultadosDeLaFecha[j]) {
        puntos += 10;
      }
    }
    const record = {
      nombre: usuario.user.displayName,
      puntuacion: puntos,
    };
    const db = firebase.database();
    const dbRef = db.ref("Puntuacion");
    const newResultado = dbRef.push();
    newResultado.set(record);
  }
}
function mostrarPuntuacionFinal() {
  let pts = document.getElementById("puntuacion");
  console.log("la puntuaciond e los jugadores es:" + PuntuacionJugadores);
  let puntosJugadorFinal = PuntuacionJugadores.find(buscarIndex);
  if (puntosJugadorFinal.nombre === usuario.user.displayName) {
    pts.innerHTML =
      "Puntuacion: " + "<strong>" + puntosJugadorFinal.puntuacion + "</strong>";
  }
}
//SE OBTIENEN LOS DATOS DE LA DB EN CUANTO A LA PUNTUACION
function obtenerPuntuacionFinal() {
  firebase
    .database()
    .ref("Puntuacion")
    .once("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        PuntuacionJugadores.push({
          nombre: childSnapshot.val().nombre,
          puntuacion: childSnapshot.val().puntuacion,
        });
      });
    });
}
//SE MUESTRA LA PUNTUACION UNA VEZ DADA UNA FECHA CON RESULTADOS FINALES

function buscarIndex(elem) {
  return (elem.nombre = usuario.user.displayName);
}
