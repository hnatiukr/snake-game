const canvas = document.getElementById("canvas");
const restart = document.getElementById("restart");
const gameOver = document.getElementById("game_over");
const currentScore = document.getElementById("score");
const bestScore = document.getElementById("best_score");

const ROWS = 30;
const COLS = 50;
const PIXEL = 20;

let timeout;
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
