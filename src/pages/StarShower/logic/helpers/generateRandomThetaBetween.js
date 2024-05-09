function generateRandomThetaBetween(minTheta, maxTheta) {
  return minTheta + Math.random() * (maxTheta - minTheta);
}

export { generateRandomThetaBetween };
