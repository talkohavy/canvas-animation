const MathRand = Math.random;

function generateRandomThetaBetween(minTheta, maxTheta) {
  return minTheta + MathRand() * (maxTheta - minTheta);
}
function degreesToRadians(degree) {
  return (Math.PI / 360) * 2 * (90 + degree);
}

export function engine(mainCanvas, bgCanvas, mainSize) {
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // -----     Phase 1: Initialize Parameters     ------
  // -----     Phase 1: Initialize Parameters     ------
  // -----     Phase 1: Initialize Parameters     ------

  // ---------------
  // Canvas Layer 1:
  // ---------------
  let c = mainCanvas.getContext('2d');
  mainCanvas.height = mainSize.height;
  mainCanvas.width = mainSize.width;
  const { width } = mainSize;
  const { height } = mainSize;

  // ---------------
  // Canvas Layer 2:
  // ---------------
  const bgCtx = bgCanvas.getContext('2d');
  bgCanvas.height = mainSize.height;
  bgCanvas.width = mainSize.width;

  // ----------------------------------------
  // Play around with these:
  const numOfBalls = 1;
  const numOfBgStars = width > 600 ? 150 : 0;
  const isShadow = width > 600 ? 1 : 0;
  const groundHeight = 100;
  const gravity = 0.5;
  let randomSpawnRate = 200;
  const maxBoomPower = 10; // Big star exploding to many mini-stars
  const shrinkFactor = 3; // wind friction on x axis
  const rollFriction = 0.99; // wind friction on x axis
  const miniStarColor = { r: 227, g: 234, b: 239 };
  const minRangeInDegrees = -20;
  const maxRangeInDegrees = 200;
  // ----------------------------------------
  const minInRadians = degreesToRadians(minRangeInDegrees);
  const maxInRadians = degreesToRadians(maxRangeInDegrees);
  const xAir = 1; // (100% - percentage of energy loss from wind friction on x axis)
  // const elasticity = 0.5 + MathRand() * 0.4; // (100% - percentage of energy Loss from hitting ground)
  let ticker = 1;
  const starsArr = [];
  const miniStarsArr = [];
  const backgroundStarsArr = [];

  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // --------    Phase 2: Declaring Objects    ---------
  // --------    Phase 2: Declaring Objects    ---------
  // --------    Phase 2: Declaring Objects    ---------

  // -------------
  // Class 1: Star
  // -------------
  class Star {
    // 111111111111111111111111111111111
    // 111111111111111111111111111111111
    // 111111111111111111111111111111111
    // ------- Class Variables ---------
    // ------- Class Variables ---------
    // No need I guess?

    // 222222222222222222222222222222222
    // 222222222222222222222222222222222
    // 222222222222222222222222222222222
    // --------- Constructor -----------
    // --------- Constructor -----------
    constructor(x, y, radius, color, dx, dy, gravity, elasticity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.dx = dx;
      this.dy = dy;
      this.gravity = gravity;
      this.elasticity = elasticity;
    }
    // 33333333333333333333333333333333333333333
    // 33333333333333333333333333333333333333333
    // 33333333333333333333333333333333333333333
    // 33333333333333333333333333333333333333333
    // --------------- Methods -----------------
    // --------------- Methods -----------------
    // --------------- Methods -----------------
    // -------------------
    // Method 1: Draw Star
    // -------------------
    draw() {
      c.save();
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      c.fillStyle = this.color;
      c.shadowColor = '#e3eaef';
      c.shadowBlur = 20;
      c.fill(); // Comment this out for a hollow shape
      c.strokeStyle = 'black';
      c.restore();
    }
    // ----------------
    // Method 2: Update
    // ----------------
    update() {
      // ----------------------------------------
      // Step A: Define hitting walls conditional
      // ----------------------------------------
      // Mini-Step 1: Reverse y direction upon hitting floor
      if (this.y + this.radius + this.dy > height - groundHeight || this.y - this.radius <= 0) {
        this.dy = -this.dy * this.elasticity;
        this.radius = this.radius - shrinkFactor;
        this.explode();
      } else {
        this.dy = this.dy + this.gravity;
      }
      // Mini-Step 2: Reverse x direction upon hitting left/right wall
      if (this.x + this.radius + this.dx > width || this.x - this.radius <= 0) {
        this.dx = -this.dx;
      }
      // Mini-Step 3: Add roll on floor friction + air friction (only on x axis)
      if (this.y + this.radius + this.dy - 1 <= height && this.y + this.radius + this.dy + 1 >= height) {
        this.dx = this.dx * rollFriction;
      } else {
        this.dx = this.dx * xAir;
      }
      // Mini-Step 4: Define object's Velocity
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;

      // Step D: Draw it
      this.draw();
    }
    // -----------------
    // Method 3: Explode
    // -----------------
    explode() {
      for (let i = 0; i < 16; i++) {
        // 8 stars
        const curTheta = generateRandomThetaBetween(minInRadians, maxInRadians);
        const curPower = 0.5 + MathRand() * 0.5;
        const props = {
          x: this.x,
          y: this.y,
          radius: 2 + MathRand(),
          color: miniStarColor,
          // {
          //   r: 200 + MathRand() * 55,
          //   g: 200 + MathRand() * 55,
          //   b: 60 + MathRand() * 75,
          // },
          dx: maxBoomPower * curPower * Math.sin(curTheta), // 20 * MathRand() - 5
          dy: maxBoomPower * curPower * Math.cos(curTheta), // -15 * MathRand()
          gravity: gravity * 0.2,
          elasticity: 1,
        };
        miniStarsArr.push(new MiniStar(props));
      }
    }
  }

  // -----------------
  // Class 2: MiniStar
  // -----------------
  class MiniStar {
    // 111111111111111111111111111111111
    // 111111111111111111111111111111111
    // 111111111111111111111111111111111
    // ------- Class Variables ---------
    // ------- Class Variables ---------
    // No need I guess?

    // 222222222222222222222222222222222
    // 222222222222222222222222222222222
    // 222222222222222222222222222222222
    // --------- Constructor -----------
    // --------- Constructor -----------
    constructor({ x, y, radius, color, dx, dy, gravity, elasticity }) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.dx = dx;
      this.dy = dy;
      this.gravity = gravity;
      this.elasticity = elasticity;
      this.timeToLive = 200; // 100 frames
      this.opacity = 1;
    }

    // 333333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333333
    // 333333333333333333333333333333333333333333333333333
    // -----------------    Methods    -------------------
    // -----------------    Methods    -------------------
    // -----------------    Methods    -------------------
    // -----------------------
    // Method 1: Draw MiniStar
    // -----------------------
    draw() {
      c.save();
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      c.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`; // this.color;
      if (isShadow) {
        c.shadowColor = '#e3eaef';
        c.shadowBlur = 20;
      }
      c.fill(); // Comment this out for a hollow shape
      // c.strokeStyle = "black";
      // c.stroke();
      c.restore();
    }
    // ----------------
    // Method 2: Update
    // ----------------
    update() {
      // ----------------------------------------
      // Step A: Define hitting walls conditional
      // ----------------------------------------
      // Mini-Step 1: Reverse y direction upon hitting floor
      if (this.y + this.radius + this.dy > height - groundHeight) {
        this.dy = -this.dy * this.elasticity;
      } else {
        this.dy = this.dy + this.gravity;
      }
      // Mini-Step 4: Define object's Velocity
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;
      // Mini-Step 5: Reduce Time To Live
      this.timeToLive = this.timeToLive - 1;
      this.opacity = this.opacity - 1 / this.timeToLive; // 0.01
      // Mini-Step 6: Define Interactivity
      // ----------------------------
      // ----- Insert code here -----
      // ----- Insert code here -----
      // ----- Insert code here -----
      // ----------------------------
      // Step D: Draw it
      this.draw();
    }
  }

  // 333333333333333333333333333333333333333333333333333
  // 333333333333333333333333333333333333333333333333333
  // 333333333333333333333333333333333333333333333333333
  // 333333333333333333333333333333333333333333333333333
  // 333333333333333333333333333333333333333333333333333
  // 333333333333333333333333333333333333333333333333333
  // ------    Phase 3: Declaring Functions    ---------
  // ------    Phase 3: Declaring Functions    ---------
  // ------    Phase 3: Declaring Functions    ---------

  function createMountainRange(numOfMountains, mountainHeight, color) {
    const mountainWidth = width / numOfMountains;
    for (let i = 0; i < numOfMountains; i++) {
      bgCtx.beginPath();
      bgCtx.moveTo(i * mountainWidth, height);
      bgCtx.lineTo(i * mountainWidth + mountainWidth + 325, height);
      bgCtx.lineTo(i * mountainWidth + mountainWidth / 2, height - mountainHeight);
      bgCtx.lineTo(i * mountainWidth - 325, height);
      bgCtx.fillStyle = color;
      bgCtx.fill();
      bgCtx.closePath();
    }
  }

  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // --------    Phase 4: Event Listeners    -----------
  // --------    Phase 4: Event Listeners    -----------
  // --------    Phase 4: Event Listeners    -----------
  // There are none in StarShower.js

  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // --------     Phase 5: Implementation     ----------
  // --------     Phase 5: Implementation     ----------
  // --------     Phase 5: Implementation     ----------
  // A: Constant background gradient
  const backGroundGradient = c.createLinearGradient(0, 0, 0, height);
  backGroundGradient.addColorStop(0, '#171E26');
  backGroundGradient.addColorStop(1, '#3f586b');

  // B: Create Background Stars
  for (let i = 0; i < numOfBgStars; i++) {
    const radius = 1 + Math.random() * 5;
    const x = Math.random() * width;
    const y = Math.random() * height;
    backgroundStarsArr.push(new Star(x, y, radius, '#e3eaef', 0, 0, 0, 0));
  }

  // C: Create Shooting Stars
  for (let i = 0; i < numOfBalls; i++) {
    const radius = 8 + Math.random() * 40;
    const x = radius + Math.random() * (width - 2 * radius);
    const y = radius + Math.random() * (height / 3 - radius);
    const dx = (Math.random() - 0.5) * 10;
    const dy = 2;
    const elasticity = 0.7 + Math.random() * 0.29; // (100% - percentage of energy Loss from hitting ground)
    starsArr.push(new Star(x, y, radius, '#e3eaef', dx, dy, gravity, elasticity));
  }

  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // -----    Phase 6: Draw Fixed Background     -------
  // -----    Phase 6: Draw Fixed Background     -------
  // -----    Phase 6: Draw Fixed Background     -------
  const k = c;
  c = bgCtx;

  // Step 1: Paint Fixed Gradient Background
  bgCtx.fillStyle = backGroundGradient;
  bgCtx.fillRect(0, 0, width, height);

  // Step 2: Draw Background Stars
  for (let i = 0; i < backgroundStarsArr.length; i++) {
    backgroundStarsArr[i].draw();
  }
  c = k;

  // Step 3: Draw Mountains
  createMountainRange(1, height - 50, '#384551');
  createMountainRange(2, height - 100, '#2B3843');
  createMountainRange(3, height - 300, '#26333E');

  // Step 4: Draw Floor
  bgCtx.fillStyle = '#182028';
  bgCtx.fillRect(0, height - groundHeight, width, groundHeight);

  // 777777777777777777777777777777777777777777777777777
  // 777777777777777777777777777777777777777777777777777
  // 777777777777777777777777777777777777777777777777777
  // 777777777777777777777777777777777777777777777777777
  // 777777777777777777777777777777777777777777777777777
  // 777777777777777777777777777777777777777777777777777
  // 777777777777777777777777777777777777777777777777777
  // -----     Phase 7: Start Animation Loop     -------
  // -----     Phase 7: Start Animation Loop     -------
  // -----     Phase 7: Start Animation Loop     -------
  function animate() {
    // Step 1: Clear Drawing Board / Draw Background
    c.clearRect(0, 0, width, height);

    // Step 2: Draw Shooting Stars
    for (let i = 0; i < starsArr.length; i++) {
      if (starsArr[i].radius - shrinkFactor <= 1) {
        starsArr.splice(i, 1);
        i = i - 1;
      } else {
        starsArr[i].update();
      }
    }

    // Step 3: Draw Explosion MiniStars
    for (let i = 0; i < miniStarsArr.length; i++) {
      if (miniStarsArr[i].timeToLive === 0) {
        miniStarsArr.splice(i, 1);
        i = i - 1;
      } else {
        miniStarsArr[i].update();
      }
    }

    // Step 4: Random Spawn of Shooting stars
    ticker = ticker + 1;
    if (ticker % randomSpawnRate === 0) {
      const radius = 8 + Math.random() * 40;
      const x = radius + Math.random() * (width - 2 * radius);
      const y = radius + Math.random() * (height / 3 - radius);
      const dx = (Math.random() - 0.5) * 10;
      const dy = 2;
      const elasticity = 0.7 + Math.random() * 0.29; // (100% - percentage of energy Loss from hitting ground)
      starsArr.push(new Star(x, y, radius, '#e3eaef', dx, dy, gravity, elasticity));
      randomSpawnRate = Math.floor(200 + (Math.random() - 0.5) * 40);
      ticker = 1;
    }

    // Step Last: Animation Loop
    requestAnimationFrame(animate);
  }
  animate();
}
