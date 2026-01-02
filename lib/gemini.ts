
import { GoogleGenAI } from "@google/genai";

/**
 * Lógica para llamar a Gemini directamente si se dispone de la API_KEY en el contexto actual.
 * Se usa como puente para el endpoint de la API.
 */
export async function fetchDynamicHint(secretWord: string, category: string): Promise<string | null> {
  try {
    const response = await fetch('/api/hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretWord, category }),
    });

    if (!response.ok) throw new Error("API Route failed");
    
    const data = await response.json();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'pre-fix',
        hypothesisId:'H',
        location:'lib/gemini.ts:fetchDynamicHint',
        message:'server-response',
        data:{hint:data?.hint ?? null, source:data?.source, attempts:data?.attempts, category, secretWord},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion
    return data.hint || null;
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/21a03e11-e3f9-463e-952f-3106f2bb27af',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'pre-fix',
        hypothesisId:'I',
        location:'lib/gemini.ts:fetchDynamicHint',
        message:'server-error',
        data:{category, secretWord, error:String(error)},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion
    console.warn("Error fetching dynamic hint from API:", error);
    return null;
  }
}
