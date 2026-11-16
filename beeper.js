let boton = document.querySelector("#beep");
let audio = null;

function sonar() {
  audio = audio || new (window.AudioContext || window.webkitAudioContext)();
  let oscilador = audio.createOscillator();
  let volumen = audio.createGain();
  oscilador.type = "square";
  oscilador.frequency.value = 660 + Math.random() * 440;
  volumen.gain.setValueAtTime(0.08, audio.currentTime);
  volumen.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.18);
  oscilador.connect(volumen).connect(audio.destination);
  oscilador.start();
  oscilador.stop(audio.currentTime + 0.2);
}

function seEjecutaEnEvento() {
  let body = document.querySelector("body");
  let parrafo = document.createElement("p");
  parrafo.textContent = "BEEP";
  parrafo.style.setProperty("--x", `${Math.random() * 80 + 5}vw`);
  parrafo.style.setProperty("--giro", `${Math.random() * 40 - 20}deg`);
  body.appendChild(parrafo);
  body.classList.toggle("color");
  sonar();
}

boton.addEventListener("click", seEjecutaEnEvento);
