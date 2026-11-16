let parrafos = document.querySelectorAll(".hoja p");
let contador = document.querySelector("#contador");

for (let i = 0; i < parrafos.length; i++) {
  parrafos[i].addEventListener("click", function () {
    this.classList.toggle("resaltado");
    let cantidad = document.querySelectorAll(".resaltado").length;
    contador.textContent = `${cantidad} párrafo${cantidad === 1 ? "" : "s"} resaltado${cantidad === 1 ? "" : "s"}`;
  });
}
