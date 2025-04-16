const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("score");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Color changes with score — more vibrant as score increases
function scoreBasedColor(score) {
  const r = (score * 25) % 255;
  const g = (score * 50) % 255;
  const b = (score * 75) % 255;
  return `rgb(${r}, ${g}, ${b})`;
}

let score = 0;
let mouse = { x: null, y: null };

class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    if (!this.exists) return;
    ctx.beginPath();
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0; 
  }

  update() {
    if (!this.exists) return;
    if ((this.x + this.size) >= canvas.width || (this.x - this.size) <= 0) {
      this.velX = -this.velX;
    }

    if ((this.y + this.size) >= canvas.height || (this.y - this.size) <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    if (!this.exists) return;
    for (const ball of balls) {
      if (this !== ball && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.color = this.color = scoreBasedColor(score); // changed
        }
      }
    }
  }

  checkHover() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.size && this.exists) {
      this.exists = false;
      score += 1;
      scoreBoard.textContent = "Score: " + score;
    }
  }
}

let balls = [];

function createBall() {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, canvas.width - size),
    random(size, canvas.height - size),
    random(-7, 7),
    random(-7, 7),
    scoreBasedColor(score), // dynamic color
    size
  );
  balls.push(ball);
}

for (let i = 0; i < 20; i++) {
  createBall();
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
    ball.checkHover(); // Hover instead of click
  }

  requestAnimationFrame(loop);
}
loop();

document.getElementById("addBall").addEventListener("click", () => {
  for (let i = 0; i < 5; i++) {
    createBall();
  }
});

canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});


