const colorPalette = [
  '#ffd700',
  '#f5f5dc',
  '#fafad2',
  '#eee8aa',
  '#f0e68c',
  '#daa520',
  '#b8860b',
  '#faf0be',
  '#eae0c8',
  '#eae0c8',
  '#fae7b5',
  '#f5deb3',
  '#f3e5ab',
  '#f3e5ab',
  '#f0dc82',
  '#f8de7e',
  '#eedc82',
  '#e5aa70',
  '#e9d66b',
  '#ffdb58',
  '#e4d96f',
  '#e1a95f',
  '#ffcc33',
  '#ecd540',
  '#f4c430',
  '#ffcc00',
  '#ffd300',
  '#ffdf00',
  '#fcc200',
];
const MathRand = Math.random;
const twoPie = 2 * Math.PI;

function degreesToRadians(degree) {
  return (Math.PI / 360) * 2 * (degree + 90);
}

function easeOut(x) {
  // return 1 - Math.pow(1 - x / 2, 4); // with: MaxRadius = 3 , name: ??? , score: 10/10
  // return 1 - Math.cos((x * Math.PI) / 2); // name: easeInSine , score: 7/10
  // return 1 - Math.pow(1 - x * 0.75, 3); // with: MaxRadius = 3 , name: easeOutCubic , score: 10/10
  // return -(Math.cos(Math.PI * x) - 1) / 2; // name: easeInOutSine 9.8/10
  // return Math.pow(x, 5); // name: easeInQuint 7/10
  return Math.sqrt(1 - (x - 1) ** 2); // name: easeOutCirc 9.8/10
  // Special Ones:
  // -- Special Number 1: easeInElastic 9.9/10
  // const c4 = (2 * Math.PI) / 3;
  // return x === 0
  //   ? 0
  //   : x === 1
  //   ? 1
  //   : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
  // -- Special Number 2: easeInOutBack 9.0/10
  // const c1 = 1.70158;
  // const c2 = c1 * 1.525;
  // return x < 0.5
  //   ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
  //   : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  // -- Special Number 3: easeOutElastic 9.0/10
  // const c4 = (2 * Math.PI) / 3;
  // return x === 0
  //   ? 0
  //   : x === 1
  //   ? 1
  //   : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  // -- Special Number 4: easeOutBounce 9.6/10
  // return 1 - easeOutBounce(1 - x);
  // -- Special Number 5: easeInOutBounce 9.9/10
  // return x < 0.5
  //   ? (1 - easeOutBounce(1 - 2 * x)) / 2
  //   : (1 + easeOutBounce(2 * x - 1)) / 2;
  // -- Special Number 5: easeOutBack 9.9/10
  // const c1 = 1.70158;
  // const c3 = c1 + 1;
  // return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) return n1 * x * x;

  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;

  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;

  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

function generateRandomThetaBetween(minTheta, maxTheta) {
  return minTheta + MathRand() * (maxTheta - minTheta);
}

function randomGoldColorGenerator() {
  const index = Math.floor(MathRand() * colorPalette.length);
  return colorPalette[index];
}

function randomTheta() {
  return MathRand() * twoPie;
}

function randomThetaBetweenDegs(minTheta, maxTheta) {
  return (Math.PI / 180) * (90 + minTheta + MathRand() * (maxTheta - minTheta));
}

export { colorPalette };
export {
  degreesToRadians,
  easeOut,
  easeOutBounce,
  generateRandomThetaBetween,
  randomGoldColorGenerator,
  randomTheta,
  randomThetaBetweenDegs,
};
