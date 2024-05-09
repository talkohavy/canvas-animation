function drawStaticMountainRange({ ctx, canvasWidth, yOfGround, numOfMountains, mountainHeight, color }) {
  const mountainWidth = canvasWidth / numOfMountains;
  for (let i = 0; i < numOfMountains; i++) {
    ctx.beginPath();
    ctx.moveTo(i * mountainWidth, yOfGround);
    ctx.lineTo(i * mountainWidth + mountainWidth + 325, yOfGround);
    ctx.lineTo(i * mountainWidth + mountainWidth / 2, yOfGround - mountainHeight);
    ctx.lineTo(i * mountainWidth - 325, yOfGround);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
}

export { drawStaticMountainRange };
