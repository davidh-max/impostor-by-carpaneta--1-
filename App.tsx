
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Play, Eye, EyeOff, Vote, RotateCcw, Users, Settings as SettingsIcon,
  ChevronRight, Pause, AlertTriangle, Trophy, Skull, Utensils, MapPin, Briefcase,
  Package, Dribbble, Star, Flag, Shuffle, Pencil, UserX, Eraser, LogOut, Sparkles, X, Loader2,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GameState, Player, Category, GameConfig } from './types';
import { WORD_PACKS, CATEGORY_METADATA } from './constants';
import { shuffle, generateId, saveToLocal, loadFromLocal } from './utils';
import { 
  writeDraft, readDraft, clearDraft, writeLastImpostors, readLastImpostors, 
  saveActiveGame, loadActiveGame, clearActiveGame 
} from './lib/storage';
import { getDynamicHint } from './lib/hints';
import { writeGameToFirestore, registerPlayersOnce, normalizePlayerName } from './lib/firestoreWrites';

// --- Icon Mapper ---
const CategoryIcon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: Record<string, any> = { Utensils, MapPin, Briefcase, Package, Dribbble, Star, Flag, Shuffle, Pencil };
  const Icon = icons[name] || Shuffle;
  return <Icon size={size} className={className} />;
};

// --- Branding Components ---
const CrestLogo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <div className={`${className} bg-white rounded-full shadow-sm overflow-hidden flex items-center justify-center`}>
    <img 
      src="/escudo-carpaneta.png" 
      alt="Carpaneta CF" 
      className="h-full w-full object-contain"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement!.classList.add('bg-[#FE70C8]');
      }} 
    />
  </div>
);

