const URL_OLLAMA = "http://localhost:11434/api/chat";
const MODELO = "llama3.2:3b";

export async function pedirAlModelo(mensajes) {
  try {
    const respuesta = await fetch(URL_OLLAMA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODELO,
        messages: mensajes,
        stream: false,
        options: { temperature: 0.2 }
      })
    });

    if (!respuesta.ok) {
      throw new Error(`Ollama respondió con el código ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const contenido = datos.message?.content;

    if (typeof contenido !== "string") {
      throw new Error("La respuesta de Ollama no tiene el formato esperado");
    }

    return contenido.trim();
  } catch (error) {
    console.error("Detalle técnico del error:", error);

    if (error instanceof TypeError) {
      throw new Error("No se pudo conectar con Ollama. Verifica que esté abierto.");
    }
    throw new Error("El modelo no pudo procesar tu texto. Intenta de nuevo.");
  }
}