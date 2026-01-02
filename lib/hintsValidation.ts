const GENERIC_BLACKLIST = [
  "tema","contexto","cosa","algo","objeto","persona","lugar","sabor",
  "equipo","trabajo","viaje","cultura","concepto","idea","general","uso",
  "mapa","oficio","ingrediente","informacion","categoría","categoria"
];

const STOPWORDS = [
  "de","la","el","un","una","uno","los","las","lo","y","o","u","en","al","del",
  "por","para","con","sin","sobre","entre","hasta","desde","ante","bajo","tras"
];

export const getGenericBlacklist = () => GENERIC_BLACKLIST;

export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function sanitizeHintWord(raw: string): string {
  const main = raw.trim().split(/\s+/)[0] || "";
  return main.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"]/g, "");
}

export function isValidHint(hint: string, secretWord: string): boolean {
  if (!hint) return false;
  const sanitized = sanitizeHintWord(hint);
  const normalizedHint = normalizeText(sanitized);
  const normalizedSecret = normalizeText(secretWord);
  if (sanitized.length < 3) return false;
  if (normalizedHint === normalizedSecret) return false;
  if (/\d/.test(sanitized)) return false;
  if (/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ-]/.test(sanitized)) return false;
  if (/\s/.test(sanitized)) return false;
  if (GENERIC_BLACKLIST.includes(normalizedHint)) return false;
  if (STOPWORDS.includes(normalizedHint)) return false;
  return true;
}

