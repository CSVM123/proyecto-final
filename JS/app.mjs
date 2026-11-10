import { construirMensajes } from "./prompts.mjs";
import { pedirAlModelo } from "./api.mjs";
import {
  guardarEnHistorial,
  leerHistorial,
  guardarModo,
  leerModo,
  borrarHistorial
} from "./storage.mjs";
import {
  mostrarEstado,
  mostrarResultado,
  leerResultado,
  bloquearFormulario,
  alternarHistorial,
  renderizarHistorial
} from "./ui.mjs";

const formulario = document.querySelector("#formulario");
const entradaTexto = document.querySelector("#texto-entrada");
const botonCopiar = document.querySelector("#boton-copiar");
const botonHistorial = document.querySelector("#boton-historial");
const listaHistorial = document.querySelector("#lista-historial");
const grupoModos = document.querySelector("#modos");
const botonBorrar = document.querySelector("#boton-borrar");

async function procesarTexto(evento) {
  evento.preventDefault();

  const texto = entradaTexto.value.trim();
  const modo = formulario.elements.modo.value;

  if (texto === "") {
    mostrarEstado("Escribe un texto antes de continuar.");
    entradaTexto.focus();
    return;
  }

  bloquearFormulario(true);
  mostrarEstado("Procesando con el modelo local...");

  try {
    const mensajes = construirMensajes(modo, texto);
    const resultado = await pedirAlModelo(mensajes);

    mostrarResultado(resultado);
    guardarEnHistorial({ id: Date.now(), modo, original: texto, resultado });
    renderizarHistorial(leerHistorial());
    mostrarEstado("Listo.");
  } catch (error) {
    mostrarEstado(error.message);
  } finally {
    bloquearFormulario(false);
  }
}

async function copiarResultado() {
  const texto = leerResultado();

  if (texto === "") {
    mostrarEstado("Todavía no hay resultado para copiar.");
    return;
  }

  try {
    await navigator.clipboard.writeText(texto);
    mostrarEstado("Resultado copiado al portapapeles.");
  } catch (error) {
    mostrarEstado("No se pudo copiar. Selecciona el texto y usa Ctrl + C.");
  }
}

function recuperarEntrada(evento) {
  const boton = evento.target.closest("button[data-id]");

  if (boton === null) {
    return;
  }

  const entrada = leerHistorial().find((item) => String(item.id) === boton.dataset.id);

  if (entrada === undefined) {
    return;
  }

  entradaTexto.value = entrada.original;
  formulario.elements.modo.value = entrada.modo;
  mostrarResultado(entrada.resultado);
  mostrarEstado("Entrada recuperada del historial.");
}
function recordarModo(evento) {
  if (evento.target.name === "modo") {
    guardarModo(evento.target.value);
  }
}

function limpiarHistorial() {
  borrarHistorial();
  renderizarHistorial([]);
  mostrarEstado("Historial borrado.");
}
formulario.addEventListener("submit", procesarTexto);
botonCopiar.addEventListener("click", copiarResultado);
botonHistorial.addEventListener("click", alternarHistorial);
listaHistorial.addEventListener("click", recuperarEntrada);
grupoModos.addEventListener("change", recordarModo);
botonBorrar.addEventListener("click", limpiarHistorial);

const modoGuardado = leerModo();
if (modoGuardado !== null) {
  formulario.elements.modo.value = modoGuardado;
}
renderizarHistorial(leerHistorial());