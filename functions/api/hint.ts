import { GoogleGenAI } from "@google/genai";
import { isValidHint, sanitizeHintWord } from "../../lib/hintsValidation";

type HintRequest = {
  secretWord?: string;
  category?: string;
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Record<string, string> }) => {
  try {
    const { secretWord, category }: HintRequest = await request.json();
    const sanitizedWord = secretWord?.trim();
    const sanitizedCategory = category?.trim() || 'sin categoría';

    if (!sanitizedWord || sanitizedWord.length < 2) {
      return new Response(JSON.stringify({ error: "Palabra inválida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Falta la variable GEMINI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'pre-fix',
        hypothesisId:'entry',
        location:'functions/api/hint.ts:onRequestPost',
        message:'request-received',
        data:{sanitizedWord,sanitizedCategory},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion

    const { hint, source, attempts } = await generateRobustHint(apiKey, sanitizedWord, sanitizedCategory);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'pre-fix',
        hypothesisId:'overall',
        location:'functions/api/hint.ts:onRequestPost',
        message:'hint-response',
        data:{hint,source,attempts,category:sanitizedCategory,secretWord:sanitizedWord},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion

    return new Response(JSON.stringify({ hint: hint || null, source, attempts }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'pre-fix',
        hypothesisId:'error',
        location:'functions/api/hint.ts:onRequestPost',
        message:'exception',
        data:{error:String(error)},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion
    return new Response(JSON.stringify({ error: "Error generando pista" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

const LOCAL_HINTS: Record<string, string> = {
  "Pizza": "Horno", "Sushi": "Palillos", "Paella": "Arroz", "Burger": "Carne", "Tacos": "Picante",
  "Ramen": "Sopa", "Pasta": "Italia", "Ensalada": "Verde", "Tarta": "Dulce", "Helado": "Frío",
  "Croqueta": "Frita", "Jamón": "Cerdo", "Gazpacho": "Tomate", "Lentejas": "Cuchara", "Burrito": "Tortilla",
  "París": "Torre", "Tokio": "Neón", "Playa": "Arena", "Selva": "Árboles", "Marte": "Rojo",
  "Londres": "Niebla", "Roma": "Ruinas", "Desierto": "Calor", "Montaña": "Cima", "Cine": "Película",
  "Médico": "Salud", "Astronauta": "Espacio", "Chef": "Cocina", "Bombero": "Fuego", "Policía": "Ley",
  "Abogado": "Juicio", "Ingeniero": "Planos", "Artista": "Cuadro", "Músico": "Notas", "Veterinario": "Animales",
  "Reloj": "Tiempo", "Paraguas": "Lluvia", "Guitarra": "Cuerdas", "Martillo": "Clavo", "Tijeras": "Corte",
  "Espejo": "Reflejo", "Cámara": "Foto", "Teléfono": "Llamada", "Libro": "Páginas", "Llave": "Puerta",
  "Fútbol": "Gol", "Tenis": "Raqueta", "Surf": "Olas", "Boxeo": "Guantes", "Baloncesto": "Canasta",
  "Natación": "Agua", "Ciclismo": "Bici", "Golf": "Hoyo", "Yoga": "Postura", "Pádel": "Pala",
  "Flamenco": "Baile", "Siesta": "Sueño", "Fiesta": "Noche", "Dalí": "Bigote", "Real Madrid": "Blanco",
  "Barça": "Azulgrana", "Sidra": "Asturias", "Camino de Santiago": "Andar"
};

const CATEGORY_FALLBACKS: Record<string, string> = {
  Comida: "cocina",
  Lugares: "viaje",
  Profesiones: "uniforme",
  Objetos: "mano",
  Deportes: "pista",
  Random: "señal",
  España: "tradición",
  default: "señal",
};

async function generateRobustHint(apiKey: string, secretWord: string, category: string): Promise<{ hint: string | null; source: string; attempts: number }> {
  const ai = new GoogleGenAI({ apiKey });
  const maxAttempts = 2;
  const variations = [
    // intento 1 (prompt principal)
    `Palabra secreta: ${secretWord} 
    **Situación**
Estás participando en el juego del Impostor, donde un jugador (el impostor) debe adivinar una palabra secreta basándose en pistas que recibe. El impostor tiene conocimiento limitado y debe usar la lógica para descubrir la palabra correcta.

**Tarea**
Cuando recibas una palabra secreta, debes generar una pista en forma de una sola palabra que ayude al impostor a adivinar la palabra sin revelarla directamente. La pista debe ser lo suficientemente clara para guiar al impostor, pero lo suficientemente ambigua para mantener el desafío del juego.

**Objetivo**
Proporcionar pistas estratégicas que equilibren la dificultad del juego, permitiendo que el impostor tenga oportunidades razonables de adivinar la palabra secreta mientras mantiene el elemento de misterio.

**Conocimiento**
- La pista debe ser una única palabra
- La pista no debe ser la palabra secreta ni parte literal de ella
- La pista debe estar relacionada conceptualmente con la palabra secreta (puede ser un sinónimo, una categoría, una característica, una función o una asociación común)
- El nivel de dificultad debe ajustarse según lo especificado por el usuario
- Palabra secreta a adivinar: ${secretWord}
- Nivel de dificultad solicitado: Moderado

**Instrucciones de Dificultad**
- **Fácil**: Proporciona pistas muy cercanas al significado o uso común de la palabra
- **Moderado**: Proporciona pistas que requieren cierta reflexión pero son accesibles
- **Difícil**: Proporciona pistas abstractas, indirectas o que requieren pensamiento lateral o conciencia.`,

    // intento 2 (más guiado)
    `Palabra secreta: ${secretWord}
Categoría: ${category || 'sin categoría'}

Devuelve UNA palabra MUY relacionada (dificultad media) eligiendo EXACTAMENTE uno de estos tipos:
- herramienta/parte/material
- lugar típico
- acción típica

PROHIBIDO: tema, contexto, concepto, cosa, algo, objeto, persona, lugar, idea, general, pista, información, categoría.
Devuelve SOLO 1 palabra.`
  ];

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'pre-fix',
      hypothesisId:'A',
      location:'functions/api/hint.ts:generateRobustHint',
      message:'entry',
      data:{secretWord,category,maxAttempts},
      timestamp:Date.now()
    })
  }).catch(()=>{});
  // #endregion

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: variations[attempt],
        config: {
          systemInstruction: "Eres un generador de pistas para un juego social. Responde SOLO con 1 palabra en español (sin comillas, sin punto). No escribas explicaciones.",
          temperature: 0.7,
        },
      });

      const text = response.text || "";
      const candidate = sanitizeHintWord(text);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'pre-fix',
          hypothesisId:'B',
          location:'functions/api/hint.ts:generateRobustHint',
          message:'attempt',
          data:{attempt:attempt+1,candidateRaw:text?.trim(),candidateSanitized:candidate,isValid:isValidHint(candidate, secretWord)},
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion
      if (isValidHint(candidate, secretWord)) {
        devLog({ source: 'gemini', hint: candidate, secretWord, category, attempts: attempt + 1 });
        return { hint: candidate, source: 'gemini', attempts: attempt + 1 };
      }
    } catch (error) {
      console.warn("Gemini attempt failed (ignored):", error);
    }
  }

  // Local dictionary fallback
  const mapped = LOCAL_HINTS[secretWord];
  if (mapped && isValidHint(mapped, secretWord)) {
    devLog({ source: 'local-map', hint: mapped, secretWord, category, attempts: maxAttempts });
    return { hint: mapped, source: 'local-map', attempts: maxAttempts };
  }

  // Fallback por categoría (no genérico)
  const fallback = CATEGORY_FALLBACKS[category as keyof typeof CATEGORY_FALLBACKS] || CATEGORY_FALLBACKS.default;
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      sessionId:'debug-session',
      runId:'pre-fix',
      hypothesisId:'C',
      location:'functions/api/hint.ts:generateRobustHint',
      message:'category-fallback',
      data:{fallback,category},
      timestamp:Date.now()
    })
  }).catch(()=>{});
  // #endregion
  devLog({ source: 'category-fallback', hint: fallback, secretWord, category, attempts: maxAttempts });
  return { hint: fallback, source: 'category-fallback', attempts: maxAttempts };
}

function devLog(data: any) {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    console.log("[hint-debug]", data);
  }
}
