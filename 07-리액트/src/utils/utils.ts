interface Vector {
  x: number;
  y: number;
}

export const getDistance = (p1: Vector, p2: Vector) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
};

export const getAngle = (p1: Vector, p2: Vector) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.atan2(dy, dx);
};

export const getScrupedPercent = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const pixels = ctx.getImageData(0, 0, width, height);
  const gap = 32; // 8개 픽셀당 한번

  const total = pixels.data.length / gap;

  let count = 0;

  for (let i = 0; i < pixels.data.length - 3; i += gap) {
    if (pixels.data[i + 3] === 0) count++;
  }

  return Math.round((count / total) * 100);
};

export const drawImageCenter = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) => {
  const cw = canvas.width;
  const ch = canvas.height;

  const iw = image.width;
  const ih = image.height;

  const ir = ih / iw;
  const cr = ch / cw;

  let sw: number, sh: number;

  if (ir >= cr) {
    sw = iw;
    sh = sw * (ch / cw);
  } else {
    sh = ih;
    sw = sh * (cw / ch);
  }
  const sx = iw / 2 - sw / 2;
  const sy = ih / 2 - sh / 2;

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch);
};
