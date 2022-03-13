const canvas = document.getElementById("canvas");
const gameOver = document.getElementById("game_over");
const currentScore = document.getElementById("score");
const bestScore = document.getElementById("best_score");

const ROWS = 45;
const COLS = 75;
const PIXEL = 15;

let score = 0;
const pixels = new Map();
let gameInterval = null;

const moveRight = ([top, left]) => [top, left + 1];
const moveLeft = ([top, left]) => [top, left - 1];
const moveUp = ([top, left]) => [top - 1, left];
const moveDown = ([top, left]) => [top + 1, left];

let currentSnake;
let currentSnakeKeys;
let currentVacantKeys;
let currentFoodKey;
let currentDirection;
let directionQueue;
