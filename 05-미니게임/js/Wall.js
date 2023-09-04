import { getRandomNumBetween } from '../../utils/utils.js';
import App from './App.js';
import BoundingBox from './BoundingBox.js';

export default class Wall {
  constructor(config) {
    this.img = document.querySelector('#wall-img');
    /** @type {'BIG' | 'SMALL'} */
    this.type = config.type;

    switch (this.type) {
      case 'BIG':
        this.sizeX = 18 / 30;
        this.sx = this.img.width * (9 / 30);
        break;
      case 'SMALL':
        this.sizeX = 9 / 30;
        this.sx = this.img.width * (0 / 30);
        break;
    }

    this.width = App.height * this.sizeX;
    this.height = App.height;

    this.gapY = getRandomNumBetween(App.height * 0.3, App.height * 0.35);

	// 스크롤 속도
	this.vx = -6;
	

    this.x = App.width;
    // -this.height 최소값
    // App.height - this.gapY - this.height 최대값
    this.y1 =
      -this.height + getRandomNumBetween(30, App.height - this.gapY - 30);
    this.y2 = this.y1 + this.height + this.gapY - 30;

    this.generateNext = false;
    this.gapNextX = App.width * getRandomNumBetween(0.6, 0.75);

    this.boundingBox1 = new BoundingBox(
      this.x + 30,
      this.y1 - 30,
      this.width - 60,
      this.height
    );

    this.boundingBox2 = new BoundingBox(
      this.x + 30,
      this.y2 + 30,
      this.width - 60,
      this.height
    );
  }

  get isOutside() {
    return this.x + this.width < 0;
  }

  get canGenerateNext() {
    return !this.generateNext && this.x + this.width < this.gapNextX;
  }

  isColliding(target) {
    return (
      this.boundingBox1.isColliding(target) ||
      this.boundingBox2.isColliding(target)
    );
  }

  update() {
    this.x += this.vx;
    this.boundingBox1.x = this.boundingBox2.x = this.x + 30;
  }

  draw() {
    App.ctx.drawImage(
      this.img,
      this.sx,
      0,
      this.img.width * this.sizeX,
      this.img.height,
      this.x,
      this.y1,
      this.width,
      this.height
    );

    App.ctx.drawImage(
      this.img,
      this.sx,
      0,
      this.img.width * this.sizeX,
      this.img.height,
      this.x,
      this.y2,
      this.width,
      this.height
    );

    // this.boundingBox1.draw();
    // this.boundingBox2.draw();
  }
}
