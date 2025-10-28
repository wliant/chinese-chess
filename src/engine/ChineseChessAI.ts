import type { Move, Player } from './ChineseChess';
import { ChineseChessEngine } from './ChineseChess';

const PIECE_VALUES = {
  general: 10000,
  advisor: 110,
  elephant: 110,
  horse: 300,
  chariot: 600,
  cannon: 350,
  soldier: 70
} as const;

const MOBILITY_BONUS = 5;

export class ChineseChessAI {
  private maxDepth: number;

  constructor(maxDepth = 4) {
    this.maxDepth = maxDepth;
  }

  findBestMove(engine: ChineseChessEngine, player: Player): Move | null {
    let bestMove: Move | null = null;
    const originalCurrentPlayer = engine.currentPlayer;

    // Ensure engine's current player aligns with the searching side
    engine.currentPlayer = player;

    for (let depth = 1; depth <= this.maxDepth; depth++) {
      const { move } = this.searchDepth(engine, player, depth);
      if (move) {
        bestMove = move;
      }
    }

    engine.currentPlayer = originalCurrentPlayer;
    return bestMove;
  }

  private searchDepth(engine: ChineseChessEngine, player: Player, depth: number): { move: Move | null; score: number } {
    const moves = engine.getAllMovesForPlayer(player);

    if (moves.length === 0) {
      return { move: null, score: this.evaluateForPlayer(engine, player) };
    }

    let bestMove: Move | null = null;
    let bestScore = player === 'red' ? -Infinity : Infinity;

    for (const move of moves) {
      if (!engine.makeMove(move.from, move.to)) continue;

      const score = this.minimax(
        engine,
        depth - 1,
        -Infinity,
        Infinity,
        this.togglePlayer(player),
        player
      );

      engine.undoLastMove();

      if (player === 'red') {
        if (score > bestScore || bestMove === null) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        if (score < bestScore || bestMove === null) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    return { move: bestMove, score: bestScore };
  }

  private minimax(
    engine: ChineseChessEngine,
    depth: number,
    alpha: number,
    beta: number,
    currentPlayer: Player,
    aiPlayer: Player
  ): number {
    const gameStatus = engine.isGameOver();
    if (depth === 0 || gameStatus.over) {
      return this.evaluateForPlayer(engine, aiPlayer);
    }

    const moves = engine.getAllMovesForPlayer(currentPlayer);
    if (moves.length === 0) {
      return this.evaluateForPlayer(engine, aiPlayer);
    }

    if (currentPlayer === aiPlayer) {
      let value = -Infinity;
      for (const move of moves) {
        if (!engine.makeMove(move.from, move.to)) continue;
        value = Math.max(value, this.minimax(engine, depth - 1, alpha, beta, this.togglePlayer(currentPlayer), aiPlayer));
        engine.undoLastMove();
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
      return value;
    }

    let value = Infinity;
    for (const move of moves) {
      if (!engine.makeMove(move.from, move.to)) continue;
      value = Math.min(value, this.minimax(engine, depth - 1, alpha, beta, this.togglePlayer(currentPlayer), aiPlayer));
      engine.undoLastMove();
      beta = Math.min(beta, value);
      if (beta <= alpha) break;
    }
    return value;
  }

  private evaluateForPlayer(engine: ChineseChessEngine, player: Player): number {
    const baseScore = this.evaluateBoard(engine);
    return player === 'red' ? baseScore : -baseScore;
  }

  private evaluateBoard(engine: ChineseChessEngine): number {
    let score = 0;

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = engine.board[y][x];
        if (!piece) continue;

        const pieceValue = PIECE_VALUES[piece.type];
        const mobility = engine.getValidMoves(x, y, piece.player).length * MOBILITY_BONUS;
        const totalValue = pieceValue + mobility;

        score += piece.player === 'red' ? totalValue : -totalValue;
      }
    }

    return score;
  }

  private togglePlayer(player: Player): Player {
    return player === 'red' ? 'black' : 'red';
  }
}
