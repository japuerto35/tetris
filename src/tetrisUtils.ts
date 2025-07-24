import { BOARD_WIDTH, BOARD_HEIGHT, TETRIMINOS } from './tetrisTypes';
import type { Cell, Board, Tetrimino, Point } from './tetrisTypes';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ color: null, filled: false }))
  );
}

export function randomTetrimino(): Tetrimino {
  const idx = Math.floor(Math.random() * TETRIMINOS.length);
  return TETRIMINOS[idx];
}

export function checkCollision(
  board: Board,
  shape: number[][],
  pos: Point
): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = pos.y + y;
        const newX = pos.x + x;
        if (
          newY < 0 ||
          newY >= BOARD_HEIGHT ||
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          board[newY][newX].filled
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export function mergePiece(
  board: Board,
  shape: number[][],
  pos: Point,
  color: string
): Board {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = pos.y + y;
        const newX = pos.x + x;
        if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
          newBoard[newY][newX] = { color, filled: true };
        }
      }
    }
  }
  return newBoard;
}

export function clearLines(board: Board): { board: Board; lines: number } {
  const newBoard = board.filter(row => !row.every(cell => cell.filled));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => ({ color: null, filled: false })));
  }
  return { board: newBoard, lines: linesCleared };
} 