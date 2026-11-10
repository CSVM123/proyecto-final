const CLAVE_MODO = "corrector:modo";
const CLAVE_HISTORIAL = "corrector:historial";
const MAXIMO_HISTORIAL = 10;

function esEntradaValida(entrada) {
  return (
    typeof entrada === "object" &&
    entrada !== null &&
    typeof entrada.id === "number" &&
    typeof entrada.modo === "string" &&
    typeof entrada.original === "string" &&
    typeof entrada.resultado === "string"
  );
}

export function guardarModo(modo) {
  try {
    localStorage.setItem(CLAVE_MODO, modo);
  } catch (error) {
    console.error("No se pudo guardar el modo:", error);
  }
}

export function leerModo() {
  try {
    return localStorage.getItem(CLAVE_MODO);
  } catch (error) {
    return null;
  }
}

export function leerHistorial() {
  try {
    const texto = sessionStorage.getItem(CLAVE_HISTORIAL);

    if (texto === null) {
      return [];
    }

    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? datos.filter(esEntradaValida) : [];
  } catch (error) {
    return [];
  }
}

export function guardarEnHistorial(entrada) {
  const historial = leerHistorial();
  historial.unshift(entrada);

  try {
    sessionStorage.setItem(
      CLAVE_HISTORIAL,
      JSON.stringify(historial.slice(0, MAXIMO_HISTORIAL))
    );
  } catch (error) {
    console.error("No se pudo guardar el historial:", error);
  }
}

export function borrarHistorial() {
  sessionStorage.removeItem(CLAVE_HISTORIAL);
}