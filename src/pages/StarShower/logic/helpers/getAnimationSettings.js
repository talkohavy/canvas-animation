import { convertDegreesToRadians } from './convertDegreesToRadians';

/**
 * @param {{
 *   canvasWidth: number
 * }} props
 * @returns {import('../../types').AnimationSettings}
 */
function getAnimationSettings(props) {
  const { canvasWidth } = props;

  const minInRadians = convertDegreesToRadians(-20);
  const maxInRadians = convertDegreesToRadians(200);

  // (100% - percentage of energy loss from wind friction on x axis)
  // const elasticity = 0.5 + MathRand() * 0.4; // (100% - percentage of energy Loss from hitting ground)
  return {
    moonStar: {
      drawProps: {
        color: '#e3eaef',
        borderColor: 'black',
        shadowColor: '#e3eaef',
        shadowBlur: 20,
      },
      gravity: 0.1,
      elasticity: 0.7,
      shrinkFactor: 3,
      explode: {
        miniStarsCount: 16,
      },
    },
    miniStar: {
      drawProps: {
        color: 'rgba(227, 234, 239, 0.9)',
        shadowColor: '#e3eaef',
        shadowBlur: 20,
      },
      gravity: 0.05,
      elasticity: 1,
    },
    general: {
      gravity: 0.1,
      randomSpawnRate: 200,
      initialMoonStarsCount: 1,
    },
    background: {
      groundHeight: 100,
      starsCount: canvasWidth > 600 ? 150 : 30,
    },
    maxBoomPower: 10,
    rollFriction: 0.99, // roll friction on x axis
    maxInRadians,
    minInRadians,
  };
}

export { getAnimationSettings };
