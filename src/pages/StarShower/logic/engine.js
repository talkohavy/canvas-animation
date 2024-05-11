import { drawBackgroundScene } from './helpers/drawBackgroundScene';
import { getAnimationSettings } from './helpers/getAnimationSettings';
import { MiniStar } from './MiniStar';
import { createRandomMoonStar } from './MoonStar';

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
  let starsArr = [];
  let miniStarsArr = [];

  for (let i = 0; i < animationSettings.general.initialMoonStarsCount; i++) {
    const moonStar = createRandomMoonStar({
      ctx,
      animationSettings,
      boundingBox: { width, height: height - animationSettings.background.groundHeight },
      onExplode: (miniStarProps) => miniStarsArr.push(new MiniStar(miniStarProps)),
    });

    starsArr.push(moonStar);
  }

  drawBackgroundScene({ ctx: bgCtx, animationSettings, canvasWidth: width, canvasHeight: height });

  function animate() {
    // Step 1: Clear Drawing Board / Draw Background
    ctx.clearRect(0, 0, width, height);

    // Step 2: Draw Moon Stars
    starsArr = starsArr.filter((moonStar) => moonStar.radius - animationSettings.moonStar.shrinkFactor > 1);
    for (const moonStar of starsArr) {
      moonStar.update();
    }

    // Step 3: Draw MiniStars
    miniStarsArr = miniStarsArr.filter((miniStar) => miniStar.timeToLive > 0);
    for (const miniStar of miniStarsArr) {
      miniStar.update();
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

    requestAnimationFrame(animate);
  }
  animate();
}
