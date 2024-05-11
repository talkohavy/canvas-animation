import { colorPalette } from '../constants';

function getRandomGoldColor() {
  const index = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[index];
}

export { getRandomGoldColor };
