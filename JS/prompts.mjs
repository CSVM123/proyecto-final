const REGLAS_GENERALES =
  "Eres un asistente de redacción en español. " +
  "Responde SOLO con el texto resultante, sin explicaciones, sin comillas y sin comentarios.";

const INSTRUCCIONES = {
  corregir: "Corrige únicamente la ortografía, la gramática y la puntuación. No cambies el significado ni el estilo.",
  mejorar: "Mejora la redacción para que sea más clara y fluida, conservando el significado.",
  formal: "Reescribe el texto con un tono formal y profesional, conservando el significado.",
  resumir: "Resume el texto en pocas frases, conservando las ideas principales."
};

export function construirMensajes(modo, texto) {
  const instruccion = INSTRUCCIONES[modo];

  if (instruccion === undefined) {
    throw new Error(`Modo no válido: ${modo}`);
  }

  return [
    { role: "system", content: `${REGLAS_GENERALES} ${instruccion}` },
    { role: "user", content: texto }
  ];
}