// Tipos y constantes para el juego Tetris

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type Cell = {
  color: string | null;
  filled: boolean;
};

export type Board = Cell[][];

export type Point = { x: number; y: number };

export type TetriminoShape = number[][];

export type Tetrimino = {
  shape: TetriminoShape[]; // Rotaciones
  color: string;
  name: string;
};

export const TETRIMINOS: Tetrimino[] = [
  // I
  {
    name: 'I',
    color: '#00ffe7',
    shape: [
      [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
      ],
      [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
      ],
    ],
  },
  // J
  {
    name: 'J',
    color: '#3333ff',
    shape: [
      [
        [1,0,0],
        [1,1,1],
        [0,0,0],
      ],
      [
        [0,1,1],
        [0,1,0],
        [0,1,0],
      ],
      [
        [0,0,0],
        [1,1,1],
        [0,0,1],
      ],
      [
        [0,1,0],
        [0,1,0],
        [1,1,0],
      ],
    ],
  },
  // L
  {
    name: 'L',
    color: '#ff9900',
    shape: [
      [
        [0,0,1],
        [1,1,1],
        [0,0,0],
      ],
      [
        [0,1,0],
        [0,1,0],
        [0,1,1],
      ],
      [
        [0,0,0],
        [1,1,1],
        [1,0,0],
      ],
      [
        [1,1,0],
        [0,1,0],
        [0,1,0],
      ],
    ],
  },
  // O
  {
    name: 'O',
    color: '#ffe600',
    shape: [
      [
        [1,1],
        [1,1],
      ],
    ],
  },
  // S
  {
    name: 'S',
    color: '#00ff00',
    shape: [
      [
        [0,1,1],
        [1,1,0],
        [0,0,0],
      ],
      [
        [0,1,0],
        [0,1,1],
        [0,0,1],
      ],
    ],
  },
  // T
  {
    name: 'T',
    color: '#ff00cc',
    shape: [
      [
        [0,1,0],
        [1,1,1],
        [0,0,0],
      ],
      [
        [0,1,0],
        [0,1,1],
        [0,1,0],
      ],
      [
        [0,0,0],
        [1,1,1],
        [0,1,0],
      ],
      [
        [0,1,0],
        [1,1,0],
        [0,1,0],
      ],
    ],
  },
  // Z
  {
    name: 'Z',
    color: '#ff0000',
    shape: [
      [
        [1,1,0],
        [0,1,1],
        [0,0,0],
      ],
      [
        [0,0,1],
        [0,1,1],
        [0,1,0],
      ],
    ],
  },
]; 