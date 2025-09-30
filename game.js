// ===== Cute Runner Game JS with Sounds =====

// DOM elements
const viewport = document.getElementById("viewport");
const player = document.getElementById("player");
const playerShadow = document.getElementById("player-shadow");
const ground = document.getElementById("ground");
const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");
const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");
const overlayStart = document.getElementById("overlay-start");

// ===== Sounds =====
const bgMusic = new Audio("gameback2.mp3"); // looped background
bgMusic.loop = true;
bgMusic.volume = 0.5;

const gameOverMusic = new Audio("gameover.mp3"); // 20s play
gameOverMusic.volume = 0.7;

const highScoreMusic = new Audio("gamewin.mp3"); // 15s play
highScoreMusic.volume = 0.8;

// Keep track of timers
let musicTimeout = null;

// Stop all music
function stopAllMusic() {
  [bgMusic, gameOverMusic, highScoreMusic].forEach((m) => {
    m.pause();
    m.currentTime = 0;
  });
  if (musicTimeout) clearTimeout(musicTimeout);
}

// Start background loop
function playBgMusic() {
  stopAllMusic();
  bgMusic.play().catch(() => {});
}

// Play game over theme, then back to bg
function playGameOverMusic() {
  stopAllMusic();
  gameOverMusic.play().catch(() => {});
  musicTimeout = setTimeout(() => {
    playBgMusic();
  }, 20000);
}

// Play high score theme, then back to bg
function playHighScoreMusic() {
  stopAllMusic();
  highScoreMusic.play().catch(() => {});
  musicTimeout = setTimeout(() => {
    playBgMusic();
  }, 15000);
}

// ===== Popup for milestones =====
const popup = document.createElement("div");
popup.style.position = "fixed";
popup.style.top = "50%";
popup.style.left = "50%";
popup.style.transform = "translate(-50%, -50%)";
popup.style.padding = "20px 30px";
popup.style.background = "#fff0f7";
popup.style.border = "3px solid #ff69b4";
popup.style.borderRadius = "16px";
popup.style.textAlign = "center";
popup.style.fontWeight = "700";
popup.style.color = "#c63a6f";
popup.style.fontSize = "20px";
popup.style.boxShadow = "0 6px 24px rgba(36,48,72,0.15)";
popup.style.display = "none";
document.body.appendChild(popup);

// ===== Confetti canvas =====
const confettiCanvas = document.createElement("canvas");
confettiCanvas.style.position = "fixed";
confettiCanvas.style.top = 0;
confettiCanvas.style.left = 0;
confettiCanvas.style.pointerEvents = "none";
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
document.body.appendChild(confettiCanvas);
const ctx = confettiCanvas.getContext("2d");

// Game state
let isRunning = false;
let isJumping = false;
let isDucking = false;
let gameOver = false;

let playerY = 0;
let velocityY = 0;
let gravity = -0.9;
let jumpStrength = 16;

let obstacles = [];
let clouds = [];

let lastTime = null;
let speed = 6;
let spawnRate = 1200; // ms
let lastObstacle = 0;
let score = 0;
let highScore = 0;

// ===== Utility =====
function rectsCollide(r1, r2) {
  return !(
    r1.x + r1.w < r2.x ||
    r1.x > r2.x + r2.w ||
    r1.y + r1.h < r2.y ||
    r1.y > r2.y + r2.h
  );
}

// ===== Player actions =====
function jump() {
  if (!isJumping && isRunning) {
    isJumping = true;
    velocityY = jumpStrength;
    spawnCandyTrail(); // 🍬 add candy trail effect
  }
}

function duck(state) {
  isDucking = state;
  player.style.transform = state
    ? "scaleY(0.6) translateY(20px)"
    : `translateY(${-playerY}px)`;
}

// ===== Obstacles =====
function makeObstacle() {
  const el = document.createElement("div");
  el.className = "obstacle" + (Math.random() < 0.5 ? " small" : "");
  ground.appendChild(el);

  const w = 50;
  const h = 60;
  const x = viewport.clientWidth + 20;

  obstacles.push({ el, x, w, h });
  el.style.left = x + "px";
}

// ===== Clouds =====
function makeCloud(x, top, scale) {
  const el = document.createElement("div");
  el.className = "cloud";
  el.style.top = top + "px";
  el.style.transform = `scale(${scale})`;
  ground.appendChild(el);

  clouds.push({ el, x });
  el.style.left = x + "px";
}

// ===== Candy Trail =====
function spawnCandyTrail() {
  let count = 6;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const candy = document.createElement("div");
      candy.className = "candy";
      candy.style.left =
        player.offsetLeft + 20 + Math.random() * 30 - 15 + "px";
      candy.style.top =
        player.offsetTop + 20 + Math.random() * 30 - 15 + "px";
      viewport.appendChild(candy);
      setTimeout(() => candy.remove(), 800);
    }, i * 60);
  }
}