const Header = ({ onHomeClick, onExitClick, showExit }: { onHomeClick?: () => void, onExitClick?: () => void, showExit?: boolean }) => (
  <header className="flex flex-row items-center justify-between px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-sm z-30 border-b border-slate-200">
    <div className="flex items-center space-x-3 cursor-pointer" onClick={onHomeClick}>
      <CrestLogo className="h-10 w-10 shadow-sm" />
      <div className="flex flex-col -space-y-1">
        <h1 className="text-xl font-black tracking-tighter text-[#0B0B0B]">IMPOSTOR</h1>
        <span className="text-[9px] font-bold text-[#FE70C8] uppercase tracking-[0.2em]">by Carpaneta</span>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      {showExit && (
        <button 
          onClick={onExitClick}
          className="flex items-center space-x-1 text-[#5F5E5E] font-black uppercase text-[10px] tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-[#0B0B0B]/10 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
        >
          <LogOut size={14} />
          <span>Salir</span>
        </button>
      )}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-[#FE70C8] animate-pulse"></div>
        <span className="text-[10px] font-black text-[#0B0B0B]">LIVE</span>
      </div>
    </div>
  </header>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, fullWidth = false }: any) => {
  const variants: any = {
    primary: 'bg-[#FE70C8] text-white border border-transparent shadow-sm active:translate-y-[1px]',
    secondary: 'bg-white text-[#0B0B0B] border border-slate-200 shadow-sm active:translate-y-[1px]',
    danger: 'bg-red-500 text-white border border-transparent shadow-sm active:translate-y-[1px]',
    ghost: 'bg-transparent text-[#5F5E5E] hover:text-[#FE70C8]',
    neon: 'bg-[#FE70C8] text-white font-black uppercase tracking-wider border border-transparent shadow-md active:translate-y-[2px] transition-all'
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`px-6 py-3 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all disabled:opacity-50 ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {children}
    </button>
  );
};

// --- Helpers ---
const getPlayersSignature = (names: string[]) => [...names].sort().join('|');

const DEFAULT_CONFIG: GameConfig = {
  playerNames: ['Jugador 1', 'Jugador 2', 'Jugador 3'],
  impostorCount: 1,
  category: 'Random',
  customWord: '',
  customHintWord: '',
  discussionMinutes: 3,
  rememberSettings: false,
  impostorHintEnabled: true,
  keepLastImpostors: false,
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const active = loadActiveGame();
    if (active && !active.isCompleted) return active;
    
    const draft = readDraft();
    return {
      phase: 'HOME',
      config: draft ? draft.config : DEFAULT_CONFIG,
      players: [],
      secretWord: '',
      revealIndex: 0,
      isRevealing: false,
      timeLeft: 180,
      isTimerRunning: false,
      voterIndex: 0,
      results: null,
    };
  });

  const [isBlurred, setIsBlurred] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [showStartOverlay, setShowStartOverlay] = useState(false);

  useEffect(() => {
    if (gameState.phase !== 'HOME') {
      saveActiveGame(gameState);
    }
    if (gameState.phase === 'SETUP' || gameState.phase === 'HOME') {
      writeDraft(gameState.config);
    }
  }, [gameState]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && gameState.phase === 'REVEAL' && gameState.isRevealing) {
        setGameState(prev => ({ ...prev, isRevealing: false }));
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [gameState.phase, gameState.isRevealing]);

  useEffect(() => {
    let interval: any;
    if (gameState.isTimerRunning && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isTimerRunning) {
      setGameState(prev => ({ ...prev, isTimerRunning: false }));
    }
    return () => clearInterval(interval);
  }, [gameState.isTimerRunning, gameState.timeLeft]);

  const startGame = async () => {
    const { playerNames, impostorCount, category, customWord, customHintWord, keepLastImpostors, impostorHintEnabled } = gameState.config;
    
    if (playerNames.some(n => n.trim() === '')) return alert('Todos los jugadores deben tener nombre');
    if (new Set(playerNames).size !== playerNames.length) return alert('No puede haber nombres duplicados');
    if (impostorCount >= playerNames.length) return alert('No puede haber más impostores que jugadores');
    if (category === 'Personalizada' && impostorHintEnabled && !customHintWord?.trim()) return alert('Debes escribir una pista para la palabra personalizada');

    setIsStarting(true);
    try {
      let word = '';
      let hint = '';
      
      if (category === 'Personalizada') {
        word = customWord;
        hint = customHintWord || '';
      } else {
        const pack = WORD_PACKS[category as Exclude<Category, 'Personalizada'>];
        word = pack[Math.floor(Math.random() * pack.length)];
        if (impostorHintEnabled) {
          hint = (await getDynamicHint(word, category, true)) || '';
        }
      }

      const currentSignature = getPlayersSignature(playerNames);
      const lastMeta = readLastImpostors();
      let impostorIndices = new Set<number>();

      if (keepLastImpostors && lastMeta && lastMeta.playersSignature === currentSignature && lastMeta.impostorCount === impostorCount) {
        playerNames.forEach((name, idx) => {
          if (lastMeta.impostorNames.includes(name)) impostorIndices.add(idx);
        });
        while (impostorIndices.size < impostorCount) impostorIndices.add(Math.floor(Math.random() * playerNames.length));
      } else {
        while (impostorIndices.size < impostorCount) impostorIndices.add(Math.floor(Math.random() * playerNames.length));
      }

      const shuffledBase = keepLastImpostors ? [...playerNames] : shuffle(playerNames);
      const players: Player[] = shuffledBase.map((name, idx) => ({
        id: generateId(),
        name,
        isImpostor: impostorIndices.has(idx),
        votesReceived: 0,
      }));

      writeLastImpostors({
        impostorNames: players.filter(p => p.isImpostor).map(p => p.name),
        playersSignature: currentSignature,
        impostorCount,
        updatedAt: Date.now()
      }, gameState.config.rememberSettings);

      // Tracking Firestore (fire-and-forget)
      const playersNormalized = playerNames.map(normalizePlayerName);
      void registerPlayersOnce(playerNames);
      void writeGameToFirestore({
        players: playerNames,
        playersNormalized,
        secretWord: word,
        impostorIds: players.filter(p => p.isImpostor).map(p => p.id),
        impostorCount,
        category,
        discussionMinutes: gameState.config.discussionMinutes,
        impostorHintEnabled,
        hintWord: hint || undefined,
        appVersion: import.meta.env.VITE_APP_VERSION || undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      });

      setGameState(prev => ({
        ...prev,
        phase: 'REVEAL',
        players,
        secretWord: word,
        hintWord: hint,
        revealIndex: 0,
        isRevealing: false,
        timeLeft: prev.config.discussionMinutes * 60,
        isTimerRunning: false,
        results: null,
        isCompleted: false,
        startingPlayerId: undefined
      }));
    } finally {
      setIsStarting(false);
    }
  };

  const handleFinalVote = (targetId: string) => {
    const selectedPlayer = gameState.players.find(p => p.id === targetId);
    if (!selectedPlayer) return;
    const winners = selectedPlayer.isImpostor ? 'Inocentes' : 'Impostores';
    if (winners === 'Inocentes') confetti();

    setGameState(prev => ({
      ...prev,
      phase: 'RESULTS',
      isCompleted: true,
      results: { winners, mostVotedId: targetId }
    }));
  };

  const handleClearActiveGame = () => {
    if (window.confirm('¿Borrar la partida guardada?')) {
      clearActiveGame();
      setGameState(prev => ({ ...prev, players: [], secretWord: '', phase: 'HOME' }));
    }
  };

  const renderHome = () => {
    const saved = loadActiveGame();
    const hasActiveGame = saved && !saved.isCompleted;

    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center py-12 overflow-y-auto">
        <div className="relative mb-8">
          <div className="absolute -inset-12 bg-[#FE70C8]/20 blur-[60px] rounded-full"></div>
          <CrestLogo className="h-40 w-40 sticker-shadow relative border-2 border-[#0B0B0B]" />
        </div>
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-5xl font-black tracking-tighter text-[#0B0B0B]">IMPOSTOR</h1>
          <span className="text-sm font-black text-[#FE70C8] uppercase tracking-[0.3em] mt-1">by Carpaneta</span>
        </div>
        
        <div className="w-full max-w-xs space-y-4 pb-12 z-20">
          {hasActiveGame ? (
            <>
              <Button variant="neon" fullWidth onClick={() => setGameState(saved)}>
                <Play size={20} fill="currentColor" />
                <span>REANUDAR PARTIDA</span>
              </Button>
              <Button variant="secondary" fullWidth onClick={handleClearActiveGame}>
                <X size={18} />
                <span>DESCARTAR PARTIDA</span>
              </Button>
            </>
          ) : (
            <Button variant="neon" fullWidth onClick={() => setGameState(prev => ({ ...prev, phase: 'SETUP' }))}>
              <Play size={20} fill="currentColor" />
              <span>NUEVA PARTIDA</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderSetup = () => (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <Header onHomeClick={() => setGameState(prev => ({ ...prev, phase: 'HOME' }))} />
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-8">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <SettingsIcon size={20} className="text-[#FE70C8]" />
              <h2 className="text-2xl font-black text-[#0B0B0B] tracking-tight uppercase">Setup</h2>
            </div>
        </div>

        <section className="bg-white p-5 rounded-3xl border-2 border-[#0B0B0B] sticker-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-[#5F5E5E] uppercase tracking-widest flex items-center gap-2">
              <Users size={16} /> Jugadores ({gameState.config.playerNames.length})
            </h3>
            <button onClick={() => {
              if (gameState.config.playerNames.length >= 20) return;
              setGameState(prev => ({ ...prev, config: { ...prev.config, playerNames: [...prev.config.playerNames, `Jugador ${prev.config.playerNames.length + 1}`] } }));
            }} className="bg-[#FE70C8] text-white p-1 rounded-md border-2 border-[#0B0B0B] sticker-shadow-sm active:scale-90"><Plus size={20} /></button>
          </div>
          <div className="space-y-3">
            {gameState.config.playerNames.map((name, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="text" value={name} onChange={(e) => {
                  const newNames = [...gameState.config.playerNames];
                  newNames[idx] = e.target.value;
                  setGameState(prev => ({ ...prev, config: { ...prev.config, playerNames: newNames } }));
                }} className="flex-grow bg-white border-2 border-[#0B0B0B] rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-[#FE70C8]" />
                {gameState.config.playerNames.length > 2 && (
                  <button onClick={() => {
                    const newNames = gameState.config.playerNames.filter((_, i) => i !== idx);
                    setGameState(prev => ({ ...prev, config: { ...prev.config, playerNames: newNames } }));
                  }} className="text-[#5F5E5E] hover:text-red-500 p-2"><Trash2 size={18} /></button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#5F5E5E] uppercase tracking-widest ml-1">Impostores</label>
              <select value={gameState.config.impostorCount} onChange={(e) => setGameState(prev => ({ ...prev, config: { ...prev.config, impostorCount: parseInt(e.target.value) } }))} className="w-full bg-white border-2 border-[#0B0B0B] rounded-xl p-3 text-sm font-black outline-none">
                <option value={1}>1 Impostor</option><option value={2}>2 Impostores</option><option value={3}>3 Impostores</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#5F5E5E] uppercase tracking-widest ml-1">Tiempo (min)</label>
              <select value={gameState.config.discussionMinutes} onChange={(e) => setGameState(prev => ({ ...prev, config: { ...prev.config, discussionMinutes: parseInt(e.target.value) } }))} className="w-full bg-white border-2 border-[#0B0B0B] rounded-xl p-3 text-sm font-black outline-none">
                {[1, 2, 3, 5, 10].map(m => <option key={m} value={m}>{m} min</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#5F5E5E] uppercase tracking-widest ml-1">Categoría</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(CATEGORY_METADATA) as Category[]).map(cat => {
                const isActive = gameState.config.category === cat;
                return (
                  <button key={cat} onClick={() => setGameState(prev => ({ ...prev, config: { ...prev.config, category: cat } }))} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all active:scale-95 ${isActive ? 'border-[#0B0B0B] bg-[#FE70C8] text-white sticker-shadow-sm' : 'border-[#0B0B0B]/10 bg-white text-[#5F5E5E]'}`}>
                    <CategoryIcon name={CATEGORY_METADATA[cat].iconName} className={isActive ? 'text-white' : 'text-[#FE70C8]'} />
                    <span className="text-[9px] font-black uppercase tracking-wider mt-2">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {gameState.config.category === 'Personalizada' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#5F5E5E] uppercase tracking-widest ml-1">Palabra Secreta</label>
                <input type="text" placeholder="Ej: Carpaneta CF" value={gameState.config.customWord} onChange={(e) => setGameState(prev => ({ ...prev, config: { ...prev.config, customWord: e.target.value } }))} className="w-full bg-white border-2 border-[#0B0B0B] rounded-xl p-3 text-sm font-black outline-none focus:border-[#FE70C8]" />
              </div>
              {gameState.config.impostorHintEnabled && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#5F5E5E] uppercase tracking-widest ml-1">Pista para el Impostor</label>
                  <input type="text" placeholder="Ej: Fútbol" value={gameState.config.customHintWord} onChange={(e) => setGameState(prev => ({ ...prev, config: { ...prev.config, customHintWord: e.target.value.split(' ')[0] } }))} className="w-full bg-white border-2 border-[#0B0B0B] rounded-xl p-3 text-sm font-black outline-none focus:border-[#FE70C8]" />
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t-2 border-[#0B0B0B]/5 space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={gameState.config.impostorHintEnabled} onChange={(e) => setGameState(prev => ({ ...prev, config: { ...prev.config, impostorHintEnabled: e.target.checked } }))} />
                <div className={`w-10 h-5 rounded-full border border-[#0B0B0B] transition-colors ${gameState.config.impostorHintEnabled ? 'bg-[#FE70C8]' : 'bg-slate-200'}`}></div>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full border border-[#0B0B0B] transition-transform bg-white ${gameState.config.impostorHintEnabled ? 'translate-x-5' : ''}`}></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-widest">Dar pista al impostor</span>
                <span className="text-[9px] text-[#5F5E5E]">Gemini generará 1 palabra clave sutilmente.</span>
              </div>
            </label>
          </div>
        </section>
      </div>
      <div className="p-6 bg-white border-t-2 border-[#0B0B0B]/5 sticky bottom-0 z-20">
        <Button variant="neon" fullWidth onClick={startGame} disabled={isStarting}>
          {isStarting ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
          <span>{isStarting ? 'Generando pista...' : '¡EMPEZAR!'}</span>
        </Button>
      </div>
    </div>
  );

  const renderReveal = () => {
    const player = gameState.players[gameState.revealIndex];
    if (!player) return null;
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <Header onHomeClick={() => setGameState(prev => ({ ...prev, phase: 'HOME' }))} onExitClick={() => setShowExitModal(true)} showExit />
        <div className={`flex-1 flex flex-col items-center justify-center px-6 py-10 transition-all ${isBlurred ? 'blur-3xl' : ''}`}>
          <div className="text-center mb-8">
            <span className="text-[#5F5E5E] uppercase tracking-widest font-black text-[10px]">Turno de:</span>
            <h2 className="text-4xl font-black mt-1 text-[#FE70C8] tracking-tighter">{player.name}</h2>
          </div>
          <AnimatePresence mode="wait">
            {!gameState.isRevealing ? (
              <motion.div key="hidden" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }} className="w-full max-w-xs aspect-square bg-white rounded-3xl border-2 border-dashed border-[#0B0B0B]/20 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-[#FE70C8]/5 flex items-center justify-center mb-6"><Eye size={40} className="text-[#FE70C8]" /></div>
                <Button variant="primary" onClick={() => setGameState(prev => ({ ...prev, isRevealing: true }))}>VER MI PALABRA</Button>
              </motion.div>
            ) : (
              <motion.div key="revealed" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }} className={`w-full max-w-xs aspect-square rounded-3xl p-8 flex flex-col items-center justify-center text-center border-4 border-[#0B0B0B] sticker-shadow ${player.isImpostor ? 'impostor-gradient' : 'reveal-gradient'}`}>
                {player.isImpostor ? (
                  <>
                    <Skull size={72} className="mb-4 text-white" />
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Eres el<br/>Impostor</h3>
                    {gameState.config.impostorHintEnabled && gameState.hintWord && (
                      <div className="mt-4 flex flex-col items-center gap-1 bg-white/20 px-4 py-2 rounded-2xl border border-white/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                           <Sparkles size={12} className="text-[#FE70C8]" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-white opacity-80">Pista Gemini</span>
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter text-white">{gameState.hintWord}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-white/70 uppercase tracking-widest font-black text-[10px] mb-2">Tu palabra es:</span>
                    <h3 className="text-4xl font-black text-white break-words tracking-tighter uppercase leading-none">{gameState.secretWord}</h3>
                  </>
                )}
                <div className="mt-8 pt-6 border-t border-white/20 w-full">
                  <Button variant="secondary" fullWidth onClick={() => {
                    if (gameState.revealIndex < gameState.players.length - 1) {
                      setGameState(prev => ({ ...prev, revealIndex: prev.revealIndex + 1, isRevealing: false }));
                    } else {
                      // SELECCIÓN ALEATORIA DEL QUE EMPIEZA
                      const randomIndex = Math.floor(Math.random() * gameState.players.length);
                      const starter = gameState.players[randomIndex];
                      setGameState(prev => ({ 
                        ...prev, 
                        phase: 'DISCUSSION', 
                        startingPlayerId: starter.id,
                        isTimerRunning: false 
                      }));
                      setShowStartOverlay(true);
                    }
                  }}><EyeOff size={18} /><span>OK, ENTENDIDO</span></Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderDiscussion = () => {
    const startingPlayer = gameState.players.find(p => p.id === gameState.startingPlayerId);
    return (
      <div className="flex flex-col h-full overflow-hidden relative">
        <Header onHomeClick={() => setGameState(prev => ({ ...prev, phase: 'HOME' }))} onExitClick={() => setShowExitModal(true)} showExit />
        
        {/* Overlay de quién empieza */}
        <AnimatePresence>
          {showStartOverlay && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.1 }} 
              className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-40 bg-white border-4 border-[#0B0B0B] p-8 rounded-3xl sticker-shadow text-center space-y-6"
            >
              <div className="mx-auto w-16 h-16 bg-[#FE70C8]/10 rounded-full flex items-center justify-center">
                <Mic size={32} className="text-[#FE70C8]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black text-[#5F5E5E] uppercase tracking-[0.2em]">El azar ha decidido</h3>
                <p className="text-3xl font-black text-[#0B0B0B] tracking-tighter leading-tight uppercase">Empieza hablando:<br/><span className="text-[#FE70C8]">{startingPlayer?.name}</span></p>
              </div>
              <Button variant="neon" fullWidth onClick={() => { setShowStartOverlay(false); setGameState(prev => ({ ...prev, isTimerRunning: true })); }}>
                <Play size={20} fill="currentColor" />
                <span>COMENZAR DEBATE</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`flex-1 overflow-y-auto px-6 py-6 pb-24 transition-all ${showStartOverlay ? 'blur-md grayscale pointer-events-none' : ''}`}>
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className={`text-8xl font-black tabular-nums tracking-tighter transition-all ${gameState.timeLeft < 10 ? 'text-red-500 scale-110' : 'text-[#0B0B0B]'}`}>
              {Math.floor(gameState.timeLeft / 60)}:{String(gameState.timeLeft % 60).padStart(2, '0')}
            </div>
            <div className="flex space-x-4">
              <Button variant="secondary" onClick={() => setGameState(prev => ({ ...prev, isTimerRunning: !prev.isTimerRunning }))}>{gameState.isTimerRunning ? <Pause size={28} /> : <Play size={28} />}</Button>
              <Button variant="secondary" onClick={() => setGameState(prev => ({ ...prev, timeLeft: prev.config.discussionMinutes * 60 }))}><RotateCcw size={28} /></Button>
            </div>
            {startingPlayer && (
              <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full border border-[#0B0B0B]/10">
                <Sparkles size={14} className="text-[#FE70C8]" />
                <span className="text-[10px] font-black text-[#5F5E5E] uppercase tracking-widest">Empieza: {startingPlayer.name}</span>
              </div>
            )}
          </div>
          <div className="mt-8 space-y-3">
            <h3 className="text-[10px] font-black text-[#5F5E5E] uppercase tracking-widest mb-4">Jugadores</h3>
            {gameState.players.map(p => (
              <div key={p.id} className={`bg-white p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${p.id === gameState.startingPlayerId ? 'border-[#FE70C8] sticker-shadow-sm' : 'border-[#0B0B0B]/10'}`}>
                <span className="font-bold text-[#0B0B0B] uppercase text-sm">{p.name}</span>
                {p.id === gameState.startingPlayerId && <Mic size={16} className="text-[#FE70C8]" />}
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 bg-white border-t-2 border-[#0B0B0B]/5 sticky bottom-0">
          <Button variant="neon" fullWidth onClick={() => setGameState(prev => ({ ...prev, phase: 'VOTE' }))}>
            <Vote size={22} />
            <span>FINALIZAR DEBATE</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderVote = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      <Header onHomeClick={() => setGameState(prev => ({ ...prev, phase: 'HOME' }))} onExitClick={() => setShowExitModal(true)} showExit />
      <div className="px-6 py-8 space-y-8 pb-24 text-center">
        <div className="mb-4 inline-flex p-5 bg-[#FE70C8]/10 rounded-full border-2 border-[#FE70C8]/20"><UserX size={40} className="text-[#FE70C8]" /></div>
        <h2 className="text-3xl font-black text-[#0B0B0B] tracking-tighter uppercase">¿Quién es el traidor?</h2>
        <div className="grid gap-3">{gameState.players.map(p => (
          <button key={p.id} onClick={() => handleFinalVote(p.id)} className="group p-5 rounded-2xl bg-white border-2 border-[#0B0B0B] hover:bg-[#FE70C8] hover:text-white transition-all sticker-shadow-sm flex justify-between items-center active:scale-95">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-[#FE70C8]/10 flex items-center justify-center text-sm font-black group-hover:bg-white text-[#FE70C8]"> {p.name.charAt(0)} </div>
              <span className="font-black text-xl tracking-tight uppercase">{p.name}</span>
            </div>
            <ChevronRight size={20} className="text-[#5F5E5E] group-hover:text-white" />
          </button>
        ))}</div>
      </div>
    </div>
  );

  const renderResults = () => {
    const mostVoted = gameState.results?.mostVotedId ? gameState.players.find(p => p.id === gameState.results?.mostVotedId) : null;
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        <Header onHomeClick={() => setGameState(prev => ({ ...prev, phase: 'HOME' }))} />
        <div className="px-6 py-10 pb-24 text-center">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-[80px] rounded-full"></div>
            {gameState.results?.winners === 'Inocentes' ? <Trophy size={110} className="text-yellow-500 relative animate-bounce mx-auto" /> : <AlertTriangle size={110} className="text-red-500 relative mx-auto" />}
            <h2 className="text-5xl font-black uppercase tracking-tighter mt-4 leading-none">{gameState.results?.winners === 'Inocentes' ? '¡Victoria!' : '¡Perdisteis!'}</h2>
            {mostVoted && <div className="mt-4 bg-[#FE70C8] text-white px-4 py-2 rounded-xl inline-block border-2 border-[#0B0B0B] sticker-shadow-sm text-[10px] font-black uppercase tracking-widest">Expulsasteis a {mostVoted.name}</div>}
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-[#0B0B0B] sticker-shadow space-y-8 mb-12">
            <div><span className="text-[#5F5E5E] text-[10px] font-black uppercase tracking-widest block mb-2">Palabra secreta:</span><p className="text-4xl font-black text-[#FE70C8] tracking-tighter uppercase leading-none">{gameState.secretWord}</p></div>
            <div className="pt-8 border-t-4 border-dotted border-[#0B0B0B]/5"><span className="text-[#5F5E5E] text-[10px] font-black uppercase tracking-widest block mb-5">El traidor era:</span><div className="space-y-3">{gameState.players.filter(p => p.isImpostor).map(p => (
              <div key={p.id} className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-[#0B0B0B] text-white border-2 border-[#FE70C8]"><Skull size={24} className="text-[#FE70C8]" /><span className="font-black uppercase text-2xl">{p.name}</span></div>
            ))}</div></div>
          </div>
          <div className="space-y-4"><Button variant="neon" fullWidth onClick={startGame}><RotateCcw size={22} /><span>REVANCHA</span></Button><Button variant="secondary" fullWidth onClick={() => setGameState(prev => ({ ...prev, phase: 'HOME' }))}><span>VOLVER AL MENÚ</span></Button></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white flex flex-col shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern pointer-events-none"></div>
      <main className="flex-1 z-10 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={gameState.phase} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col overflow-hidden">
            {gameState.phase === 'HOME' && renderHome()}
            {gameState.phase === 'SETUP' && renderSetup()}
            {gameState.phase === 'REVEAL' && renderReveal()}
            {gameState.phase === 'DISCUSSION' && renderDiscussion()}
            {gameState.phase === 'VOTE' && renderVote()}
            {gameState.phase === 'RESULTS' && renderResults()}
          </motion.div>
        </AnimatePresence>
      </main>
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center opacity-10 pointer-events-none z-0"><CrestLogo className="h-10 w-10 grayscale brightness-150 border-0 opacity-50" /><span className="text-[10px] font-black tracking-[1em] text-[#0B0B0B] uppercase ml-4">CARPANETA</span></div>
      {/* Overlay de carga para acciones largas (ej. revancha / generar pista) */}
      <AnimatePresence>
        {isStarting && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-[#FE70C8]" size={36} />
              <p className="text-sm font-black text-[#0B0B0B] uppercase tracking-widest">Cargando...</p>
              <p className="text-[11px] text-[#5F5E5E] text-center max-w-xs">
                Generando la pista y preparando la siguiente partida. Esto puede tardar unos segundos.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showExitModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-sm bg-white p-8 rounded-3xl border-4 border-[#0B0B0B] sticker-shadow">
              <h3 className="text-2xl font-black text-[#0B0B0B] uppercase tracking-tighter text-center mb-4">¿SALIR DE LA PARTIDA?</h3>
              <p className="text-[#5F5E5E] text-center font-bold text-sm mb-8">Podrás retomarla más tarde desde el menú principal.</p>
              <div className="flex flex-col space-y-3">
                <Button variant="primary" fullWidth onClick={() => { setShowExitModal(false); setGameState(prev => ({ ...prev, phase: 'HOME', isTimerRunning: false })); }}>SÍ, SALIR</Button>
                <Button variant="secondary" fullWidth onClick={() => setShowExitModal(false)}>VOLVER AL JUEGO</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
