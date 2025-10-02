import { GAME_CODE_LENGTH, GAME_CODE_CHARS } from "./constants";

/**
 * Generate a unique game code
 */
export function generateGameCode(): string {
  let code = "";
  for (let i = 0; i < GAME_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * GAME_CODE_CHARS.length);
    code += GAME_CODE_CHARS[randomIndex];
  }
  return code;
}

/**
 * Validate game code format
 */
export function isValidGameCode(code: string): boolean {
  if (code.length !== GAME_CODE_LENGTH) return false;

  for (const char of code) {
    if (!GAME_CODE_CHARS.includes(char)) return false;
  }

  return true;
}

/**
 * Generate unique player ID
 */
export function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate unique game ID
 */
export function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Sanitize player name
 */
export function sanitizePlayerName(name: string): string {
  return name
    .trim()
    .substring(0, 20) // Max 20 characters
    .replace(/[<>]/g, ""); // Remove potential HTML tags
}
