import { drawCircle } from './helpers/drawCircle';

class MiniStar {
  /**
   * @param {import('../types').MiniStarProps} props
   */
  constructor(props) {
    const { ctx, animationSettings, x, y, radius, dx, dy, boundingBox } = props;

    this.ctx = ctx;
    this.animationSettings = animationSettings;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.boundingBox = boundingBox;
    this.dx = dx;
    this.dy = dy;
    this.timeToLive = 500; // 300 frames
    this.opacity = 1;
  }

  draw() {
    drawCircle({
      ...this.animationSettings.miniStar.drawProps,
      ctx: this.ctx,
      x: this.x,
      y: this.y,
      radius: this.radius,
    });
  }

  update() {
    this.freeFall();

    if (this.isHittingFloor()) {
      this.reverseYDirection();
    }

    this.timeToLive = this.timeToLive - 1;
    this.opacity = this.opacity - 1 / this.timeToLive; // 0.01

    this.moveToNextPosition();

    this.draw();
  }

  freeFall() {
    this.dy = this.dy + this.animationSettings.miniStar.gravity;
  }

  isHittingFloor() {
    return this.y + this.radius + this.dy > this.boundingBox.height;
  }

  reverseYDirection() {
    this.dy = -this.dy * this.animationSettings.miniStar.elasticity;
  }

  moveToNextPosition() {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
  }
}

export { MiniStar };
