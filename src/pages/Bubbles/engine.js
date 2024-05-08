export function engine(mainCanvas, mainSize) {
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // 111111111111111111111111111111111111111111111111111
  // -----  Phase 1: Declaring Global Parameters  ------
  // -----  Phase 1: Declaring Global Parameters  ------
  // -----  Phase 1: Declaring Global Parameters  ------
  const c = mainCanvas.getContext('2d');
  mainCanvas.height = mainSize.height;
  mainCanvas.width = mainSize.width;
  const { width } = mainSize;
  const { height } = mainSize;
  // -----------  Play around with these  --------------
  const growthRate = 1;
  const minRadius = 2;
  const minSpace = 4;
  const loop = 10;
  // ---------------------------------------------------
  const MathRand = Math.random;
  const twoPie = 2 * Math.PI;
  let runner = 0;
  let circleID = 1;
  const circleArr = [];
  // ---------------------------------------------------

  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // -------    Phase 2: Declaring Objects    ----------
  // -------    Phase 2: Declaring Objects    ----------
  // -------    Phase 2: Declaring Objects    ----------

  class Circle {
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
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = minRadius;
      this.canGrow = true;
      this.id = circleID;
      circleID = circleID + 1;
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
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, twoPie, true);
      // c.shadowColor = "white";
      // c.shadowBlur = 5;
      // c.fillStyle = "white";
      // c.fill();
      c.lineWidth = 2;
      c.strokeStyle = 'white';
      c.stroke();
      c.closePath();
    }

    // ----------------
    // Method 2: Update
    // ----------------
    update() {
      if (this.canGrow) {
        if (
          this.x + this.radius + minSpace > width ||
          this.x - this.radius - minSpace < 0 ||
          this.y + this.radius + minSpace > height ||
          this.y - this.radius - minSpace < 0
        ) {
          this.canGrow = false;
        } else {
          for (let i = 0; i < circleArr.length; i++) {
            if (this.id !== circleArr[i].id) {
              const diffX = this.x - circleArr[i].x;
              const diffY = this.y - circleArr[i].y;
              const distance = Math.sqrt(diffX * diffX + diffY * diffY);
              if (distance <= this.radius + circleArr[i].radius + minSpace) {
                this.canGrow = false;
                break;
              }
            }
          }
          if (this.canGrow) {
            this.radius = this.radius + growthRate;
          }
        }
      }

      // Step 10: Draw particle
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

  function tryToAddCircle() {
    const x = minRadius + MathRand() * (width - minRadius * 2);
    const y = minRadius + MathRand() * (height - minRadius * 2);
    let validPoint = true;
    for (let i = 0; i < circleArr.length; i++) {
      const diffX = x - circleArr[i].x;
      const diffY = y - circleArr[i].y;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY);
      if (distance < circleArr[i].radius + minRadius + minSpace) {
        validPoint = false;
        break;
      }
    }
    if (validPoint) {
      circleArr.push(new Circle(x, y));
    }
  }

  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // --------     Phase 4: Implementation     ----------
  // --------     Phase 4: Implementation     ----------
  // --------     Phase 4: Implementation     ----------

  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // -----     Phase 5: Start Animation Loop     -------
  // -----     Phase 5: Start Animation Loop     -------
  // -----     Phase 5: Start Animation Loop     -------
  function animate() {
    // Step 1: Clear Drawing Board / Draw Background
    // c.globalCompositeOperation = "source-over";
    c.fillStyle = 'rgba(0,8,12,1)'; // black
    c.fillRect(0, 0, width, height);
    // c.globalCompositeOperation = "lighter";

    // Step 2: Draw Circles
    for (let i = 0; i < circleArr.length; i++) {
      circleArr[i].update();
    }

    if (runner % loop === 1) {
      for (let i = 0; i < 8; i++) {
        tryToAddCircle();
      }
    }
    runner = (runner + 1) % loop;

    // Last Step: Loop over & over
    requestAnimationFrame(animate);
  }
  animate();
}
