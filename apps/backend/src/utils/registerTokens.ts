// ── Config ──────────────────────────────────────────────
const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutos
const TOKEN_LENGTH = 32;
 
// ── Token store en memoria ───────────────────────────────
export const registerTokens = {
  tokenA: { value: "", expiresAt: 0 },
  tokenB: { value: "", expiresAt: 0 },
};
 
// ── Helpers ──────────────────────────────────────────────
export function generateToken(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
 
export function isExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}
 
export function refreshIfExpired(key: keyof typeof registerTokens) {
  if (isExpired(registerTokens[key].expiresAt)) {
    registerTokens[key] = {
      value: generateToken(TOKEN_LENGTH),
      expiresAt: Date.now() + TOKEN_TTL_MS,
    };
  }
}

export function printRegisterTokens(){
    console.log(registerTokens)
}