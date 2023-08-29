const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// canvas 기본 300 * 150

let canvasWidth;
let canvasHeight;

const getRandomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

let particles;
// dpr
const dpr = window.devicePixelRatio;

let interval = 1000 / 60; // 60프레임
let now, delta;
let then = Date.now();

const init = () => {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;

  ctx.scale(dpr, dpr);

  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';

  particles = [];
  const TOTAL = canvasWidth / 10;

  for (let i = 0; i < TOTAL; i++) {
    const x = getRandomNumBetween(0, canvasWidth);
    const y = getRandomNumBetween(0, canvasHeight);
    const radius = getRandomNumBetween(50, 100);
    const vy = getRandomNumBetween(1, 5);
    const particle = new Particle(x, y, radius, vy);
    particles.push(particle);
  }
};

const feGaussianBlur = document.querySelector('feGaussianBlur');
const feColorMatrix = document.querySelector('feColorMatrix');

const controls = new (function () {
  this.blurValue = 40;
  this.alphaChannel = 100;
  this.alphaOffset = -23;
  this.acc = 1.03;
})();

let gui = new dat.GUI();

const f1 = gui.addFolder('Gooey Effect');
f1.open();

f1.add(controls, 'blurValue', 0, 100).onChange((value) => {
  feGaussianBlur.setAttribute('stdDeviation', value);
});

f1.add(controls, 'alphaChannel', 1, 200).onChange((value) => {
  feColorMatrix.setAttribute(
    'values',
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`
  );
});

f1.add(controls, 'alphaOffset', -40, 40).onChange((value) => {
  feColorMatrix.setAttribute(
    'values',
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`
  );
});

const f2 = gui.addFolder('acc');
f2.open();

f2.add(controls, 'acc', 1, 1.5, 0.01).onChange((value) => {
  particles.forEach((particle) => (particle.acc = value));
});

class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy;
    this.acc = 1.02;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    // 라디안 -> Math.Pi / 180 이 1도
    ctx.fillStyle = 'orange';
    ctx.fill();
    // ctx.stroke();
    ctx.closePath();
  }

  update() {
    this.vy *= this.acc;
    this.y += this.vy;
  }
}

// 파티클 생성
const x = 100;
const y = 100;
const radius = 50;
const particle = new Particle(x, y, radius);

const animate = () => {
  window.requestAnimationFrame(animate);

  now = Date.now();
  delta = now - then;

  if (delta < interval) return;

  // 프레임마다 지움
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius;
      particle.x = getRandomNumBetween(0, canvasWidth);
      particle.radius = getRandomNumBetween(50, 100);
      particle.vy = getRandomNumBetween(1, 5);
    }
  });

  then = now - (delta % interval);
};

window.addEventListener('load', () => {
  init();
  animate();
});

window.addEventListener('resize', () => {
  init();
});
