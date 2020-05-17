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
  console.log("el array resultados es de: " + arrayResultados.length);
  if (arrayResultados.length < 7) {
    arrayResultados = [];
    alert("Error. Ingrese todas las respuestas");
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
  const record = {
    nombre: usuario.user.displayName,
    resultados: arrayResultados,
    puntuacion: 0,
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
          puntuacion: 0,
        });
      });
    });
}
function obtenerResultadosFecha() {}
// CALCULA PUNTAJE POR JUGADOR
function calcularPuntaje() {
  for (let i = 0; i < resultadosJugadores.length; i++) {
    let indice = 0;
    resultadosJugadores[i].resultados.forEach((elem) => {
      if (elem === resultadosPartidos[indice]) {
        console.log("es igual tato");
        resultadosJugadores[i].puntuacion += 10;
      }
      indice++;
    });
  }
}
//SE MUESTRAN VOTOS EN PANTALLA
function mostrarVotos() {
  const db = firebase.database();
  const dbRef = db.ref("Datos");
  dbRef.on("child_added", (snapshot) => {
    let holis = snapshot.val().resultados;
    for (let i = 0; i < holis.length; i++) {
      let item = document.createElement("li");
      item.innerHTML =
        "Resultado " + (i + 1) + ": " + "<strong>" + holis[i] + "</strong>";
      lista.appendChild(item);
    }
    let item2 = document.createElement("li");
    item2.innerHTML =
      "Puntuacion: " + "<strong>" + snapshot.val().puntuacion + "</strong>";
    lista.appendChild(item2);
  });
}
// Se cargan en la DB los resultados de la fecha
function guardarResultadosDeLaFecha() {
  const record = {
    results: resultadosDeLaFecha,
  };
  const db = firebase.database();
  const dbRef = db.ref("ResultadosFecha");
  const newResultado = dbRef.push();
  newResultado.set(record);
}
// VALIDAR ENTRADA DE DATOS POR USUARIO, 1 por usuario
// ACTUALIZAR PUNTUACION COMPARANDO LOS DATOS DE LA FECHA
//