// ===== Confetti =====
let confettiParticles = [];
function triggerConfetti() {
  confettiParticles = [];
  for (let i = 0; i < 150; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360},100%,70%)`,
      tilt: Math.random() * 10 - 10,
    });
  }
  requestAnimationFrame(drawConfetti);
}
function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach((p) => {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.r, p.r * 2);
    ctx.fill();
  });
  confettiParticles.forEach((p) => {
    p.y += p.d * 0.3;
    p.x += Math.sin(p.y * 0.05) * 2;
  });
  if (confettiParticles.some((p) => p.y < confettiCanvas.height)) {
    requestAnimationFrame(drawConfetti);
  }
}

// ===== Popup milestone =====
function showMilestonePopup(points) {
  highScore = points;
  popup.textContent = `🎉 Congratulations! 🎉\nYou reached ${points} points!`;
  popup.style.display = "block";
  triggerConfetti();
  playHighScoreMusic(); // 🔊 play milestone music
  setTimeout(() => {
    popup.style.display = "none";
  }, 2500);
}

// ===== Game Loop =====
function loop(timestamp) {
  if (!isRunning) return;
  if (!lastTime) lastTime = timestamp;
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  // Gravity / jump
  velocityY += gravity;
  playerY += velocityY;
  if (playerY <= 0) {
    playerY = 0;
    velocityY = 0;
    isJumping = false;
  }

  player.style.transform = isDucking
    ? "scaleY(0.6) translateY(20px)"
    : `translateY(${-playerY}px)`;

  playerShadow.style.opacity = Math.max(0.3, 1 - playerY / 100);
  playerShadow.style.transform = `scale(${1 - playerY / 260})`;

  // Spawn obstacles
  if (timestamp - lastObstacle > spawnRate) {
    makeObstacle();
    lastObstacle = timestamp;
  }

  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.x -= speed * (dt / 16.67);

    if (o.x + o.w < -40) {
      o.el.remove();
      obstacles.splice(i, 1);
      score++;
      scoreEl.textContent = score;

      if (score % 10 === 0) {
        showMilestonePopup(score);
        speed += 0.7;
        spawnRate = Math.max(600, spawnRate - 50);
      }
      continue;
    }
    o.el.style.left = o.x + "px";

    const playerBox = player.getBoundingClientRect();
    const obstacleBox = o.el.getBoundingClientRect();
    const shrink = 10;
    const playerRect = {
      x: playerBox.left + shrink,
      y: playerBox.top + shrink,
      w: playerBox.width - shrink * 2,
      h: playerBox.height - shrink * 2,
    };
    const obstacleRect = {
      x: obstacleBox.left + shrink,
      y: obstacleBox.top + shrink,
      w: obstacleBox.width - shrink * 2,
      h: obstacleBox.height - shrink * 2,
    };
    if (rectsCollide(playerRect, obstacleRect)) {
      if (!(isDucking && obstacleBox.height <= 40)) {
        endGame();
        return;
      }
    }
  }

  // Update clouds
  for (let i = clouds.length - 1; i >= 0; i--) {
    const c = clouds[i];
    c.x -= (speed / 4) * (dt / 16.67);
    if (c.x + 200 < -100) {
      c.el.remove();
      clouds.splice(i, 1);
      continue;
    }
    c.el.style.left = c.x + "px";
  }

  // Occasionally spawn new clouds at random heights
  if (Math.random() < 0.003) {
    makeCloud(
      viewport.clientWidth + 100,
      20 + Math.random() * 120, // ⬆️ random top value
      0.8 + Math.random() * 0.6
    );
  }

  requestAnimationFrame(loop);
}

// ===== Game Control =====
function startGame() {
  overlay.classList.add("hidden");
  isRunning = true;
  gameOver = false;
  lastTime = null;
  playBgMusic();
  requestAnimationFrame(loop);
}

function resetGame() {
  obstacles.forEach((o) => o.el.remove());
  clouds.forEach((c) => c.el.remove());
  obstacles = [];
  clouds = [];

  playerY = 0;
  velocityY = 0;
  score = 0;
  scoreEl.textContent = score;
  speed = 6;
  spawnRate = 1200;

  makeCloud(120, 40, 1.1);
  makeCloud(360, 30, 1.0);
  makeCloud(640, 56, 0.8);
}

function endGame() {
  isRunning = false;
  gameOver = true;
  overlay.querySelector(".card h2").textContent = "Game Over!";
  overlay.querySelector(".card p").textContent = "Press SPACE or tap to restart.";
  overlay.classList.remove("hidden");
  playGameOverMusic();
}

// ===== Controls =====
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    if (!isRunning) {
      resetGame();
      startGame();
    } else {
      jump();
    }
  } else if (e.code === "ArrowDown") {
    e.preventDefault();
    duck(true);
  }
});
window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown") duck(false);
});

viewport.addEventListener("pointerdown", () => {
  if (!isRunning) {
    resetGame();
    startGame();
  } else {
    jump();
  }
});

// ===== Buttons =====
btnStart.addEventListener("click", () => {
  resetGame();
  startGame();
});
btnRestart.addEventListener("click", () => {
  resetGame();
  startGame();
});
overlayStart.addEventListener("click", () => {
  resetGame();
  startGame();
});

// ===== Init =====
function init() {
  resetGame();
}
init();
setTimeout(() => {
  viewport.focus();
}, 600);
