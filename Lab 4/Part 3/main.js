// Canvas Setup
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Random number generator
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randColor = () => `rgb(${rand(0,255)}, ${rand(0,255)}, ${rand(0,255)})`;

// Bubble class generator
class Bubble {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  paint() {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }

  move() {
    if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
      this.dx *= -1;
    }
    if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
      this.dy *= -1;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  bounceCheck(bubbles) {
    for (const other of bubbles) {
      if (this !== other) {
        const xDist = this.x - other.x;
        const yDist = this.y - other.y;
        const separation = Math.hypot(xDist, yDist);

        if (separation < this.radius + other.radius) {
          this.color = other.color = randColor();
        }
      }
    }
  }
}

// Create Group of Bubbles
const bubbles = [];

for (let i = 0; i < 25; i++) {
  const r = rand(10, 20);
  const x = rand(r, canvas.width - r);
  const y = rand(r, canvas.height - r);
  const dx = rand(-7, 7);
  const dy = rand(-7, 7);
  const color = randColor();

  bubbles.push(new Bubble(x, y, dx, dy, r, color));
}

// Initiates the animation
function animate() {
  context.fillStyle = 'rgba(0,0,0,0.25)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  bubbles.forEach(b => {
    b.paint();
    b.move();
    b.bounceCheck(bubbles);
  });

  requestAnimationFrame(animate);
}

animate();