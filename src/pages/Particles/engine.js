export function engine(mainCanvas, mainSize) {
  const colorPalette = [
    // palette number 1:
    '#A57548',
    '#FCD7AD',
    '#F6D78B',
    '#5296A5',
    '#D0DDF0',
    // // palette number 2:
    // '#26547C',
    // '#EF476F',
    // '#FFD166',
    // '#06D6A0',
    // '#FCFCFC',
    // // palette number 3:
    // '#355070',
    // '#6D5970',
    // '#B56570',
    // '#E56B6F',
    // '#EAAC8B',
    // // palette number 4:
    // '#2d7dd2',
    // '#97cc04',
    // '#eeb902',
    // '#F45D01',
    // '#474647',
    // // palette number 5:
    // '#BCF4F5',
    // '#B4EBCA',
    // '#D9F2B4',
    // '#D3FAC7',
    // '#FFB7C3',
    // // palette number 6:
    // '#8E3B46',
    // '#E1DD8F',
    // '#E0777D',
    // '#4C86A8',
    // '#4C86A8',
    // // palette number 7:
    // '#1BE7FF',
    // '#6EEB83',
    // '#E4FF1A',
    // '#FFB800',
    // '#FF5714',
    // // palette number 8:
    // '#1B998B',
    // '#2D3047',
    // '#FFFD82',
    // '#FF9B71',
    // '#E84855',
    // // // palette number 9:
    // '#DAA89B',
    // '#AE847E',
    // '#2C0E37',
    // '#690375',
    // '#CB429F',
    // // palette number 10:
    // '#6A041D',
    // '#F5B841',
    // '#F4FF52',
    // '#53FF45',
    // '#1E2EDE',
  ];
  function particleColorGenerator() {
    const index = Math.floor(Math.random() * colorPalette.length);
    return colorPalette[index];
  }
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
  // -----------  Play around with these  -------------
  const numOfParticles = width > 600 ? 600 : 100;
  const decay = 0.985;
  const pushForce = width > 600 ? 10 : 12;
  const pullForce = width > 600 ? 0.00015 : 0.0015;
  const MaxRadius = 1;
  const bigFieldRadius = width > 600 ? 0.36 * width : 0.6 * width;
  const midFieldRadius = 0.05 * width; // 0.5
  // --------------------------------------------------
  const MathRand = Math.random;
  const MathAbs = Math.abs;
  const twoPie = 2 * Math.PI;
  const mouse = { px: 0, py: 0 };
  let clicked;
  const particleArr = [];
  // --------------------------------------------------

  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // -------    Phase 2: Declaring Objects    ----------
  // -------    Phase 2: Declaring Objects    ----------
  // -------    Phase 2: Declaring Objects    ----------

  class Particle {
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
    constructor({ x, y, dx, dy, color, size }) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.color = color;
      this.size = size;
      this.normX = 0;
      this.normY = 0;
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
      c.fillStyle = this.color;
      c.beginPath();
      c.arc(this.x, this.y, MaxRadius * this.normX, 0, twoPie, true);
      /* c.shadowColor = "white";
            c.shadowBlur = 5; */
      c.closePath();
      c.fill();
      // c.strokeStyle = "green"; //
      // c.stroke()
    }

    // ----------------
    // Method 2: Update
    // ----------------
    update() {
      // Step 1: Calc Distance from mouse
      const diffX = this.x - mouse.px;
      const diffY = this.y - mouse.py;
      let distance = Math.sqrt(diffX * diffX + diffY * diffY) || 0.001;

      // Step 2: Get normalized direction values
      this.normX = diffX / distance;
      this.normY = diffY / distance;

      let curForce = -1;
      // Step 3: If a click occurred
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
      if (this.normX < 0.1) {
        this.dx = this.dx * 3 * MathRand();
      }
      if (this.normY < 0.1) {
        this.dy = this.dy * 3 * MathRand();
      }

      // Step 8: Limit Particle's MinMax size
      this.normX = 0.45 * distance;
      this.normX = Math.max(Math.min(this.normX, 4), 0.4);

      // Step 10: Update particle's position
      this.x = this.x + this.dx;
      this.y = this.y + this.dy;

      // Step 9: Collision Detection for Walls Floor and Ceiling
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

  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // 444444444444444444444444444444444444444444444444444
  // --------    Phase 4: Event Listeners    -----------
  // --------    Phase 4: Event Listeners    -----------
  // --------    Phase 4: Event Listeners    -----------

  // -------------------
  // Event 1: Mouse Move
  // -------------------
  window.addEventListener('mousemove', (e) => {
    mouse.px = e.offsetX;
    mouse.py = e.offsetY;
  });

  // -------------------
  // Event 2: Mouse Down
  // -------------------
  window.addEventListener('mousedown', () => {
    clicked = !0;
  });

  // -----------------
  // Event 3: Mouse Up
  // -----------------
  window.addEventListener('mouseup', () => {
    clicked = !1;
  });

  // -------------------
  // Event 4: Touch Move
  // -------------------
  window.addEventListener('touchmove', (e) => {
    // If there's exactly one finger inside this element
    if (e.targetTouches.length === 1) {
      // eslint-disable-next-line
      const touch = e.targetTouches[0];
      // Place element where the finger is
      // Step 1: Get mouse position.
      mouse.px = touch.pageX;
      mouse.py = touch.pageY;
    }
  });

  // --------------------
  // Event 5: Touch Start
  // --------------------
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      clicked = !0;
    }
  });

  // ------------------
  // Event 6: Touch End
  // ------------------
  window.addEventListener('touchend', (e) => {
    if (e.touches.length <= 1) {
      clicked = !1;
    }
  });

  // 555555555555555555555555555555555555555555555555555
  // --------     Phase 5: Implementation     ----------

  for (let i = numOfParticles - 1; i + 1; i--) {
    const props = {
      x: 0.5 * width,
      y: 0.5 * height,
      dx: 34 * Math.cos(i) * MathRand(),
      dy: 34 * Math.sin(i) * MathRand(),
      /* const color = {
              r: 200,
              g: 200,
              b: 200,
          }; */
      color: particleColorGenerator(),
      size: 1,
    };
    particleArr[i] = new Particle(props);
  }

  // 666666666666666666666666666666666666666666666666666
  // -----     Phase 6: Start Animation Loop     -------
  function animate() {
    // Step 1: Clear Drawing Board / Draw Background
    // c.globalCompositeOperation = "source-over";
    c.fillStyle = 'rgba(0,8,12,0.3)'; // black
    c.fillRect(0, 0, width, height);
    // c.globalCompositeOperation = "lighter";

    // Step 2: Draw Particles
    for (let i = 0; i < numOfParticles; i++) {
      particleArr[i].update();
    }

    // Last Step: Loop over & over
    requestAnimationFrame(animate);
  }
  animate();
}
