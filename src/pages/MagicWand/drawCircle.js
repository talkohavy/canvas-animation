/**
 * @param {{
 *   ctx: CanvasRenderingContext2D
 *   x: number,
 *   y: number,
 *   radius: number,
 *   color: string,
 *   borderColor?: string,
 *   shadowColor?: string,
 *   shadowBlur?: number
 * }} props
 */

function drawCircle(props) {
  const { ctx, x, y, radius, color, borderColor, shadowColor, shadowBlur } = props;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

  if (color) {
    ctx.fillStyle = color;
  }
  ctx.strokeStyle = borderColor;

  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;

  ctx.fill();
  ctx.restore();
}

export { drawCircle };
