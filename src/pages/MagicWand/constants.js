const numOfPoles = 1;
const speedDecay = 0.985;
const radiusDecay = 0.98; // 0.99
const shadowBlur = 6; // 6
const pushForce = 1; // Push sparks away from mouse location
const maxBoomPower = 1; // Initial Push of sparks away from mouse location (can be different than pushForce)
const MaxRadius = 2.5; // sparks max radius (it's decreasing)
const midFieldRadius = 2; // The radius in which the push will be effective
const gravity = 0.03; // 0.05
const decay = 0.985;
const twoPie = 2 * Math.PI;

export {
  MaxRadius,
  decay,
  gravity,
  maxBoomPower,
  midFieldRadius,
  numOfPoles,
  pushForce,
  radiusDecay,
  shadowBlur,
  speedDecay,
  twoPie,
};
