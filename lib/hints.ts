
import { GoogleGenAI } from "@google/genai";
import { Category } from '../types';

const HINT_CACHE_KEY = 'impostor_hint_cache_v1';

export const HINTS_MAPPING: Record<string, string> = {
  // Comida
  "Pizza": "Horno", "Sushi": "Palillos", "Paella": "Arroz", "Burger": "Carne", "Tacos": "Picante",
  "Ramen": "Sopa", "Pasta": "Italia", "Ensalada": "Verde", "Tarta": "Dulce", "Helado": "Frío",
  "Croqueta": "Frita", "Jamón": "Cerdo", "Gazpacho": "Tomate", "Lentejas": "Cuchara", "Burrito": "Tortilla",
  // Lugares
  "París": "Torre", "Tokio": "Neón", "Playa": "Arena", "Selva": "Árboles", "Marte": "Rojo",
  "Londres": "Niebla", "Roma": "Ruinas", "Desierto": "Calor", "Montaña": "Cima", "Cine": "Película",
  // Profesiones
  "Médico": "Salud", "Astronauta": "Espacio", "Chef": "Cocina", "Bombero": "Fuego", "Policía": "Ley",
  "Abogado": "Juicio", "Ingeniero": "Planos", "Artista": "Cuadro", "Músico": "Notas", "Veterinario": "Animales",
  // Objetos
  "Reloj": "Tiempo", "Paraguas": "Lluvia", "Guitarra": "Cuerdas", "Martillo": "Clavo", "Tijeras": "Corte",
  "Espejo": "Reflejo", "Cámara": "Foto", "Teléfono": "Llamada", "Libro": "Páginas", "Llave": "Puerta",
  // Deportes
  "Fútbol": "Gol", "Tenis": "Raqueta", "Surf": "Olas", "Boxeo": "Guantes", "Baloncesto": "Canasta",
  "Natación": "Agua", "Ciclismo": "Bici", "Golf": "Hoyo", "Yoga": "Postura", "Pádel": "Pala",
  // España
  "Flamenco": "Baile", "Siesta": "Sueño", "Fiesta": "Noche", "Dalí": "Bigote", "Real Madrid": "Blanco",
  "Barça": "Azulgrana", "Sidra": "Asturias", "Camino de Santiago": "Andar"
};

export const getCategoryFallback = (category: Category): string => {
  switch (category) {
    case 'Comida': return 'Sabor';
    case 'Lugares': return 'Viaje';
    case 'Profesiones': return 'Trabajo';
    case 'Objetos': return 'Cosa';
    case 'Deportes': return 'Equipo';
    case 'Famosos': return 'Persona';
    case 'España': return 'Cultura';
    default: return 'Tema';
  }
};

/**
 * Obtiene una pista utilizando la SDK de Gemini directamente en el cliente.
 */
export const getDynamicHint = async (word: string, category: Category, enabled: boolean): Promise<string | undefined> => {
  if (!enabled) return undefined;

  const cacheKey = `${category}::${word.trim().toLowerCase()}`;
  
  // 1. Intentar desde Cache
  try {
    const cacheRaw = localStorage.getItem(HINT_CACHE_KEY);
    const cache = cacheRaw ? JSON.parse(cacheRaw) : {};
    const cached = cache[cacheKey];
    if (cached) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'pre-fix',
          hypothesisId:'D',
          location:'lib/hints.ts:getDynamicHint',
          message:'cache-hit',
          data:{word,category,hint:cached},
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion
      return cached;
    }
  } catch (e) {}

  // 2. Intentar Gemini directamente
  try {
    const apiKey = process.env.API_KEY || "";
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A',location:'lib/hints.ts:getDynamicHint',message:'api-key-check',data:{hasKey:!!apiKey,keyLength:apiKey.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Palabra secreta: ${word}\nCategoría: ${category || 'sin categoría'}\nGenera una pista de UNA palabra relacionada de dificultad media: ni demasiado evidente ni demasiado difícil. Prohibido: devolver la palabra secreta, pistas de letras, o sinónimos exactos muy obvios. Devuelve SOLO la palabra.`,
      config: {
        systemInstruction: "Eres un generador de pistas para un juego social. Tu misión es ayudar al impostor dándole una palabra clave relacionada pero sutil. Devuelve SOLO 1 palabra en español. No uses frases, ni puntuación, ni comillas.",
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    const hint = text.trim().split(/\s+/)[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'pre-fix',
        hypothesisId:'E',
        location:'lib/hints.ts:getDynamicHint',
        message:'gemini-response',
        data:{word,category,hint},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion

    if (hint) {
      saveToCache(cacheKey, hint);
      return hint;
    }
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B',location:'lib/hints.ts:getDynamicHint',message:'gemini-error',data:{word,category,errorMsg:error?.message||String(error),errorCode:error?.code},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    console.warn("Gemini Client Error, using fallbacks:", error);
  }

  // 3. Fallback a Mapping Local
  const normalizedWord = word.trim();
  const localHint = HINTS_MAPPING[normalizedWord];
  if (localHint) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C',location:'lib/hints.ts:getDynamicHint',message:'local-map-hit',data:{word,category,hint:localHint},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return localHint;
  }
  
  // 4. Fallback final por Categoría
  const fallbackHint = getCategoryFallback(category);
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'F',location:'lib/hints.ts:getDynamicHint',message:'category-fallback',data:{word,category,hint:fallbackHint},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return fallbackHint;
};

function saveToCache(key: string, value: string) {
  try {
    const cacheRaw = localStorage.getItem(HINT_CACHE_KEY);
    const cache = cacheRaw ? JSON.parse(cacheRaw) : {};
    cache[key] = value;
    localStorage.setItem(HINT_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}
