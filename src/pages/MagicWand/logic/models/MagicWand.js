import { createNewMagicSpark } from './MagicSpark';

class MagicWand {
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

      if (distance < this.animationSettings.poles.magneticFieldRadius)
        this.moveTowardsPole({ pullForce: currentPullForce, poleDirection });
    }

    this.dx = this.dx * this.animationSettings.magicWands.accelerationDecay;
    this.dy = this.dy * this.animationSettings.magicWands.accelerationDecay;

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
    const nextYPosition = this.y + this.dy;
    return nextYPosition > this.boundingBox.height || nextYPosition <= 0;
  }

  isHittingWall() {
    const nextXPosition = this.x + this.dx;
    return nextXPosition > this.boundingBox.width || nextXPosition <= 0;
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
    return (
      pullForce < this.animationSettings.magicWands.boostMode.minPullForceThreshold &&
      Math.abs(this.dx) + Math.abs(this.dy) < this.animationSettings.magicWands.boostMode.slowMovementThreshold
    );
  }

  calculatePullForce(distance) {
    const { maxPolePullForce } = this.animationSettings.poles;

    return (
      maxPolePullForce * (1 - distance / this.animationSettings.poles.magneticFieldRadius) * this.boundingBox.width
    );
  }

  activateMegaBoost() {
    const { boostPowerBase, boostPowerRange } = this.animationSettings.magicWands.boostMode;

    const signIndicatorX = Math.random() < 0.5 ? 1 : -1;
    const signIndicatorY = Math.random() < 0.5 ? 1 : -1;
    this.dx = this.dx + signIndicatorX * (boostPowerBase + boostPowerRange * Math.random());
    this.dy = this.dy + signIndicatorY * (boostPowerBase + boostPowerRange * Math.random());
    this.isBoostMode = true;
    this.timer = 50;
  }

  emitMagicSparks() {
    const magicSparksCount = this.isBoostMode
      ? this.animationSettings.magicWands.boostMode.sparksPerFrame
      : this.animationSettings.magicWands.sparksPerFrame;

    const magicSparksArr = [];
    for (let i = 0; i < magicSparksCount; i++) {
      const magicSparkProps = {
        ctx: this.ctx,
        animationSettings: this.animationSettings,
        boundingBox: this.boundingBox,
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

function createNewMagicWand({ ctx, animationSettings, boundingBox, x, y }) {
  const magicWandProps = { ctx, animationSettings, boundingBox, x, y, dx: 1, dy: -1 };
  const magicWand = new MagicWand(magicWandProps);

  return magicWand;
}

export { MagicWand, createNewMagicWand };
