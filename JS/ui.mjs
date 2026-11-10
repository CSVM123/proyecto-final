const NOMBRES_MODO = {
  corregir: "Corregir",
  mejorar: "Mejorar",
  formal: "Formal",
  resumir: "Resumir"
};

const estado = document.querySelector("#estado");
const resultado = document.querySelector("#resultado");
const botonProcesar = document.querySelector("#boton-procesar");
const botonHistorial = document.querySelector("#boton-historial");
const panelHistorial = document.querySelector("#panel-historial");
const listaHistorial = document.querySelector("#lista-historial");

function recortar(texto, maximo = 40) {
  return texto.length > maximo ? texto.slice(0, maximo) + "…" : texto;
}

export function mostrarEstado(mensaje, esError = false) {
  estado.textContent = esError ? `⚠ ${mensaje}` : mensaje;
  estado.classList.toggle("estado--error", esError);
}

export function mostrarResultado(texto) {
  resultado.textContent = texto;
}

export function leerResultado() {
  return resultado.textContent;
}

export function bloquearFormulario(bloqueado) {
  botonProcesar.disabled = bloqueado;
  botonProcesar.textContent = bloqueado ? "Procesando..." : "Mejorar texto";
}

export function alternarHistorial() {
  const abierto = botonHistorial.getAttribute("aria-expanded") === "true";
  botonHistorial.setAttribute("aria-expanded", String(!abierto));
  panelHistorial.hidden = abierto;
  botonHistorial.textContent = abierto ? "Ver historial" : "Ocultar historial";
}

export function renderizarHistorial(entradas) {
  listaHistorial.replaceChildren();

  for (const entrada of entradas) {
    const item = document.createElement("li");
    const boton = document.createElement("button");

    boton.type = "button";
    boton.dataset.id = String(entrada.id);
    boton.textContent = `${NOMBRES_MODO[entrada.modo]}: ${recortar(entrada.original)}`;

    item.appendChild(boton);
    listaHistorial.appendChild(item);
  }
}