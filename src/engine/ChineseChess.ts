export type PieceType = 'general' | 'advisor' | 'elephant' | 'horse' | 'chariot' | 'cannon' | 'soldier';
export type Player = 'red' | 'black';

export interface Piece {
  type: PieceType;
  player: Player;
  x: number;
  y: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
}

export class ChineseChessEngine {
  board: (Piece | null)[][];
  currentPlayer: Player;
  moveHistory: Move[];
  selectedPiece: Piece | null;

  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'red';
    this.moveHistory = [];
    this.selectedPiece = null;
  }

  initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(10).fill(null).map(() => Array(9).fill(null));

    // Red pieces (bottom)
    board[0][0] = { type: 'chariot', player: 'red', x: 0, y: 0 };
    board[0][1] = { type: 'horse', player: 'red', x: 1, y: 0 };
    board[0][2] = { type: 'elephant', player: 'red', x: 2, y: 0 };
    board[0][3] = { type: 'advisor', player: 'red', x: 3, y: 0 };
    board[0][4] = { type: 'general', player: 'red', x: 4, y: 0 };
    board[0][5] = { type: 'advisor', player: 'red', x: 5, y: 0 };
    board[0][6] = { type: 'elephant', player: 'red', x: 6, y: 0 };
    board[0][7] = { type: 'horse', player: 'red', x: 7, y: 0 };
    board[0][8] = { type: 'chariot', player: 'red', x: 8, y: 0 };

    board[2][1] = { type: 'cannon', player: 'red', x: 1, y: 2 };
    board[2][7] = { type: 'cannon', player: 'red', x: 7, y: 2 };

    for (let i = 0; i < 9; i += 2) {
      board[3][i] = { type: 'soldier', player: 'red', x: i, y: 3 };
    }

    // Black pieces (top)
    board[9][0] = { type: 'chariot', player: 'black', x: 0, y: 9 };
    board[9][1] = { type: 'horse', player: 'black', x: 1, y: 9 };
    board[9][2] = { type: 'elephant', player: 'black', x: 2, y: 9 };
    board[9][3] = { type: 'advisor', player: 'black', x: 3, y: 9 };
    board[9][4] = { type: 'general', player: 'black', x: 4, y: 9 };
    board[9][5] = { type: 'advisor', player: 'black', x: 5, y: 9 };
    board[9][6] = { type: 'elephant', player: 'black', x: 6, y: 9 };
    board[9][7] = { type: 'horse', player: 'black', x: 7, y: 9 };
    board[9][8] = { type: 'chariot', player: 'black', x: 8, y: 9 };

    board[7][1] = { type: 'cannon', player: 'black', x: 1, y: 7 };
    board[7][7] = { type: 'cannon', player: 'black', x: 7, y: 7 };

    for (let i = 0; i < 9; i += 2) {
      board[6][i] = { type: 'soldier', player: 'black', x: i, y: 6 };
    }

    return board;
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < 9 && y >= 0 && y < 10;
  }

  isInPalace(x: number, y: number, player: Player): boolean {
    if (player === 'red') {
      return x >= 3 && x <= 5 && y >= 0 && y <= 2;
    } else {
      return x >= 3 && x <= 5 && y >= 7 && y <= 9;
    }
  }

  isValidElephantMove(from: Position, to: Position, player: Player): boolean {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);

    if (dx !== 2 || dy !== 2) return false;

    // Check river crossing
    if (player === 'red' && to.y > 4) return false;
    if (player === 'black' && to.y < 5) return false;

    // Check blocking piece
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    return this.board[midY][midX] === null;
  }

  isValidHorseMove(from: Position, to: Position): boolean {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);

    if (!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))) return false;

    // Check blocking piece
    let blockX = from.x;
    let blockY = from.y;

    if (dx === 2) {
      blockX = from.x + (to.x > from.x ? 1 : -1);
    } else {
      blockY = from.y + (to.y > from.y ? 1 : -1);
    }

    return this.board[blockY][blockX] === null;
  }

  isValidChariotMove(from: Position, to: Position): boolean {
    if (from.x !== to.x && from.y !== to.y) return false;

    const dx = to.x > from.x ? 1 : to.x < from.x ? -1 : 0;
    const dy = to.y > from.y ? 1 : to.y < from.y ? -1 : 0;

    let x = from.x + dx;
    let y = from.y + dy;

    while (x !== to.x || y !== to.y) {
      if (this.board[y][x] !== null) return false;
      x += dx;
      y += dy;
    }

    return true;
  }

  isValidCannonMove(from: Position, to: Position): boolean {
    if (from.x !== to.x && from.y !== to.y) return false;

    const dx = to.x > from.x ? 1 : to.x < from.x ? -1 : 0;
    const dy = to.y > from.y ? 1 : to.y < from.y ? -1 : 0;

    let x = from.x + dx;
    let y = from.y + dy;
    let jumpCount = 0;

    while (x !== to.x || y !== to.y) {
      if (this.board[y][x] !== null) jumpCount++;
      x += dx;
      y += dy;
    }

    const targetPiece = this.board[to.y][to.x];
    if (targetPiece === null) {
      return jumpCount === 0;
    } else {
      return jumpCount === 1;
    }
  }

  isValidSoldierMove(from: Position, to: Position, player: Player): boolean {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (player === 'red') {
      // Before crossing river
      if (from.y <= 4) {
        return dx === 0 && dy === 1;
      }
      // After crossing river
      return (dx === 0 && dy === 1) || (dy === 0 && Math.abs(dx) === 1);
    } else {
      // Before crossing river
      if (from.y >= 5) {
        return dx === 0 && dy === -1;
      }
      // After crossing river
      return (dx === 0 && dy === -1) || (dy === 0 && Math.abs(dx) === 1);
    }
  }

  isValidMove(from: Position, to: Position, player: Player = this.currentPlayer): boolean {
    if (!this.isInBounds(to.x, to.y)) return false;

    const piece = this.board[from.y][from.x];
    if (!piece || piece.player !== player) return false;

    const targetPiece = this.board[to.y][to.x];
    if (targetPiece && targetPiece.player === piece.player) return false;

    switch (piece.type) {
      case 'general': {
        const dx = Math.abs(to.x - from.x);
        const dy = Math.abs(to.y - from.y);
        return ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) &&
               this.isInPalace(to.x, to.y, piece.player);
      }

      case 'advisor':
        return Math.abs(to.x - from.x) === 1 &&
               Math.abs(to.y - from.y) === 1 &&
               this.isInPalace(to.x, to.y, piece.player);

      case 'elephant':
        return this.isValidElephantMove(from, to, piece.player);

      case 'horse':
        return this.isValidHorseMove(from, to);

      case 'chariot':
        return this.isValidChariotMove(from, to);

      case 'cannon':
        return this.isValidCannonMove(from, to);

      case 'soldier':
        return this.isValidSoldierMove(from, to, piece.player);

      default:
        return false;
    }
  }

  makeMove(from: Position, to: Position): boolean {
    if (!this.isValidMove(from, to)) return false;

    const piece = this.board[from.y][from.x];
    const captured = this.board[to.y][to.x];

    if (!piece) return false;

    // Update board
    this.board[to.y][to.x] = { ...piece, x: to.x, y: to.y };
    this.board[from.y][from.x] = null;

    // Record move
    this.moveHistory.push({
      from,
      to,
      piece: { ...piece },
      captured: captured ? { ...captured } : undefined
    });

    // Switch player
    this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';

    return true;
  }

  undoLastMove(): void {
    const lastMove = this.moveHistory.pop();
    if (!lastMove) return;

    const { from, to, piece, captured } = lastMove;

    this.board[from.y][from.x] = { ...piece, x: from.x, y: from.y };
    if (captured) {
      this.board[to.y][to.x] = { ...captured, x: captured.x, y: captured.y };
    } else {
      this.board[to.y][to.x] = null;
    }

    this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
  }

  getPiece(x: number, y: number): Piece | null {
    if (!this.isInBounds(x, y)) return null;
    return this.board[y][x];
  }

  getValidMoves(x: number, y: number, player: Player = this.currentPlayer): Position[] {
    const validMoves: Position[] = [];
    const piece = this.board[y][x];

    if (!piece || piece.player !== player) {
      return validMoves;
    }

    for (let toY = 0; toY < 10; toY++) {
      for (let toX = 0; toX < 9; toX++) {
        if (this.isValidMove({ x, y }, { x: toX, y: toY }, player)) {
          validMoves.push({ x: toX, y: toY });
        }
      }
    }

    return validMoves;
  }

  isGameOver(): { over: boolean; winner?: Player } {
    let redGeneral = false;
    let blackGeneral = false;

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = this.board[y][x];
        if (piece && piece.type === 'general') {
          if (piece.player === 'red') redGeneral = true;
          if (piece.player === 'black') blackGeneral = true;
        }
      }
    }

    if (!redGeneral) return { over: true, winner: 'black' };
    if (!blackGeneral) return { over: true, winner: 'red' };

    return { over: false };
  }

  getAllMovesForPlayer(player: Player): Move[] {
    const moves: Move[] = [];

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = this.board[y][x];
        if (piece && piece.player === player) {
          const validMoves = this.getValidMoves(x, y, player);
          for (const move of validMoves) {
            const captured = this.board[move.y][move.x];
            moves.push({
              from: { x, y },
              to: move,
              piece: { ...piece },
              captured: captured ? { ...captured } : undefined
            });
          }
        }
      }
    }

    return moves;
  }
}
