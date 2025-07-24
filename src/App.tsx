import React, { useEffect, useCallback } from "react";
import styles from "./App.module.css";
import { useTetrisGame } from "./useTetrisGame";
import { BOARD_WIDTH, BOARD_HEIGHT } from "./tetrisTypes";

// Renderiza el tablero y la pieza activa
const Board = ({ board, current, blur }: any) => {
  const display = board.map((row: import('./tetrisTypes').Cell[]) => row.map((cell: import('./tetrisTypes').Cell) => ({ ...cell })));
  if (current) {
    const { tetrimino, rotation, pos } = current;
    const shape = tetrimino.shape[rotation % tetrimino.shape.length];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = pos.y + y;
          const boardX = pos.x + x;
          if (
            boardY >= 0 &&
            boardY < BOARD_HEIGHT &&
            boardX >= 0 &&
            boardX < BOARD_WIDTH
          ) {
            display[boardY][boardX] = {
              color: tetrimino.color,
              filled: true,
            };
          }
        }
      }
    }
  }
  return (
    <div
      className={styles.board}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        filter: blur ? 'blur(2.5px) grayscale(0.5)' : 'none',
        opacity: blur ? 0.7 : 1,
        transition: 'filter 0.3s, opacity 0.3s',
      }}
    >
      {display.flat().map((cell: import('./tetrisTypes').Cell, i: number) => (
        <div
          key={i}
          style={{
            width: '100%',
            height: '100%',
            background: cell.filled ? cell.color ?? undefined : 'rgba(0,0,0,0.15)',
            border: cell.filled ? '1.5px solid #fff2' : '1px solid #2228',
            boxSizing: 'border-box',
            borderRadius: cell.filled ? 4 : 0,
            transition: 'background 0.1s',
          }}
        />
      ))}
    </div>
  );
};

const Overlay = ({ show, children, color = '#181d27cc' }: { show: boolean; children: React.ReactNode; color?: string }) =>
  show ? (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        flexDirection: 'column',
        color: '#ffe600',
        fontWeight: 700,
        fontSize: '2rem',
        textShadow: '0 0 12px #ff00cc',
        letterSpacing: 2,
        animation: 'fadeIn 0.5s',
      }}
    >
      {children}
    </div>
  ) : null;

const SidePanel = ({ score, bestScore, next, lines, onRestart, onPause, gameState }: any) => (
  <aside className={styles.sidePanel}>
    <div>
      <h2>Puntuación</h2>
      <div id="score">{score}</div>
      <h3>Mejor puntuación</h3>
      <div id="bestScore">{bestScore}</div>
      <h3>Líneas</h3>
      <div>{lines}</div>
    </div>
    <div>
      <h2>Siguiente</h2>
      <div className={styles.nextPiece}>
        {next.shape[0].map((row: number[], y: number) => (
          <div key={y} style={{ display: 'flex', justifyContent: 'center' }}>
            {row.map((cell, x) => (
              <span key={x} style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                background: cell ? next.color : 'transparent',
                borderRadius: 3,
                margin: 1,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
    <button onClick={onRestart}>Reiniciar</button>
    <button onClick={onPause}>{gameState === 'paused' ? 'Reanudar' : 'Pausar'}</button>
  </aside>
);

function App() {
  const {
    board,
    current,
    next,
    score,
    bestScore,
    gameState,
    lines,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    startGame,
    togglePause,
  } = useTetrisGame();

  // Controles de teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    if (e.key === 'ArrowLeft') moveLeft();
    else if (e.key === 'ArrowRight') moveRight();
    else if (e.key === 'ArrowDown') moveDown();
    else if (e.key === 'ArrowUp') rotate();
    else if (e.key === ' ') hardDrop();
  }, [gameState, moveLeft, moveRight, moveDown, rotate, hardDrop]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={styles.container}>
      <h1 style={{ color: '#ffe600', textShadow: '0 0 12px #ff00cc', fontWeight: 700, fontSize: '2.5rem', letterSpacing: '2px' }}>TETRIS</h1>
      <div className={styles.gameArea} style={{ position: 'relative' }}>
        <Board board={board} current={current} blur={gameState !== 'playing'} />
        <Overlay show={gameState === 'paused'} color="#222b">
          <span>⏸️ PAUSA</span>
          <small style={{ color: '#fff', fontWeight: 400, fontSize: '1.1rem', marginTop: 16 }}>Pulsa "Pausar" o "Reanudar" para continuar</small>
        </Overlay>
        <Overlay show={gameState === 'gameover'} color="#181d27ee">
          <span>💀 GAME OVER</span>
          <button style={{ marginTop: 24, fontSize: '1.2rem', padding: '0.7rem 2rem', background: 'linear-gradient(90deg,#ff00cc,#ffe600)', color: '#222', fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: '0 2px 8px #0006' }} onClick={startGame}>Jugar de nuevo</button>
        </Overlay>
        <SidePanel
          score={score}
          bestScore={bestScore}
          next={next}
          lines={lines}
          onRestart={startGame}
          onPause={togglePause}
          gameState={gameState}
        />
      </div>
      <footer className={styles.footer}>
        <p>
          Usa las <b>flechas</b> para mover y rotar las piezas, <b>espacio</b> para caída rápida.<br />
          <span style={{ color: '#ff00cc' }}>Estado: {gameState === 'playing' ? 'Jugando' : gameState === 'paused' ? 'Pausado' : 'Game Over'}</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
