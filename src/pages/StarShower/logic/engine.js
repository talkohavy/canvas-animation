import { drawStaticMountainRange } from './helpers/drawStaticMountainRange';
import { getAnimationSettings } from './helpers/getAnimationSettings';
import { MiniStar } from './MiniStar';
import { MoonStar, createRandomMoonStar } from './MoonStar';

export function engine(mainCanvas, bgCanvas, mainSize) {
  // ---------------
  // Canvas Layer 1:
  // ---------------
  const ctx = mainCanvas.getContext('2d');
  mainCanvas.height = mainSize.height;
  mainCanvas.width = mainSize.width;
  const { width } = mainSize;
  const { height } = mainSize;

  // ---------------
  // Canvas Layer 2:
  // ---------------
  const bgCtx = bgCanvas.getContext('2d');
  bgCanvas.height = mainSize.height;
  bgCanvas.width = mainSize.width;

  const animationSettings = getAnimationSettings({ canvasWidth: width });

  let ticker = 1;
  const starsArr = [];
  const miniStarsArr = [];
  const backgroundStarsArr = [];

  // A: Constant background gradient
  const backGroundGradient = ctx.createLinearGradient(0, 0, 0, height);
  backGroundGradient.addColorStop(0, '#171E26');
  backGroundGradient.addColorStop(1, '#3f586b');

  // B: Create Background Stars
  for (let i = 0; i < animationSettings.background.starsCount; i++) {
    const radius = 1 + Math.random() * 5;
    const x = Math.random() * width;
    const y = Math.random() * height;
    backgroundStarsArr.push(
      new MoonStar({
        ctx,
        animationSettings,
        x,
        y,
        radius,
        boundingBox: { width, height: height - animationSettings.background.groundHeight },
      }),
    );
  }

  // C: Create Shooting Stars
  for (let i = 0; i < animationSettings.general.initialMoonStarsCount; i++) {
    const moonStar = createRandomMoonStar({
      ctx,
      animationSettings,
      boundingBox: { width, height: height - animationSettings.background.groundHeight },
      onExplode: (miniStarProps) => miniStarsArr.push(new MiniStar(miniStarProps)),
    });

    starsArr.push(moonStar);
  }

  // 666666666666666666666666666666666666666666666666666
  // -----    Phase 6: Draw Fixed Background     -------

  // Step 1: Paint Fixed Gradient Background
  bgCtx.fillStyle = backGroundGradient;
  bgCtx.fillRect(0, 0, width, height);

  // Step 2: Draw Background Stars
  for (let i = 0; i < backgroundStarsArr.length; i++) {
    backgroundStarsArr[i].draw();
  }

  // Step 3: Draw Mountains
  drawStaticMountainRange({
    numOfMountains: 1,
    mountainHeight: height - 100,
    ctx: bgCtx,
    yOfGround: height - 100,
    canvasWidth: width,
    color: '#384551',
  });
  drawStaticMountainRange({
    numOfMountains: 2,
    mountainHeight: height - 100,
    ctx: bgCtx,
    yOfGround: height - 100,
    canvasWidth: width,
    color: '#2B3843',
  });
  drawStaticMountainRange({
    numOfMountains: 3,
    mountainHeight: height - 300,
    ctx: bgCtx,
    yOfGround: height - 100,
    canvasWidth: width,
    color: '#26333E',
  });

  // Step 4: Draw Floor
  bgCtx.fillStyle = '#182028';
  bgCtx.fillRect(
    0,
    height - animationSettings.background.groundHeight,
    width,
    animationSettings.background.groundHeight,
  );

  // 777777777777777777777777777777777777777777777777777
  // -----     Phase 7: Start Animation Loop     -------
  function animate() {
    // Step 1: Clear Drawing Board / Draw Background
    ctx.clearRect(0, 0, width, height);

    // Step 2: Draw Shooting Stars
    for (let i = 0; i < starsArr.length; i++) {
      if (starsArr[i].radius - animationSettings.moonStar.shrinkFactor <= 1) {
        starsArr.splice(i, 1);
        i = i - 1;
      } else {
        starsArr[i].update();
      }
    }

    // Step 3: Draw Explosion MiniStars
    for (let i = 0; i < miniStarsArr.length; i++) {
      if (miniStarsArr[i].timeToLive === 0) {
        miniStarsArr.splice(i, 1);
        i = i - 1;
      } else {
        miniStarsArr[i].update();
      }
    }

    // Step 4: Random Spawn of Shooting stars
    ticker = ticker + 1;
    if (ticker % animationSettings.general.randomSpawnRate === 0) {
      const moonStar = createRandomMoonStar({
        ctx,
        animationSettings,
        boundingBox: { width, height: height - animationSettings.background.groundHeight },
        onExplode: (miniStarProps) => miniStarsArr.push(new MiniStar(miniStarProps)),
      });

      starsArr.push(moonStar);

      animationSettings.general.randomSpawnRate = Math.floor(200 + (Math.random() - 0.5) * 40);
      ticker = 1;
    }

    // Step Last: Animation Loop
    requestAnimationFrame(animate);
  }
  animate();
}
