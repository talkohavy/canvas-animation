import { MoonStar } from '../MoonStar';
import { drawStaticMountainRange } from './drawStaticMountainRange';

function drawBackgroundScene({ ctx, animationSettings, canvasWidth, canvasHeight }) {
  const backgroundStarsArr = [];

  // B: Create Background Stars
  for (let i = 0; i < animationSettings.background.starsCount; i++) {
    const radius = 1 + Math.random() * 3;
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
    backgroundStarsArr.push(
      new MoonStar({
        ctx,
        animationSettings,
        boundingBox: { width: canvasWidth, height: canvasHeight - animationSettings.background.groundHeight },
        x,
        y,
        radius,
      }),
    );
  }

  // A: Constant background gradient
  const backGroundGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  backGroundGradient.addColorStop(0, '#171E26');
  backGroundGradient.addColorStop(1, '#3f586b');

  ctx.fillStyle = backGroundGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Step 2: Draw Background Stars
  for (const backgroundStar of backgroundStarsArr) {
    backgroundStar.draw();
  }

  // Step 3: Draw Mountains
  drawStaticMountainRange({
    numOfMountains: 1,
    mountainHeight: canvasHeight - 100,
    ctx,
    yOfGround: canvasHeight - 100,
    canvasWidth,
    color: '#384551',
  });
  drawStaticMountainRange({
    numOfMountains: 2,
    mountainHeight: canvasHeight - 100,
    ctx,
    yOfGround: canvasHeight - 100,
    canvasWidth,
    color: '#2B3843',
  });
  drawStaticMountainRange({
    numOfMountains: 3,
    mountainHeight: canvasHeight - 300,
    ctx,
    yOfGround: canvasHeight - 100,
    canvasWidth,
    color: '#26333E',
  });

  // Step 4: Draw Floor
  ctx.fillStyle = '#182028';
  ctx.fillRect(
    0,
    canvasHeight - animationSettings.background.groundHeight,
    canvasWidth,
    animationSettings.background.groundHeight,
  );
}

export { drawBackgroundScene };
