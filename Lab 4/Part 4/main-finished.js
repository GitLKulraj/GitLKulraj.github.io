// Interactive Ball Animation – main-finished.js

const display = document.querySelector("p");
let ballTotal = 0;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width = window.innerWidth;
const canvasHeight = canvas.height = window.innerHeight;

// Random Value Generators
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateColor() {
  return `rgb(${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0, 255)})`;
}

// Abstract Shape Class
class MotionEntity {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
}

// Bouncing Ball Object
class BounceBall extends MotionEntity {
  constructor(x, y, dx, dy, color, radius) {
    super(x, y, dx, dy);
    this.color = color;
    this.radius = radius;
    this.isVisible = true;
  }

  show() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  move() {
    if (this.x + this.radius >= canvasWidth || this.x - this.radius <= 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius >= canvasHeight || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  detectContact() {
    for (const other of ballList) {
      if (this !== other && other.isVisible) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.radius + other.radius) {
          this.color = other.color = generateColor();
        }
      }
    }
  }
}

// User-Controlled Circle
class PlayerOrb extends MotionEntity {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "#fff";
    this.radius = 10;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a": this.x -= this.dx; break;
        case "d": this.x += this.dx; break;
        case "w": this.y -= this.dy; break;
        case "s": this.y += this.dy; break;
      }
    });
  }

  render() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  enforceBounds() {
    if (this.x + this.radius >= canvasWidth) this.x -= this.radius;
    if (this.x - this.radius <= 0) this.x += this.radius;
    if (this.y + this.radius >= canvasHeight) this.y -= this.radius;
    if (this.y - this.radius <= 0) this.y += this.radius;
  }

  absorbBalls() {
    for (const ball of ballList) {
      if (ball.isVisible) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.radius + ball.radius) {
          ball.isVisible = false;
          ballTotal--;
          display.textContent = `Ball count: ${ballTotal}`;
        }
      }
    }
  }
}

// Ball Creation
const ballList = [];

while (ballList.length < 25) {
  const radius = getRandom(10, 20);
  const ball = new BounceBall(
    getRandom(radius, canvasWidth - radius),
    getRandom(radius, canvasHeight - radius),
    getRandom(-7, 7),
    getRandom(-7, 7),
    generateColor(),
    radius
  );

  ballList.push(ball);
  ballTotal++;
  display.textContent = `Ball count: ${ballTotal}`;
}

const seeker = new PlayerOrb(getRandom(0, canvasWidth), getRandom(0, canvasHeight));

// Animation Cycle
function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  for (const ball of ballList) {
    if (ball.isVisible) {
      ball.show();
      ball.move();
      ball.detectContact();
    }
  }

  seeker.render();
  seeker.enforceBounds();
  seeker.absorbBalls();

  requestAnimationFrame(animate);
}

animate();