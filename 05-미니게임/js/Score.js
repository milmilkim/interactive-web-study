import App from './App.js';
import Coin from './Coin.js';

export default class Score {
  constructor() {
    this.coin = new Coin(App.width - 50, 50, 0);
	this.coin.frameX = 9;

	this.distCount = 0;
	this.coinCount = 0;
  }

  update() {
	this.distCount += 0.015;
  }

  draw() {
    this.coin.draw();

	App.ctx.font = "55px 'Press Start 2P'";
	App.ctx.textAlign = 'right';
	App.ctx.fillText(this.coinCount, App.width - 100, 81)
	App.ctx.fillStyle = '#f1f1f1';

	App.ctx.textAlign = 'left';
	App.ctx.fillText( Math.floor(this.distCount) + 'm', 25, 81);
  }
}
