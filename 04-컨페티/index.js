import Particle from './js/Particle.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
const fps = 60;
const interval = 1000 / fps;

const particles = [];

const init = () => {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
};

const confetti = ({ x, y, count, deg, colors, shapes, spread }) => {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, deg, colors, shapes, spread));
  }
};

const render = () => {
  let now, delta;
  let then = Date.now();

  const frame = () => {
    requestAnimationFrame(frame);

    now = Date.now();
    delta = now - then;

    if (delta < interval) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    confetti({
      x: 0,
      y: 0.5,
      count: 5,
      deg: -50,
    });

    confetti({
      x: 1,
      y: 0.5,
      count: 5,
      deg: -130,
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      if (particles[i].opacity < 0) {
        particles.splice(i, 1);
      }
    }

    then = now - (delta % interval);
  };

  requestAnimationFrame(frame);
};

window.addEventListener('resize', () => {
  init();
});

window.addEventListener('click', () => {
  confetti({
    x: 0,
    y: 0.5,
    count: 10,
    deg: -50,
    // colors: ['#FFFFFF'],
    shapes: ['square', 'circle'],
    spread: 30,
  });
});

init();
render();
