var canvas = document.querySelector('#main-canvas');
var ctx = canvas.getContext('2d');
var interval = 1000 / 30;
var now = new Date();
var appWidth = innerWidth;
var appHeight = innerHeight;
canvas.width = appWidth;
canvas.height = appHeight;
canvas.style.width = appWidth + 'px';
canvas.style.height = appHeight + 'px';
var render = function () {
    var now, delta;
    var then = Date.now();
    var x = 10;
    var y = 10;
    var xv = 0.8;
    var acc = 1.05;
    var frame = function () {
        requestAnimationFrame(frame);
        now = Date.now();
        delta = now - then;
        xv = xv * acc;
        x += xv;
        if (delta < interval)
            return;
        ctx.clearRect(0, 0, appWidth, appHeight);
        ctx.fillRect(x, y, 100, 100);
    };
    requestAnimationFrame(frame);
};
render();
