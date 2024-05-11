import { MaxRadius, decay, gravity, maxBoomPower, radiusDecay, shadowBlur, speedDecay, twoPie } from './constants';
import { drawCircle } from './drawCircle';
import { getRandomThetaInRadians, randomGoldColorGenerator } from './helpers';

function getAnimationSettings({ canvasWidth, canvasHeight }) {
  return {
    magicWands: {
      emittedSparksPerFrame: canvasWidth > 600 ? 5 : 3,
      accelerationDecayFactory: 0.985,
      boostMode: {
        minBoostPower: 8,
        duration: 50,
        emittedSparksPerFrameOnBoost: canvasWidth > 600 ? 15 : 13,
      },
    },
    magicSparks: {
      radiusDecayFactor: 0.98,
      ttl: 70,
      initialRadius: 2.5,
    },
    pole: {
      radius: canvasWidth > 600 ? 50 : 30,
      positions: [
        { x: canvasWidth * 0.25, y: canvasHeight * 0.25 },
        { x: canvasWidth * 0.75, y: canvasHeight * 0.25 },
        { x: canvasWidth * 0.75, y: canvasHeight * 0.75 },
        { x: canvasWidth * 0.25, y: canvasHeight * 0.75 },
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

  const maxPolePullForce = width > 600 ? 0.0003 : 0.0005;
  const numOfMagicSparks = width > 600 ? 5 : 3;
  const sparksBoost = width > 600 ? 15 : 13;
  const minBoostPower = 5;
  const boostPowerRange = 8;
  const bigFieldRadius = width > 600 ? 0.5 * width : width;
  const poleRadius = width > 600 ? 50 : 30;
  const slowMovementThreshold = width > 600 ? 1 : 0.15;
  const minPullForceThreshold = 0.01;
  const magicWandArr = [];
  let magicSparksArr = [];

  const animationSettings = getAnimationSettings({ canvasWidth: width, canvasHeight: height });

  const positions = [
    { x: width * 0.25, y: height * 0.25 },
    { x: width * 0.75, y: height * 0.25 },
    { x: width * 0.75, y: height * 0.75 },
    { x: width * 0.25, y: height * 0.75 },
  ];

  function createNewMagicSpark(props) {
    const { ctx, animationSettings, x, y, isBoostMode } = props;

    const thetaInRadians = getRandomThetaInRadians();
    const direction = {
      x: Math.cos(thetaInRadians),
      y: Math.sin(thetaInRadians),
    };
    const percentageOfPower = isBoostMode ? Math.random() : 0.4 + Math.random() * 0.5;
    const magicSparkProps = {
      ctx,
      animationSettings,
      boundingBox: { width, height },
      x,
      y,
      dy: percentageOfPower * maxBoomPower * direction.x,
      dx: percentageOfPower * maxBoomPower * direction.y,
      color: randomGoldColorGenerator(),
      shadowColor: isBoostMode ? 'red' : '#e3eaef',
      size: 1,
    };

    const magicSpark = new MagicSpark(magicSparkProps);

    return magicSpark;
  }

  function createNewMagicWand({ ctx, animationSettings, boundingBox, x, y }) {
    const magicWandProps = { ctx, animationSettings, boundingBox, x, y, dx: 1, dy: -1 };
    const magicWand = new MainBall(magicWandProps);

    return magicWand;
  }

  function createNewPole({ ctx, animationSettings, x, y, step }) {
    const poleProps = { ctx, animationSettings, x, y, step };
    const pole = new Pole(poleProps);

    return pole;
  }

  class MagicSpark {
    constructor({ ctx, animationSettings, boundingBox, x, y, dx, dy, color, shadowColor, size }) {
      this.ctx = ctx;
      this.animationSettings = animationSettings;
      this.boundingBox = boundingBox;
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.color = color;
      this.shadowColor = shadowColor;
      this.size = size;
      this.normX = 0;
      this.normY = 0;
      this.maxTtl = 70; // 100 frames
      this.curTtl = 70; // 100 frames
      this.opacity = 1;
      this.radius = MaxRadius;
    }

    draw() {
      drawCircle({
        ctx,
        x: this.x,
        y: this.y,
        radius: this.radius,
        color: this.color,
        shadowColor: this.shadowColor,
        shadowBlur,
      });
    }

    update() {
      this.reduceTimeToLive();

      this.freeFall();

      this.speedDecay();

      if (this.isHittingWall()) {
        this.reverseXDirection();
      }

      if (this.isHittingFloorOrCeiling()) {
        this.reverseYDirection();
      }

      this.moveToNextPosition();

      this.draw();
    }

    freeFall() {
      this.dy = this.dy + gravity;
    }

    speedDecay() {
      this.dx = this.dx * speedDecay;
      this.dy = this.dy * speedDecay;
    }

    isHittingFloorOrCeiling() {
      return this.y + this.dy > this.boundingBox.height || this.y < 0;
    }

    isHittingWall() {
      return this.x + this.dx > this.boundingBox.width || this.x <= 0;
    }

    reverseXDirection() {
      this.dx = -1 * this.dx;
    }

    reverseYDirection() {
      this.dy = -1 * this.dy;
    }

    moveToNextPosition() {
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
    }

    reduceTimeToLive() {
      this.curTtl = this.curTtl - 1;
      this.radius = this.radius * radiusDecay;
      this.opacity = this.opacity - 1 / this.curTtl;
    }
  }

  class MainBall {
    constructor({ ctx, boundingBox, animationSettings, x, y, dx, dy }) {
      this.ctx = ctx;
      this.animationSettings = animationSettings;
      this.boundingBox = boundingBox;
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.normX = 0;
      this.normY = 0;
      this.timer = 0;
      this.isBoostMode = false;
    }

    update(props) {
      const { polePosition } = props;

      if (this.isBoostMode) this.boostModeCountDown();

      let currentPullForce = 0;
      if (polePosition) {
        const { distance, poleDirection } = this.calculateDirectionAndDistanceFromPole(polePosition);

        currentPullForce = this.calculatePullForce(distance);

        if (distance < bigFieldRadius) this.moveTowardsPole({ pullForce: currentPullForce, poleDirection });
      }

      this.dx = this.dx * decay;
      this.dy = this.dy * decay;

      if (this.isMovingSlow(currentPullForce)) this.activateMegaBoost();

      if (this.isHittingFloorOrCeiling()) {
        this.reverseYDirection();
      }

      if (this.isHittingWall()) {
        this.reverseXDirection();
      }

      this.moveToNextPosition();

      return this.emitMagicSparks();
    }

    isHittingFloorOrCeiling() {
      return this.y + this.dy > this.boundingBox.height || this.y < 0;
    }

    isHittingWall() {
      return this.x + this.dx > this.boundingBox.width || this.x <= 0;
    }

    reverseXDirection() {
      this.dx = -1 * this.dx;
    }

    reverseYDirection() {
      this.dy = -1 * this.dy;
    }

    moveToNextPosition() {
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
    }

    calculateDirectionAndDistanceFromPole(polePosition) {
      const diffX = this.x - polePosition.x;
      const diffY = this.y - polePosition.y;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY) || 0.001;

      const normX = diffX / distance;
      const normY = diffY / distance;

      return { distance, poleDirection: { x: normX, y: normY } };
    }

    boostModeCountDown() {
      this.timer--;

      if (this.timer === 0) this.setBoostModeOff();
    }

    setBoostModeOn() {
      this.isBoostMode = true;
    }

    setBoostModeOff() {
      this.isBoostMode = false;
    }

    moveTowardsPole({ pullForce, poleDirection }) {
      this.dx = this.dx - poleDirection.x * pullForce;
      this.dy = this.dy - poleDirection.y * pullForce;
    }

    isMovingSlow(pullForce) {
      return pullForce < minPullForceThreshold && Math.abs(this.dx) + Math.abs(this.dy) < slowMovementThreshold;
    }

    calculatePullForce(distance) {
      return maxPolePullForce * (1 - distance / bigFieldRadius) * width;
    }

    activateMegaBoost() {
      const signIndicatorX = Math.random() < 0.5 ? 1 : -1;
      const signIndicatorY = Math.random() < 0.5 ? 1 : -1;
      this.dx = this.dx + signIndicatorX * (minBoostPower + boostPowerRange * Math.random());
      this.dy = this.dy + signIndicatorY * (minBoostPower + boostPowerRange * Math.random());
      this.isBoostMode = true;
      this.timer = 50;
    }

    emitMagicSparks() {
      const magicSparksArr = [];
      for (let i = 0; i < numOfMagicSparks + (this.isBoostMode ? sparksBoost : 0); i++) {
        const magicSparkProps = {
          ctx: this.ctx,
          animationSettings: this.animationSettings,
          x: this.x,
          y: this.y,
          isBoostMode: this.isBoostMode,
        };
        const magicSpark = createNewMagicSpark(magicSparkProps);
        magicSparksArr.push(magicSpark);
      }

      return magicSparksArr;
    }
  }

  class Pole {
    constructor({ ctx, animationSettings, x, y, step }) {
      this.ctx = ctx;
      this.animationSettings = animationSettings;
      this.position = { x, y };
      this.step = step;
      this.radius = poleRadius;
    }

    draw() {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, twoPie, true);
      ctx.shadowColor = '#e3eaef';
      ctx.shadowBlur = shadowBlur;
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.restore();
    }

    update(props) {
      const { mainBall } = props;

      // Step 1: Calc Distance from MainBall
      if (mainBall) {
        const diffX = this.position.x - mainBall.x;
        const diffY = this.position.y - mainBall.y;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY) || 0.001;

        // Step 2: Switch position if too close
        if (distance < this.radius) this.goToNextPosition();
      }

      this.draw();
    }

    // Method 3: go To Next Position
    goToNextPosition() {
      this.step = (this.step + 1) % 4;
      this.position = positions[this.step];
    }
  }

  // -----------------------
  // Phase 5: Implementation
  // -----------------------

  const magicWand = createNewMagicWand({
    ctx,
    animationSettings,
    boundingBox: { width, height },
    x: width * 0.05,
    y: height * 0.75,
  });
  magicWandArr.push(magicWand);

  const pole = createNewPole({ ctx, animationSettings, x: width * 0.25, y: height * 0.25, step: 0 });

  // -----------------------------
  // Phase 6: Start Animation Loop
  // -----------------------------
  function animate() {
    // Step 1: Clear Drawing Board / Draw Background
    // ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = 'rgba(0,8,12,1)'; // black
    ctx.fillRect(0, 0, width, height);

    // Step 2: Run Pole
    pole.update({ mainBall: magicWandArr[0] });

    // Step 3: Run Main Ball
    for (const magicWand of magicWandArr) {
      const emittedSparks = magicWand.update({ polePosition: pole.position });
      magicSparksArr.push(...emittedSparks);
    }

    // Step 4: Run MagicSparks
    magicSparksArr = magicSparksArr.filter((magicSpark) => magicSpark.curTtl > 0);
    for (const magicSpark of magicSparksArr) {
      magicSpark.update();
    }

    requestAnimationFrame(animate);
  }
  animate();
}
