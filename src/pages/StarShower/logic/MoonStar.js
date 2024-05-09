import { drawCircle } from './helpers/drawCircle';
import { generateRandomThetaBetween } from './helpers/generateRandomThetaBetween';

class MoonStar {
  /**
   * @param {import('../types').MoonStarProps} props
   */
  constructor(props) {
    const { animationSettings, ctx, x, y, radius, dx = 0, dy = 0, boundingBox, onExplode } = props;
    this.animationSettings = animationSettings;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.boundingBox = boundingBox;
    this.onExplode = onExplode;
  }

  draw() {
    drawCircle({
      ...this.animationSettings.moonStar.drawProps,
      ctx: this.ctx,
      x: this.x,
      y: this.y,
      radius: this.radius,
    });
  }

  update() {
    if (this.isHittingFloor()) {
      this.reverseYDirection();
      this.shrink();
      this.explode();
    } else {
      this.freeFall();
    }

    if (this.isHittingWall()) {
      this.reverseXDirection();
    }

    if (this.isOnFloor()) {
      this.rollFriction();
    }

    this.moveToNextPosition();

    this.draw();
  }

  freeFall() {
    this.dy = this.dy + this.animationSettings.moonStar.gravity;
  }

  isHittingFloor() {
    return this.y + this.radius + this.dy > this.boundingBox.height;
  }

  isOnFloor() {
    return (
      this.y + this.radius + this.dy - 1 <= this.boundingBox.height &&
      this.y + this.radius + this.dy + 1 >= this.boundingBox.height
    );
  }

  rollFriction() {
    this.dx = this.dx * this.animationSettings.rollFriction;
  }

  isHittingWall() {
    return this.x + this.radius + this.dx > this.boundingBox.width || this.x - this.radius <= 0;
  }

  reverseXDirection() {
    this.dx = -this.dx;
  }

  reverseYDirection() {
    this.dy = -this.dy * this.animationSettings.moonStar.elasticity;
  }

  moveToNextPosition() {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
  }

  shrink() {
    this.radius = this.radius - this.animationSettings.moonStar.shrinkFactor;
  }

  explode() {
    for (let i = 0; i < this.animationSettings.moonStar.explode.miniStarsCount; i++) {
      const curTheta = generateRandomThetaBetween(
        this.animationSettings.minInRadians,
        this.animationSettings.maxInRadians,
      );
      const curPower = 0.5 + Math.random() * 0.5;

      /**
       * @type {import('../types').MiniStarProps} props
       */
      const miniStarProps = {
        ctx: this.ctx,
        animationSettings: this.animationSettings,
        boundingBox: this.boundingBox,
        x: this.x,
        y: this.y,
        radius: 2 + Math.random(),
        dx: this.animationSettings.maxBoomPower * curPower * Math.sin(curTheta), // 20 * MathRand() - 5
        dy: this.animationSettings.maxBoomPower * curPower * Math.cos(curTheta), // -15 * MathRand()
      };

      this.onExplode(miniStarProps);
    }
  }
}

function createRandomMoonStar({ ctx, animationSettings, boundingBox, onExplode }) {
  const radius = 8 + Math.random() * 40;
  const x = radius + Math.random() * (boundingBox.width - 2 * radius);
  const y = radius + Math.random() * (boundingBox.height / 3 - radius);
  const dx = (Math.random() - 0.5) * 10;
  const dy = 2;
  // const elasticity = 0.7 + Math.random() * 0.29; // (100% - percentage of energy Loss from hitting ground)

  const moonStar = new MoonStar({
    ctx,
    animationSettings,
    x,
    y,
    radius,
    dx,
    dy,
    boundingBox,
    onExplode,
  });

  return moonStar;
}

export { MoonStar, createRandomMoonStar };
