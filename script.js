const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const size = 600;

let snake, direction, food, score, level, game, speed;
let obstacles = [];

// START
function startGame() {
  snake = [{ x: 300, y: 300 }];
  direction = "RIGHT";
  food = spawnFood();
  score = 0;
  level = 1;
  obstacles = generateMap(level);

  speed = parseInt(document.getElementById("difficulty").value);

  clearInterval(game);
  game = setInterval(draw, speed);

  document.addEventListener("keydown", changeDirection);
}

// FOOD
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (size / box)) * box,
    y: Math.floor(Math.random() * (size / box)) * box
  };
}

// MAP (ADA CELAH)
function generateMap(level) {
  let obs = [];

  // LEVEL 2: vertical wall + gap
  if (level === 2) {
    let gap = Math.floor(Math.random() * 20) * box;
    for (let i = 0; i < size; i += box) {
      if (i !== gap) obs.push({ x: 300, y: i });
    }
  }

  // LEVEL 3: horizontal wall + gap
  if (level === 3) {
    let gap = Math.floor(Math.random() * 20) * box;
    for (let i = 0; i < size; i += box) {
      if (i !== gap) obs.push({ x: i, y: 300 });
    }
  }

  // LEVEL 4+: double wall (cross) with gaps
  if (level >= 4) {
    let gap1 = Math.floor(Math.random() * 20) * box;
    let gap2 = Math.floor(Math.random() * 20) * box;

    for (let i = 0; i < size; i += box) {
      if (i !== gap1) obs.push({ x: 300, y: i });
      if (i !== gap2) obs.push({ x: i, y: 300 });
    }
  }

  return obs;
}

// DRAW
function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size, size);

  // obstacles
  ctx.fillStyle = "gray";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, box, box));

  // snake
  snake.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(seg.x, seg.y, box, box);

    // mata
    if (i === 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(seg.x + 5, seg.y + 5, 3, 3);
      ctx.fillRect(seg.x + 12, seg.y + 5, 3, 3);
    }
  });

  // food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // eat
  if (headX === food.x && headY === food.y) {
    score++;
    food = spawnFood();

    if (score % 10 === 0 && level < 10) {
      level++;
      obstacles = generateMap(level);

      speed -= 5;
      clearInterval(game);
      game = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // collision
  if (
    headX < 0 || headY < 0 ||
    headX >= size || headY >= size ||
    collision(newHead, snake) ||
    collision(newHead, obstacles)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
  }

  snake.unshift(newHead);

  document.getElementById("info").innerText =
    "Level: " + level + " | Score: " + score;
}

// collision
function collision(head, arr) {
  return arr.some(o => o.x === head.x && o.y === head.y);
}

// control
function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}
