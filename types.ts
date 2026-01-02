
export type Category = 'Comida' | 'Lugares' | 'Profesiones' | 'Objetos' | 'Deportes' | 'Famosos' | 'España' | 'Random' | 'Personalizada';

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
  votesReceived: number;
}

export interface GameConfig {
  playerNames: string[];
  impostorCount: number;
  category: Category;
  customWord: string;
  customHintWord?: string; // Pista manual para palabras personalizadas
  discussionMinutes: number;
  rememberSettings: boolean; 
  impostorHintEnabled: boolean; // Si el impostor recibe una pista
  keepLastImpostors: boolean;   
}

export type GamePhase = 'HOME' | 'SETUP' | 'REVEAL' | 'DISCUSSION' | 'VOTE' | 'RESULTS';

export interface GameState {
  phase: GamePhase;
  config: GameConfig;
  players: Player[];
  secretWord: string;
  hintWord?: string; // Palabra relacionada para el impostor
  revealIndex: number;
  isRevealing: boolean;
  timeLeft: number;
  isTimerRunning: boolean;
  voterIndex: number;
  startingPlayerId?: string; // ID del jugador que empieza el debate
  isCompleted?: boolean;
  lastSavedAt?: number;
  results: {
    winners: 'Inocentes' | 'Impostores';
    mostVotedId: string | null;
  } | null;
}
