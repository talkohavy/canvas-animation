import { createNewMagicWand, createNewPole } from './logic/models';

function getAnimationSettings({ canvasWidth, canvasHeight }) {
  const isDesktopScreen = canvasWidth > 600;

  return {
    magicWands: {
      sparksPerFrame: isDesktopScreen ? 5 : 3,
      accelerationDecay: 0.985,
      boostMode: {
        slowMovementThreshold: isDesktopScreen ? 1 : 0.15,
        minPullForceThreshold: 0.01,
        boostPowerBase: 8,
        boostPowerRange: 8,
        duration: 50,
        sparksPerFrame: isDesktopScreen ? 15 : 13,
      },
    },
    magicSparks: {
      gravity: 0.03,
      shadowColor: '#e3eaef',
      shadowColorOnBoost: 'red',
      shadowBlur: 6,
      radiusDecay: 0.98,
      ttl: 70,
      initialRadius: 2.5,
    },
    poles: {
      maxPolePullForce: isDesktopScreen ? 0.0003 : 0.0005,
      magneticFieldRadius: isDesktopScreen ? 0.6 * canvasWidth : canvasWidth,
      radius: isDesktopScreen ? 50 : 30,
      positions: [
        { x: canvasWidth * 0.25, y: canvasHeight * 0.25 },
        { x: canvasWidth * 0.75, y: canvasHeight * 0.25 },
        { x: canvasWidth * 0.75, y: canvasHeight * 0.75 },
        { x: canvasWidth * 0.25, y: canvasHeight * 0.75 },
        { x: canvasWidth * 0.5, y: canvasHeight * 0.5 },
      ],
    },
  };
}

export function engine(mainCanvas, mainSize) {
  const ctx = mainCanvas.getContext('2d');
  mainCanvas.height = mainSize.height;
  mainCanvas.width = mainSize.width;
  const { width } = mainSize;
  const { height } = mainSize;

  const magicWandArr = [];
  let magicSparksArr = [];

  const animationSettings = getAnimationSettings({ canvasWidth: width, canvasHeight: height });

  const magicWand = createNewMagicWand({
    ctx,
    animationSettings,
    boundingBox: { width, height },
    x: width * 0.05,
    y: height * 0.75,
  });
  magicWandArr.push(magicWand);

  const pole = createNewPole({ ctx, animationSettings, x: width * 0.25, y: height * 0.25, step: 0 });

  function animate() {
    ctx.fillStyle = 'rgba(0,8,12,1)'; // black
    ctx.fillRect(0, 0, width, height);

    pole.update({ mainBall: magicWandArr[0] });

    for (const magicWand of magicWandArr) {
      const emittedSparks = magicWand.update({ polePosition: pole.position });
      magicSparksArr.push(...emittedSparks);
    }

    magicSparksArr = magicSparksArr.filter((magicSpark) => magicSpark.curTtl > 0);
    for (const magicSpark of magicSparksArr) {
      magicSpark.update();
    }

    requestAnimationFrame(animate);
  }

  animate();
}
