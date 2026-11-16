document.querySelector("input").addEventListener("keydown", function (e) {
  document.querySelector("#code").textContent = e.key.charCodeAt();
  document.querySelector("#string").textContent = e.code;
});

const lienzo = document.getElementById("lienzo");
const ctx = lienzo.getContext("2d");
const formas = [];
const paleta = ["#ff3cac", "#ffe259", "#00f5a0", "#00d9f5", "#784ba0", "#ff7a59", "#ffffff"];
let audio = null;

function ajustar() {
  lienzo.width = innerWidth * devicePixelRatio;
  lienzo.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function nota(indice) {
  audio = audio || new (window.AudioContext || window.webkitAudioContext)();
  const escala = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
  const frecuencia = 220 * Math.pow(2, escala[indice % escala.length] / 12) * (indice % 20 >= 10 ? 2 : 1);
  const oscilador = audio.createOscillator();
  const volumen = audio.createGain();
  oscilador.type = ["sine", "triangle", "sawtooth"][indice % 3];
  oscilador.frequency.value = frecuencia;
  volumen.gain.setValueAtTime(0.12, audio.currentTime);
  volumen.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.6);
  oscilador.connect(volumen).connect(audio.destination);
  oscilador.start();
  oscilador.stop(audio.currentTime + 0.65);
}

function nuevaForma(indice) {
  formas.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    tipo: indice % 4,
    color: paleta[indice % paleta.length],
    radio: 10,
    vida: 1,
    giro: Math.random() * Math.PI
  });
}

function dibujar() {
  ctx.fillStyle = "rgba(10, 10, 18, 0.18)";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  for (let i = formas.length - 1; i >= 0; i--) {
    const f = formas[i];
    f.radio += (220 - f.radio) * 0.06;
    f.vida -= 0.012;
    f.giro += 0.02;
    if (f.vida <= 0) {
      formas.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = f.vida;
    ctx.translate(f.x, f.y);
    ctx.rotate(f.giro);
    ctx.strokeStyle = f.color;
    ctx.fillStyle = f.color;
    ctx.lineWidth = 6;
    ctx.beginPath();
    if (f.tipo === 0) {
      ctx.arc(0, 0, f.radio, 0, Math.PI * 2);
      ctx.stroke();
    } else if (f.tipo === 1) {
      ctx.rect(-f.radio / 2, -f.radio / 2, f.radio, f.radio);
      ctx.stroke();
    } else if (f.tipo === 2) {
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        ctx.lineTo(Math.cos(a) * f.radio * 0.7, Math.sin(a) * f.radio * 0.7);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        ctx.moveTo(Math.cos(a) * f.radio * 0.2, Math.sin(a) * f.radio * 0.2);
        ctx.lineTo(Math.cos(a) * f.radio * 0.6, Math.sin(a) * f.radio * 0.6);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  requestAnimationFrame(dibujar);
}

document.addEventListener("keydown", function (e) {
  if (e.key.length !== 1 || e.repeat) return;
  const indice = e.key.toLowerCase().charCodeAt(0);
  nota(indice);
  nuevaForma(indice);
  document.body.style.setProperty("--flash", paleta[indice % paleta.length]);
  document.body.classList.remove("flash");
  void document.body.offsetWidth;
  document.body.classList.add("flash");
});

lienzo.addEventListener("click", function (e) {
  const indice = Math.floor(Math.random() * 40);
  nota(indice);
  nuevaForma(indice);
  formas[formas.length - 1].x = e.clientX;
  formas[formas.length - 1].y = e.clientY;
});

addEventListener("resize", ajustar);
ajustar();
dibujar();
