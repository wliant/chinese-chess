import { create } from 'zustand';
import { ChineseChessEngine } from '../engine/ChineseChess';
import type { Position, Player } from '../engine/ChineseChess';
import { ChineseChessAI } from '../engine/ChineseChessAI';

interface GameState {
  engine: ChineseChessEngine;
  selectedPiece: Position | null;
  validMoves: Position[];
  gameId: string | null;
  playerColor: Player | null;
  version: number; // Version counter to force re-renders
  aiEnabled: boolean;

  selectPiece: (x: number, y: number) => void;
  movePiece: (to: Position) => void;
  resetGame: () => void;
  setGameId: (id: string) => void;
  setPlayerColor: (color: Player | null) => void;
  setAiEnabled: (enabled: boolean) => void;
}

const ai = new ChineseChessAI();

export const useGameStore = create<GameState>((set, get) => ({
  engine: new ChineseChessEngine(),
  selectedPiece: null,
  validMoves: [],
  gameId: null,
  playerColor: null,
  version: 0,
  aiEnabled: false,

  selectPiece: (x: number, y: number) => {
    const { engine, playerColor } = get();
    const piece = engine.getPiece(x, y);

    // If no player color is set (local game), allow both players
    // If player color is set, only allow selecting own pieces
    if (piece && (playerColor === null || piece.player === playerColor)) {
      if (piece.player === engine.currentPlayer) {
        const validMoves = engine.getValidMoves(x, y);
        set({ selectedPiece: { x, y }, validMoves });
      }
    } else {
      set({ selectedPiece: null, validMoves: [] });
    }
  },

  movePiece: (to: Position) => {
    const { engine, selectedPiece, version, aiEnabled } = get();

    if (!selectedPiece) return;

    const success = engine.makeMove(selectedPiece, to);

    if (success) {
      // Increment version to force re-render
      set({
        selectedPiece: null,
        validMoves: [],
        version: version + 1,
      });

      if (aiEnabled && !engine.isGameOver().over && engine.currentPlayer === 'black') {
        setTimeout(() => {
          const { engine: currentEngine } = get();
          const aiMove = ai.findBestMove(currentEngine, 'black');
          if (aiMove) {
            const moved = currentEngine.makeMove(aiMove.from, aiMove.to);
            if (moved) {
              set({ engine: currentEngine });
            }
          }
        }, 150);
      }
    }
  },

  resetGame: () => {
    set({
      engine: new ChineseChessEngine(),
      selectedPiece: null,
      validMoves: [],
      version: 0,
    });
  },

  setGameId: (id: string) => {
    set({ gameId: id });
  },

  setPlayerColor: (color: Player | null) => {
    set({ playerColor: color });
  },

  setAiEnabled: (enabled: boolean) => {
    set({ aiEnabled: enabled });
  },
}));
