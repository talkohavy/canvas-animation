import { drawCircle } from '../helpers';

class Pole {
  constructor({ ctx, animationSettings, x, y, step }) {
    this.ctx = ctx;
    this.animationSettings = animationSettings;
    this.position = { x, y };
    this.step = step;
    this.radius = animationSettings.poles.radius;
  }

  draw() {
    drawCircle({
      ctx: this.ctx,
      x: this.position.x,
      y: this.position.y,
      radius: this.radius,
      color: 'white',
      shadowColor: '#e3eaef',
      shadowBlur: 10,
    });
  }

  update(props) {
    const { mainBall } = props;

    if (mainBall) {
      const diffX = this.position.x - mainBall.x;
      const diffY = this.position.y - mainBall.y;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY) || 0.001;

      if (distance < this.radius) this.goToNextPosition();
    }

    this.draw();
  }

  goToNextPosition() {
    const { positions } = this.animationSettings.poles;
    this.step = (this.step + 1) % positions.length;
    this.position = positions[this.step];
  }
}

function createNewPole({ ctx, animationSettings, x, y, step }) {
  const poleProps = { ctx, animationSettings, x, y, step };
  const pole = new Pole(poleProps);

  return pole;
}

export { Pole, createNewPole };
