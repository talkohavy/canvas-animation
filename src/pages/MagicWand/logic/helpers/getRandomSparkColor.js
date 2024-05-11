import { COLOR_PALETTE } from '../constants';

/**
 * @param {{palette: 'magic' | 'fire'}} props
 */
function getRandomSparkColor(props) {
  const { palette = 'magic' } = props;

  const index = Math.floor(Math.random() * COLOR_PALETTE[palette].length);
  return COLOR_PALETTE[palette][index];
}

export { getRandomSparkColor };
