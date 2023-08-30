import { getRandomNumBetween, hexToRgb } from '../../utils/utils.js';

export default class Particle {
  constructor(x, y, deg = 0, colors, shapes, spread = 30) {
    this.angle = (Math.PI / 180) * getRandomNumBetween(deg - spread, deg + spread);
    this.r = getRandomNumBetween(30, 100);

    this.x = x * innerWidth;
    this.y = y * innerHeight;

    this.vx = this.r * Math.cos(this.angle);
    this.vy = this.r * Math.sin(this.angle);

    this.friction = 0.89;
    this.gravity = 0.5;

    this.width = 12;
    this.height = 12;

    this.opacity = 1;

    this.widthDelta = getRandomNumBetween(0, 360);
    this.heightDelta = getRandomNumBetween(0, 360);

    this.rotation = getRandomNumBetween(0, 360);
    this.rotationDelta = getRandomNumBetween(-1, 1);

    this.colors = colors || ['#FF577F', '#FF884B', '#FFD384', '#FFF9B0'];
    this.color = hexToRgb(
      this.colors[Math.floor(getRandomNumBetween(0, this.colors.length))]
    );

    this.shapes = shapes || ['circle', 'square'];
    this.shape =
      this.shapes[Math.floor(getRandomNumBetween(0, this.shapes.length))];
  }

  update() {
    this.vy += this.gravity;

    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;

    this.opacity -= 0.005;

    this.widthDelta += 2;
    this.heightDelta += 2;
    this.rotation += this.rotationDelta;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawSquare(ctx) {
    ctx.fillRect(
      this.x,
      this.y,
      this.width * Math.cos((Math.PI / 180) * this.widthDelta),
      this.height * Math.sin((Math.PI / 180) * this.heightDelta)
    );
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  drawCircle(ctx) {
    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y,
      Math.abs(this.width * Math.cos((Math.PI / 180) * this.widthDelta)) / 2,
      Math.abs(this.height * Math.sin((Math.PI / 180) * this.heightDelta)) / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
  }

  draw(ctx) {
    ctx.translate(this.x + this.width, this.y + this.height);
    ctx.rotate((Math.PI / 180) * this.rotation);
    ctx.translate(-this.x - this.width, -this.y - this.height);

    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity}`;

	console.log(this.shape)
    switch (this.shape) {
      case 'square':
        this.drawSquare(ctx);
        break;
      case 'circle':
        this.drawCircle(ctx);
        break;
    }

    ctx.resetTransform();
  }
}
