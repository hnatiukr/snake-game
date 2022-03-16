const canvas = document.getElementById('canvas');

const start = document.getElementById('start_button');
const restart = document.getElementById('restart_button');

const eatSound = document.getElementById('eat-sound');
const moveSound = document.getElementById('move-sound');
const startSound = document.getElementById('start-sound');
const gameOverSound = document.getElementById('game-over-sound');

const startScreen = document.getElementById('start_screen');
const gameOverScreen = document.getElementById('game_over_screen');

const scoreInGame = document.getElementById('score_in_game');
const gameOverScore = document.getElementById('game_over_score');
const gameOverBestScore = document.getElementById('game_over_best_score');

const ROWS = 30;
const COLS = 50;
const PIXEL = 20;

let timeout;
let score = 0;
let gameOver = false;
let gameInterval = null;
const pixels = new Map();

const moveUp = ([top, left]) => [top - 1, left];
const moveDown = ([top, left]) => [top + 1, left];
const moveLeft = ([top, left]) => [top, left - 1];
const moveRight = ([top, left]) => [top, left + 1];

let currentSnake;
let currentSnakeKeys;
let currentVacantKeys;
let currentFoodKey;
let currentDirection;
let directionQueue;
