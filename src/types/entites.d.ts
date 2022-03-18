export type Key = `${number}_${number}`;

export type SetKeys = Set<Key>;

export type Coordinates = [number, number];

export type Direction = 'up' | 'down' | 'left' | 'right';

export type MoveDirection = (coordinates: Coordinates) => Coordinates;

export type Snake = Coordinates[];

export type GameScreen = 'startGame' | 'inGame' | 'gameOver';
