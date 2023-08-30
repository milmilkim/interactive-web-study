import Background from './Background.js';
import Wall from './Wall.js';

export default class App {
  static canvas = document.querySelector('canvas');
  /**
   * @type {CanvasRenderingContext2D}
   */
  static ctx = App.canvas.getContext('2d');
  static dpr = devicePixelRatio > 1 ? 2 : 1;
  static fps = 60;
  static interval = 1000 / App.fps;
  static width = 1024;
  static height = 768;

  constructor() {
    this.backgrounds = [
      new Background({ img: document.querySelector('#bg3-img'), speed: -1 }),
      new Background({ img: document.querySelector('#bg2-img'), speed: -2 }),
      new Background({ img: document.querySelector('#bg1-img'), speed: -4 }),
    ];
    this.walls = [new Wall({ type: 'SMALL' })];
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    App.canvas.width = App.width * App.dpr;
    App.canvas.height = App.height * App.dpr;
    App.ctx.scale(App.dpr, App.dpr);

    const width =
      innerWidth > innerHeight ? innerHeight * 0.9 : innerWidth * 0.9;

    App.canvas.style.width = width + 'px';
    App.canvas.style.height = width * (3 / 4) + 'px';
  }

  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;

      if (delta < App.interval) return;

      App.ctx.clearRect(0, 0, App.width, App.height);

      // 배경 관련
      this.backgrounds.forEach((bg) => {
        bg.update();
        bg.draw();
      });

      // 벽 관련

      for (let i = this.walls.length - 1; i >= 0; i--) {
        this.walls[i].update();
        this.walls[i].draw();

        // 벽 제거
        if (this.walls[i].isOutside) {
          this.walls.splice(i, 1);
		  continue;
        }

        // 벽 생성
        if (this.walls[i].canGenerateNext) {
          this.walls[i].generateNext = true;
          this.walls.push(
            new Wall({ type: Math.random() > 0.3 ? 'SMALL' : 'BIG' })
          );
        }
      }

      then = now - (delta % App.interval);
    };

    requestAnimationFrame(frame);
  }
}
