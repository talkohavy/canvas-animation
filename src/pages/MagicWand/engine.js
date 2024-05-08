import {
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
} from './constants';
import {
  randomGoldColorGenerator,
  randomTheta,
  // randomThetaBetweenDegs,
  // generateRandomThetaBetween,
  // degreesToRadians,
  // easeOutBounce,
  // easeOut,
} from './helpers';

export function engine(mainCanvas, mainSize) {
  // ----------------------------------
  // Phase 1: Declare Global Parameters
  // ----------------------------------
  const c = mainCanvas.getContext('2d');
  mainCanvas.height = mainSize.height;
  mainCanvas.width = mainSize.width;
  const { width } = mainSize;
  const { height } = mainSize;
  // Initialize variables:
  const pullForce = width > 600 ? 0.0003 : 0.0005;
  const numOfMagicSparks = width > 600 ? 5 : 3;
  const sparksBoost = width > 600 ? 15 : 13;
  const bigFieldRadius = width > 600 ? 0.6 * width : width;
  const poleRadius = width > 600 ? 50 : 30;
  const megaBurstValue = width > 600 ? 0.5 : 0.15;
  // fixed variables:
  const MathRand = Math.random;
  const MathAbs = Math.abs;
  let ticker = 1;
  let clicked;
  let mouse = { x: 0, y: 0 };
  const mainBallsArr = [];
  const magicSparksArr = [];
  const polesArr = [];

  // ----------------------------------------------------------------------------------
  // Phase 2: Declare Functions that use: [ objArr | width | mouse.pos | new Object() ]
  // ----------------------------------------------------------------------------------
  const positions = [
    { x: width * 0.25, y: height * 0.25 },
    { x: width * 0.75, y: height * 0.25 },
    { x: width * 0.75, y: height * 0.75 },
    { x: width * 0.25, y: height * 0.75 },
  ];
  // function nextPolePosition(ticker, prevStep) {
  //   // if (ticker % 300 === 0) {
  //   //   mouse.x = MathRand() * width;
  //   //   mouse.y = MathRand() * height;
  //   // }
  //   // Step 1: find step
  //   let curStep = -1;
  //   if (ticker < 80) {
  //     curStep = 0;
  //   } else {
  //     if (ticker < 200) {
  //       curStep = 1;
  //     } else {
  //       if (ticker < 340) {
  //         curStep = 2;
  //       } else {
  //         curStep = 3;
  //       }
  //     }
  //   }

  //   // Step 2: Did the step change? compare curStep to prevStep
  //   if (curStep === prevStep) {
  //     return curStep;
  //   }

  //   // Step 3: Yes! it has! make the change...
  //   if (MathRand() < 0.65) {
  //     mouse = positions[curStep];
  //   }
  //   return curStep;
  // }

  function createNewMagicSpark(x, y) {
    const curTheta = randomTheta();
    const curPower = 0.4 + MathRand() * 0.5;
    const props = {
      x,
      y,
      dx: maxBoomPower * curPower * Math.sin(curTheta),
      dy: maxBoomPower * curPower * Math.cos(curTheta),
      color: randomGoldColorGenerator(),
      size: 1,
    };
    magicSparksArr.push(new MagicSpark(props));
  }

  function createNewMainBall({ x, y }) {
    const props = { x, y, dx: 1, dy: -1 };
    mainBallsArr.push(new MainBall(props));
  }

  function createNewPole({ x, y, step }) {
    mouse = { x, y };
    polesArr.push(new Pole(x, y, step));
  }

  // ----------------------------
  // Phase 3: Declare all Objects
  // ----------------------------
  class MagicSpark {
    // Constructor:
    constructor({ x, y, dx, dy, color, size }) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.color = color;
      this.size = size;
      this.normX = 0;
      this.normY = 0;
      this.maxTtl = 70; // 100 frames
      this.curTtl = 70; // 100 frames
      this.opacity = 1;
      this.radius = MaxRadius;
    }

    // ------------
    // all methods:
    // ------------

    // Method 1: Draw MagicSpark
    draw() {
      c.fillStyle = this.color;
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, twoPie, true);
      c.shadowColor = '#e3eaef';
      c.shadowBlur = shadowBlur;
      c.closePath();
      c.fill();
      c.strokeStyle = 'black';
      c.restore();
    }

    // Method 2: Update
    update() {
      // Step 1: Calc Distance from mouse
      const diffX = this.x - mouse.x;
      const diffY = this.y - mouse.y;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY) || 0.001;

      // Step 2: Get normalized direction values
      this.normX = diffX / distance;
      this.normY = diffY / distance;

      // Step 3: If a click occurred
      let curForce = -1;
      if (distance < midFieldRadius) {
        curForce = pushForce * (1 - distance / midFieldRadius);
        this.dx = this.dx + (this.normX * curForce + 0.5 - MathRand());
        this.dy = this.dy + (this.normY * curForce + 0.5 - MathRand());
      }
      // Step 4: Reduce Time To Live
      this.curTtl = this.curTtl - 1;
      this.opacity = this.opacity - 1 / this.curTtl; // 0.01

      // Step 5: decrease radius
      this.radius = this.radius * radiusDecay;
      // let progress = (this.maxTtl - this.curTtl) / this.maxTtl;
      // this.radius = MaxRadius * (1 - easeOut(progress));

      // Step 6: Decay acceleration with each iteration
      this.dx = this.dx * speedDecay;
      this.dy = this.dy * speedDecay + gravity;

      // Step 7: Update particle's position
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;

      // Step 8: Collision Detection for Walls Floor and Ceiling
      // -- Walls:
      if (this.x > width) {
        this.x = width;
        this.dx = -1 * this.dx;
      } else if (0 > this.x) {
        this.x = 0;
        this.dx = -1 * this.dx;
      }
      // -- Floor and Ceiling:
      if (this.y > height) {
        this.y = height;
        this.dy = -1 * this.dy;
      } else if (0 > this.y) {
        this.y = 0;
        this.dy = -1 * this.dy;
      }
      // Step 9: Draw object
      this.draw();
    }
  }

  class MainBall {
    // Constructor:
    constructor({ x, y, dx, dy }) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.normX = 0;
      this.normY = 0;
      this.timer = 0;
      this.boostMode = false;
    }

    // all methods:

    // Method 1: Draw MainBall
    // draw() {
    //   c.fillStyle = this.color;
    //   c.beginPath();
    //   c.arc(this.x, this.y, MaxRadius * this.normX, 0, twoPie, true);
    //   /* c.shadowColor = "white";
    //         c.shadowBlur = 5; */
    //   c.closePath();
    //   c.fill();
    //   // c.strokeStyle = "green"; //
    //   // c.stroke()
    // }

    // Method 2: Update
    update() {
      if (this.boostMode) {
        this.timer--;
      }
      if (this.timer === 0) {
        this.boostMode = false;
        this.timer--;
      }

      // Step 1: Calc Distance from mouse
      const diffX = this.x - mouse.x;
      const diffY = this.y - mouse.y;
      let distance = Math.sqrt(diffX * diffX + diffY * diffY) || 0.001;

      // Step 2: Get normalized direction values
      this.normX = diffX / distance;
      this.normY = diffY / distance;

      // Step 3: If a click occurred
      let curForce = -1;
      if (clicked && distance < midFieldRadius) {
        curForce = pushForce * (1 - distance / midFieldRadius);
        this.dx = this.dx + (this.normX * curForce + 0.5 - MathRand());
        this.dy = this.dy + (this.normY * curForce + 0.5 - MathRand());
      }

      // Step 4: Start attracting particles if they are inside magnetic field
      if (distance < bigFieldRadius) {
        curForce = pullForce * (1 - distance / bigFieldRadius) * width;
        this.dx = this.dx - this.normX * curForce;
        this.dy = this.dy - this.normY * curForce;
      }

      // Step 5: Decay acceleration with each iteration
      this.dx = this.dx * decay;
      this.dy = this.dy * decay;

      // Step 6: Control Particle size based on distance
      this.normX = MathAbs(this.dx);
      this.normY = MathAbs(this.dy);
      distance = 0.5 * (this.normX + this.normY);

      // Step 7: Always keep them moving in random directions
      if (this.normX < megaBurstValue && this.normY < megaBurstValue) {
        this.dx = this.dx + 5 + 8 * MathRand();
        this.dy = this.dy + 5 + 8 * MathRand();
        this.boostMode = true;
        this.timer = 50;
      }

      // Step 8: Limit Particle's MinMax size
      this.normX = 0.45 * distance;
      this.normX = Math.max(Math.min(this.normX, 4), 0.4);

      // Step 9: Update particle's position
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;

      // Step 10: Collision Detection for Walls Floor and Ceiling
      // -- Walls:
      if (this.x > width) {
        this.x = width;
        this.dx = -1 * this.dx;
      } else if (0 > this.x) {
        this.x = 0;
        this.dx = -1 * this.dx;
      }
      // -- Floor and Ceiling:
      if (this.y > height) {
        this.y = height;
        this.dy = -1 * this.dy;
      } else if (0 > this.y) {
        this.y = 0;
        this.dy = -1 * this.dy;
      }
      // Step 11: Random Spawn of MagicSparks around mouse
      for (let i = 0; i < numOfMagicSparks + (this.boostMode ? sparksBoost : 0); i++) {
        createNewMagicSpark(this.x, this.y);
      }
      // this.draw();
    }
  }

  class Pole {
    // Constructor:
    constructor(x, y, step) {
      this.position = { x, y };
      this.step = step;
      this.radius = poleRadius;
    }

    // all methods:

    // Method 1: draw Pole
    draw() {
      c.fillStyle = 'red';
      c.beginPath();
      c.arc(this.position.x, this.position.y, this.radius, 0, twoPie, true);
      c.shadowColor = '#e3eaef';
      c.shadowBlur = shadowBlur;
      c.closePath();
      c.fill();
      c.strokeStyle = 'black';
      c.restore();
    }

    // Method 2: Update
    update() {
      // Step 1: Calc Distance from MainBall
      const diffX = this.position.x - mainBallsArr[0]?.x;
      const diffY = this.position.y - mainBallsArr[0]?.y;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY) || 0.001;

      // Step 2: Get normalized direction values
      this.normX = diffX / distance;
      this.normY = diffY / distance;

      // Step 4: Start attracting particles if they are inside magnetic field
      if (distance < this.radius) {
        this.goToNextPosition();
      }
      // this.draw();
    }

    // Method 3: go To Next Position
    goToNextPosition() {
      this.step = (this.step + 1) % 4;
      this.position = positions[this.step];
      mouse = positions[this.step];
    }
  }

  // ------------------------
  // Phase 4: Event Listeners
  // ------------------------

  // Event 1: Mouse Move
  // window.addEventListener('mousemove', (e) => {
  //   mouse.x = e.clientX;
  //   mouse.y = e.clientY - (e.clientY - e.offsetY);
  // });

  // Event 2: Mouse Down
  window.addEventListener('mousedown', () => {
    clicked = !0;
  });

  // Event 3: Mouse Up
  window.addEventListener('mouseup', () => {
    clicked = !1;
  });

  // Event 4: Touch Move
  // window.addEventListener('touchmove', (e) => {
  //   // If there's exactly one finger inside this element
  //   if (e.targetTouches.length === 1) {
  //     const touch = e.targetTouches[0];
  //     // Place element where the finger is
  //     // Step 1: Get mouse position.
  //     mouse.x = touch.pageX;
  //     mouse.y = touch.pageY - 80;
  //   }
  // });

  // Event 5: Touch Start
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      clicked = !0;
    }
  });

  // Event 6: Touch End
  window.addEventListener('touchend', (e) => {
    if (e.touches.length <= 1) {
      clicked = !1;
    }
  });

  // -----------------------
  // Phase 5: Implementation
  // -----------------------
  const initialPos = { x: width * 0.05, y: height * 0.75 };

  for (let i = 0; i < numOfPoles; i++) createNewMainBall(initialPos);

  createNewPole({ x: width * 0.25, y: height * 0.25, step: 0 });

  // -----------------------------
  // Phase 6: Start Animation Loop
  // -----------------------------
  function animate() {
    // Step 1: Clear Drawing Board / Draw Background
    // c.globalCompositeOperation = "source-over";
    c.fillStyle = 'rgba(0,8,12,1)'; // black
    c.fillRect(0, 0, width, height);
    // c.globalCompositeOperation = "lighter";

    // Step 2: Run Poles
    for (let i = 0; i < polesArr.length; i++) polesArr[i].update();

    // Step 2: Run Main Ball
    for (let i = 0; i < mainBallsArr.length; i++) {
      // if (mainBallsArr[i].curTtl === 0) {
      //   mainBallsArr.splice(i, 1);
      //   i = i - 1;
      // } else {
      mainBallsArr[i].update();
      // }
    }

    // Step 3: Run MagicSparks
    for (let i = 0; i < magicSparksArr.length; i++) {
      if (magicSparksArr[i].curTtl === 0) {
        magicSparksArr.splice(i, 1);
        i = i - 1;
      } else {
        magicSparksArr[i].update();
      }
    }

    // Step 4: random mouse pole
    ticker = (ticker + 1) % 550;
    // step = nextPolePosition(ticker, step);

    // c.fillStyle = 'red';
    // c.beginPath();
    // c.arc(mouse.x, mouse.y, 10, 0, twoPie, true);
    // c.shadowColor = '#e3eaef';
    // c.shadowBlur = shadowBlur;
    // c.closePath();
    // c.fill();
    // c.strokeStyle = 'black';
    // c.restore();

    // Last Step: Loop over & over
    requestAnimationFrame(animate);
  }
  animate();
}
