import { useCallback, useEffect, useRef, useState } from 'react';
import { BOARD_WIDTH } from './tetrisTypes';
import type { Board, Tetrimino, Point } from './tetrisTypes';
import { createEmptyBoard, randomTetrimino, checkCollision, mergePiece, clearLines } from './tetrisUtils';

export type GameState = 'playing' | 'paused' | 'gameover';

function getRandomTetrimino(): Tetrimino {
  return randomTetrimino();
}

function getInitialPosition(shape: number[][]): Point {
  return {
    x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
    y: 0,
  };
}

export function useTetrisGame() {
  // Estado principal
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [current, setCurrent] = useState<{ tetrimino: Tetrimino; rotation: number; pos: Point } | null>(null);
  const [next, setNext] = useState<Tetrimino>(getRandomTetrimino());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('tetris_best_score')) || 0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [lines, setLines] = useState(0);

  // Intervalo de caída
  const dropInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const dropSpeed = 500; // ms

  // Inicializar nueva pieza
  const spawnPiece = useCallback((tetrimino: Tetrimino) => {
    setCurrent({ tetrimino, rotation: 0, pos: getInitialPosition(tetrimino.shape[0]) });
  }, []);

  // Iniciar/reiniciar juego
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    const first = getRandomTetrimino();
    setCurrent({ tetrimino: first, rotation: 0, pos: getInitialPosition(first.shape[0]) });
    setNext(getRandomTetrimino());
    setScore(0);
    setLines(0);
    setGameState('playing');
  }, []);

  // Pausar/reanudar
  const togglePause = useCallback(() => {
    setGameState((prev) => (prev === 'paused' ? 'playing' : 'paused'));
  }, []);

  // Movimiento y rotación
  const move = useCallback((dx: number, dy: number) => {
    if (!current || gameState !== 'playing') return;
    const { tetrimino, rotation, pos } = current;
    const shape = tetrimino.shape[rotation % tetrimino.shape.length];
    const newPos = { x: pos.x + dx, y: pos.y + dy };
    if (!checkCollision(board, shape, newPos)) {
      setCurrent({ tetrimino, rotation, pos: newPos });
    }
  }, [board, current, gameState]);

  const rotate = useCallback(() => {
    if (!current || gameState !== 'playing') return;
    const { tetrimino, rotation, pos } = current;
    const nextRotation = (rotation + 1) % tetrimino.shape.length;
    const shape = tetrimino.shape[nextRotation];
    if (!checkCollision(board, shape, pos)) {
      setCurrent({ tetrimino, rotation: nextRotation, pos });
    }
  }, [board, current, gameState]);

  // Caída automática y fijado de pieza
  const drop = useCallback(() => {
    if (!current || gameState !== 'playing') return;
    const { tetrimino, rotation, pos } = current;
    const shape = tetrimino.shape[rotation % tetrimino.shape.length];
    const newPos = { x: pos.x, y: pos.y + 1 };
    if (!checkCollision(board, shape, newPos)) {
      setCurrent({ tetrimino, rotation, pos: newPos });
    } else {
      // Fijar pieza
      const merged = mergePiece(board, shape, pos, tetrimino.color);
      const { board: cleared, lines: clearedLines } = clearLines(merged);
      setBoard(cleared);
      setScore((s) => s + [0, 40, 100, 300, 1200][clearedLines] || 0);
      setLines((l) => l + clearedLines);
      // Nueva pieza
      const nextT = next;
      const startPos = getInitialPosition(nextT.shape[0]);
      if (checkCollision(cleared, nextT.shape[0], startPos)) {
        setGameState('gameover');
        if (score > bestScore) {
          setBestScore(score);
          localStorage.setItem('tetris_best_score', String(score));
        }
      } else {
        setCurrent({ tetrimino: nextT, rotation: 0, pos: startPos });
        setNext(getRandomTetrimino());
      }
    }
  }, [board, current, gameState, next, score, bestScore]);

  // Caída rápida
  const hardDrop = useCallback(() => {
    if (!current || gameState !== 'playing') return;
    let { tetrimino, rotation, pos } = current;
    const shape = tetrimino.shape[rotation % tetrimino.shape.length];
    let newY = pos.y;
    while (!checkCollision(board, shape, { x: pos.x, y: newY + 1 })) {
      newY++;
    }
    setCurrent({ tetrimino, rotation, pos: { x: pos.x, y: newY } });
    // Fijar inmediatamente
    setTimeout(drop, 0);
  }, [board, current, gameState, drop]);

  // Intervalo de caída automática
  useEffect(() => {
    if (gameState !== 'playing') {
      if (dropInterval.current) clearInterval(dropInterval.current);
      return;
    }
    dropInterval.current = setInterval(drop, dropSpeed);
    return () => {
      if (dropInterval.current) clearInterval(dropInterval.current);
    };
  }, [drop, gameState]);

  // Inicializar juego al montar
  useEffect(() => {
    startGame();
    // eslint-disable-next-line
  }, []);

  return {
    board,
    current,
    next,
    score,
    bestScore,
    gameState,
    lines,
    moveLeft: () => move(-1, 0),
    moveRight: () => move(1, 0),
    moveDown: () => move(0, 1),
    rotate,
    hardDrop,
    startGame,
    togglePause,
  };
} 