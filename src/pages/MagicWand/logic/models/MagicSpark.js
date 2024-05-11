import { getRandomSparkColor, getRandomThetaInRadians } from '../helpers';
import { drawCircle } from '../helpers/drawCircle';

class MagicSpark {
  constructor({ ctx, animationSettings, boundingBox, x, y, dx, dy, color, shadowColor }) {
    this.ctx = ctx;
    this.animationSettings = animationSettings;
    this.boundingBox = boundingBox;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.shadowColor = shadowColor;
    this.shadowBlur = animationSettings.magicSparks.shadowBlur;
    this.maxTtl = animationSettings.magicSparks.ttl;
    this.curTtl = animationSettings.magicSparks.ttl;
    this.radius = animationSettings.magicSparks.initialRadius;
    this.opacity = 1;
  }

  draw() {
    drawCircle({
      ctx: this.ctx,
      x: this.x,
      y: this.y,
      radius: this.radius,
      color: this.color,
      shadowColor: this.shadowColor,
      shadowBlur: this.shadowBlur,
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
    this.dy = this.dy + this.animationSettings.magicSparks.gravity;
  }

  speedDecay() {
    this.dx = this.dx * this.animationSettings.magicWands.accelerationDecay;
    this.dy = this.dy * this.animationSettings.magicWands.accelerationDecay;
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
    this.radius = this.radius * this.animationSettings.magicSparks.radiusDecay;
    this.opacity = this.opacity - 1 / this.curTtl;
  }
}

function createNewMagicSpark(props) {
  const { ctx, animationSettings, boundingBox, x, y, isBoostMode } = props;

  let magicSparksProps = animationSettings.magicSparks;
  if (isBoostMode) {
    magicSparksProps = { ...magicSparksProps, ...animationSettings.magicSparks.boostMode };
  }

  const { maxBoostPower, shadowColor } = magicSparksProps;

  const percentageOfPower = isBoostMode ? Math.random() : 0.4 + Math.random() * 0.5;
  const thetaInRadians = getRandomThetaInRadians();
  const direction = { x: Math.cos(thetaInRadians), y: Math.sin(thetaInRadians) };
  const color = getRandomSparkColor({ palette: isBoostMode ? 'fire' : 'magic' });
  const dx = percentageOfPower * maxBoostPower * direction.x;
  const dy = percentageOfPower * maxBoostPower * direction.y;

  const magicSparkProps = {
    ctx,
    animationSettings,
    boundingBox,
    x,
    y,
    dx,
    dy,
    color,
    shadowColor,
  };

  const magicSpark = new MagicSpark(magicSparkProps);

  return magicSpark;
}

export { MagicSpark, createNewMagicSpark };
