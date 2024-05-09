export function engine(mainCanvas, mainSize) {
  // 111111111111111111111111111111111111111111111111111
  // -----  Phase 1: Declaring Global Parameters  ------

  const c = mainCanvas.getContext('2d');
  mainCanvas.height = mainSize.height;
  mainCanvas.width = mainSize.width;
  const { width } = mainSize;
  const { height } = mainSize;
  // -----------  Play around with these  -------------
  const color = 'rgba(200,200,200,1)'; // cannonBall Color
  const radius = 5; // cannonBall Radius
  const dr = 23; // cannonBall Speed
  const numOfFireworks = 100;
  // const numOfFireworks2 = 50 + 100 + 50; //It's the big one.
  const minLength = width > 600 ? 3 : 1;
  const maxLength = width > 600 ? 8 : 4;

  const fstBigMin = width > 600 ? 1 : 1;
  const fstBigMax = width > 600 ? 8 : 4;

  const sndBigMin = fstBigMax;
  const sndBigMax = width > 600 ? 6 : 3;

  const trdBigMin = sndBigMin + sndBigMax;

  let ticker = 1;
  let randomSpawnRate = 150;
  // ------------------------------------------------
  const MathRand = Math.random;
  const twoPie = 2 * Math.PI;

  // 222222222222222222222222222222222222222222222222222
  // -------    Phase 2: Declaring Objects    ----------
  function Channel(audio_uri) {
    this.audio_uri = audio_uri;
    this.resource = new Audio(audio_uri);
  }

  Channel.prototype.play = function () {
    // Try refreshing the resource altogether
    this.resource.play();
  };

  function Switcher(audio_uri, num) {
    this.channels = [];
    this.num = num;
    this.index = 0;
    for (let i = 0; i < num; i++) {
      this.channels.push(new Channel(audio_uri));
    }
  }

  Switcher.prototype.play = function () {
    this.channels[this.index++].play();
    this.index = this.index < this.num ? this.index : 0;
  };

  // class GameSound {
  //   constructor() {
  //     this.booms = [];
  //     this.hisses = [];
  //     this.launches = [];
  //     this.booms.push(new Switcher('1 - Resources/SoundEffects/b1.m4a', 1));
  //     this.booms.push(new Switcher('1 - Resources/SoundEffects/b2.m4a', 1));
  //     this.booms.push(new Switcher('1 - Resources/SoundEffects/b3.m4a', 1));
  //     this.hisses.push(new Switcher('1 - Resources/SoundEffects/h1.m4a', 1));
  //     this.launches.push(new Switcher('1 - Resources/SoundEffects/L1.m4a', 1));
  //   }
  //   playBoom() {
  //     const index = Math.floor(MathRand() * this.booms.length);
  //     this.booms[index].play();
  //   }

  //   playHiss() {
  //     const index = Math.floor(MathRand() * this.hisses.length);
  //     this.hisses[index].play();
  //   }

  //   playLaunch() {
  //     const index = Math.floor(MathRand() * this.launches.length);
  //     this.launches[index].play();
  //   }
  // }
  // sound = new GameSound();

  const cannonBallArr = [];
  const fireworksArr = [];

  class CannonBall {
    constructor(x, y, radius, color, R, theta, dr) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.R = R;
      this.theta = theta;
      this.dr = dr;
      this.drSum = 0;
      this.destReached = false;
      if (MathRand() < 0.4) {
        this.sprayEffect = 1;
      } else {
        this.sprayEffect = 0;
      }
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
      c.arc(this.x, this.y, this.radius, 0, twoPie, false);
      c.fillStyle = this.color;
      c.strokeStyle = 'white';
      c.fill();
      c.stroke(); // Order of these two matter!!!
      c.closePath();
    }
    // ----------------
    // Method 2: Update
    // ----------------
    update() {
      this.x = this.x + this.dr * Math.sin(this.theta);
      this.y = this.y + this.dr * Math.cos(this.theta);
      this.dr = this.dr * 0.98 + 0.03;
      this.drSum = this.drSum + this.dr;
      // Step: Is near destination
      if (this.drSum >= this.R) {
        this.destReached = true;
        // sound.playBoom();
        this.explode();
      }

      // Step: Draw it
      this.draw();
    }
    // -----------------
    // Method 3: Explode
    // -----------------
    explode() {
      const rnd = MathRand();

      if (rnd < 0.25) {
        for (let i = 0; i < 50; i++) {
          const color = {
            r: 55 + Math.floor(200 * MathRand()),
            g: 0,
            b: 55 + Math.floor(200 * MathRand()),
          };
          fireworksArr.push(
            new Firework(
              this.x,
              this.y,
              0.5 + MathRand() * 1.9,
              color,
              twoPie * MathRand(),
              fstBigMax * MathRand() + fstBigMin,
              this.sprayEffect,
            ),
          );
        }
        for (let i = 0; i < 100; i++) {
          const color = {
            r: 55 + Math.floor(200 * MathRand()),
            g: 0,
            b: 55 + Math.floor(200 * MathRand()),
          };
          fireworksArr.push(
            new Firework(
              this.x,
              this.y,
              0.5 + MathRand() * 1.9,
              color,
              twoPie * MathRand(),
              sndBigMax * MathRand() + sndBigMin,
              this.sprayEffect,
            ),
          );
        }
        for (let i = 0; i < 50; i++) {
          const color = {
            r: 55 + Math.floor(200 * MathRand()),
            g: 0,
            b: 55 + Math.floor(200 * MathRand()),
          };
          fireworksArr.push(
            new Firework(
              this.x,
              this.y,
              1.5 + MathRand() * 2.9,
              color,
              (i * twoPie) / 34,
              trdBigMin + MathRand(),
              this.sprayEffect,
            ),
          );
        }
      } else if (rnd < 0.5) {
        const color = {
          r: 255,
          g: 255,
          b: 255,
        };
        for (let i = 0; i < numOfFireworks; i++) {
          // 8 stars
          fireworksArr.push(
            new Firework(
              this.x,
              this.y,
              0.5 + MathRand() * 1.9,
              color,
              twoPie * MathRand(),
              maxLength * MathRand() + minLength,
              this.sprayEffect,
            ),
          );
        }
      } else if (rnd < 0.75) {
        const color = {
          r: 0,
          g: 55 + Math.floor(200 * MathRand()),
          b: 155,
        };
        for (let i = 0; i < numOfFireworks; i++) {
          // 8 stars
          fireworksArr.push(
            new Firework(
              this.x,
              this.y,
              0.5 + MathRand() * 1.9,
              color,
              twoPie * MathRand(),
              maxLength * MathRand() + minLength,
              this.sprayEffect,
            ),
          );
        }
      } else {
        for (let i = 0; i < numOfFireworks; i++) {
          // 8 stars
          const color = {
            r: 55 + Math.floor(200 * MathRand()),
            g: 55 + Math.floor(200 * MathRand()),
            b: 55 + Math.floor(200 * MathRand()),
          };
          fireworksArr.push(
            new Firework(
              this.x,
              this.y,
              0.1 + MathRand() * 2.9,
              color,
              twoPie * MathRand(),
              maxLength * MathRand() + minLength,
              this.sprayEffect,
            ),
          );
        }
      }
    }
  }
  class Firework {
    constructor(x, y, radius, color, theta, dr, sprayEffect) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.theta = theta;
      this.dr = dr;
      this.opacity = 1;
      this.sprayEffect = sprayEffect;
    }

    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, twoPie, false);
      c.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
      c.fill();
      if (this.sprayEffect === 1) {
        if (this.dr < 0.1 && MathRand() < 0.05) {
          c.strokeStyle = 'white';
          // c.stroke();
        }
      }
      c.closePath();
    }

    update() {
      if (this.dr > 0.01) {
        // A: Move piece in the direction specified
        this.x = this.x + this.dr * Math.cos(this.theta);
        this.y = this.y + this.dr * Math.sin(this.theta);

        // B: Reduce Speed a tiny bit
        this.dr = this.dr * 0.96;

        // C: Once it's slow enough start dropping the opacity
        if (this.dr < 0.1) {
          // Set the initial drop:
          this.y = this.y * 1.0008;
          this.opacity = this.opacity * 0.99;
        }
      } else {
        // D: Drop pieces directly down once they're moving really slow
        this.y = this.y + 0.35;
        this.opacity = this.opacity * 0.84;
      }

      this.draw();
    }
  }

  // 333333333333333333333333333333333333333333333333333
  // ------    Phase 3: Declaring Functions    ---------

  function launchFirework(destX, destY) {
    // sound.playLaunch();
    // Prepare the cannonBall:
    const x = width / 2;
    const y = height;
    const diffX = destX - x;
    const diffY = destY - y;
    const R = Math.sqrt(diffX ** 2 + diffY ** 2);
    const theta = -Math.atan2(diffY, diffX) + twoPie / 4; //
    cannonBallArr.push(new CannonBall(x, y, radius, color, R, theta, dr));
  }

  // 444444444444444444444444444444444444444444444444444
  // --------    Phase 4: Event Listeners    -----------

  mainCanvas.addEventListener('click', (e) => {
    const { offsetX: positionX, offsetY: positionY } = e;
    launchFirework(positionX, positionY);
  });

  // 666666666666666666666666666666666666666666666666666
  // -----     Phase 6: Start Animation Loop     -------
  function animate() {
    // c.globalCompositeOperation = "source-over";

    // Step 1: Clear Drawing Board / Draw Background
    // c.clearRect(0, 0, width, height);
    c.fillStyle = 'rgba(0,8,12,0.3)'; // black
    c.fillRect(0, 0, width, height);
    // c.globalCompositeOperation = "lighter";
    // Step 2: Draw CannonBalls

    // Step 2: Draw Shooting Stars
    for (let i = 0; i < cannonBallArr.length; i++) {
      if (cannonBallArr[i].destReached) {
        cannonBallArr.splice(i, 1);
        i = i - 1;
      } else {
        cannonBallArr[i].update();
      }
    }

    // Step 3: Draw CannonBalls' Explosion into Fireworks
    for (let i = 0; i < fireworksArr.length; i++) {
      if (fireworksArr[i].opacity <= 0.1) {
        fireworksArr.splice(i, 1);
        i = i - 1;
      } else {
        fireworksArr[i].update();
      }
    }

    // Step 4: Random Spawn of CannonBalls
    ticker = ticker + 1;
    if (ticker % randomSpawnRate === 0) {
      const x = 100 + Math.floor(MathRand() * (width - 200));
      const y = 100 + Math.floor(MathRand() * (height / 2));
      launchFirework(x, y);
      randomSpawnRate = Math.floor(1 + MathRand() * 200);
      ticker = 1;
    }

    requestAnimationFrame(animate);
  }
  animate();
}
