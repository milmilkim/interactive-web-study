const canvas: HTMLCanvasElement = document.querySelector('#main-canvas')!;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
let interval = 1000 / 30;
const now = new Date();
const appWidth = innerWidth;
const appHeight = innerHeight;

canvas.width = appWidth;
canvas.height = appHeight;
canvas.style.width = appWidth + 'px';
canvas.style.height = appHeight + 'px';

const render = () => {
  let now, delta;
  let then = Date.now();

  let x = 10;
  let y = 10;

  let xv = 0.8;
  let acc = 1.05;

  const frame = () => {
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;

    xv = xv * acc;
    x += xv;

    if (delta < interval) return;

    ctx.clearRect(0, 0, appWidth, appHeight);

    ctx.fillRect(x, y, 100, 100);
  };

  requestAnimationFrame(frame);
};

render();
