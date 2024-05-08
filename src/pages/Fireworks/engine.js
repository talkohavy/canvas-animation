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
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // 222222222222222222222222222222222222222222222222222
  // -------    Phase 2: Declaring Objects    ----------
  // -------    Phase 2: Declaring Objects    ----------
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
  class MyNode {
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
    constructor(entity) {
      this.entity = entity;
      this.prevNode = null;
      this.nextNode = null;
    }
    // --------
    // Method 1: Get Entity
    // --------
    GetEntity() {
      return this.entity;
    }
    // --------
    // Method 2: Set Entity
    // --------
    SetEntity(entity) {
      this.entity = entity;
    }
    // --------
    // Method 3: Get Prev
    // --------
    GetPrev() {
      return this.prevNode;
    }
    // --------
    // Method 4: Set Prev
    // --------
    SetPrev(prevNode) {
      this.prevNode = prevNode;
    }
    // --------
    // Method 5: Get Next
    // --------
    GetNext() {
      return this.nextNode;
    }
    // --------
    // Method 6: Set Next
    // --------
    SetNext(nextNode) {
      this.nextNode = nextNode;
    }
    // --------
    // Method 7: to String
    // --------
    ToString() {
      return `${this.entity.ToString()}`;
    }
  }
  class MyList {
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
    constructor() {
      this.first = null;
      this.last = null;
      this.size = 0;
    }

    // 33333333333333333333333333333333333333333
    // 33333333333333333333333333333333333333333
    // 33333333333333333333333333333333333333333
    // 33333333333333333333333333333333333333333
    // --------------- Methods -----------------
    // --------------- Methods -----------------
    // --------------- Methods -----------------

    // ------------------
    // Method 1: Get Head
    // ------------------
    GetFirst() {
      return this.first;
    }
    // ------------------
    // Method 2: Get Tail
    // ------------------
    GetLast() {
      return this.last;
    }
    // ---------------------
    // Method 3: Set as Head
    // ---------------------
    SetFirst(node) {
      this.first = node;
    }
    // ---------------------
    // Method 4: Set as Tail
    // ---------------------
    SetLast(node) {
      this.last = node;
    }
    // ------------------------
    // Method 5: Pull from Head
    // ------------------------
    Deque() {
      if (this.size > 1) {
        this.first = this.first.GetNext();
        this.first.SetPrev(null);
      } else {
        this.first = null;
        this.last = null;
      }
      this.size = this.size - 1;
    }
    // ------------------------
    // Method 6: Pull from Tail
    // ------------------------
    DequeLast() {
      this.last = this.last.GetPrev();
      if (this.last === null) {
        this.first = null;
      } else {
        this.last.SetNext(null);
      }
      this.size = this.size - 1;
    }
    // ----------------------
    // Method 7: Push to Tail
    // ----------------------
    Enque(entity) {
      const toBeInserted = new MyNode(entity);
      if (this.size > 0) {
        toBeInserted.SetPrev(this.last);
        toBeInserted.SetNext(null);
        this.last.SetNext(toBeInserted);
        this.last = toBeInserted;
      } else {
        this.first = toBeInserted;
        this.last = toBeInserted;
        this.last.SetNext(null);
        this.first.SetPrev(null);
      }
      this.size = this.size + 1;
    }
    // ---------------------
    // Method 8: Smart Enque
    // ---------------------
    SmartEnque(entity) {
      // Note: This algorithm is starting from } to beginning.
      const toBeInserted = new MyNode(entity);
      let iNod = this.last;
      let isInserted = false;
      // Step 1: Search insert position (n-1 places).
      for (let i = 0; i < this.size; i++) {
        // is this the one?
        if (entity.data >= iNod.GetEntity().data) {
          // Yes! Set 4 pointers.
          toBeInserted.SetPrev(iNod);
          toBeInserted.SetNext(iNod.GetNext());
          iNod.SetNext(toBeInserted);
          // is position last?
          if (toBeInserted.GetNext() === null) {
            // Yes! toBeInserted is now last.
            this.last = toBeInserted;
          } else {
            // No! can do SetNext to prev.
            toBeInserted.GetNext().SetPrev(toBeInserted);
          }
          isInserted = true;
          break;
        }
        iNod = iNod.GetPrev();
      }
      if (!isInserted) {
        // Meaning: entity.data < this.first.GetEntity.data
        toBeInserted.SetPrev(null);
        toBeInserted.SetNext(this.first);
        // was list empty before insertion?
        if (this.first === null) {
          // Yes! Update this.last
          this.last = toBeInserted;
        } else {
          // No! you can setPrev.
          this.first.SetPrev(toBeInserted);
        }
        this.first = toBeInserted;
      }
      this.size = this.size + 1;
    }
    // ---------------------
    // Method 9: InsertAfter
    // ---------------------
    InsertAfter(afterWho, data) {
      // Return the iNod created with the entity+data inside it.
      const toBeInserted = new MyNode(data);
      let ret = null;
      if (afterWho === null) {
        toBeInserted.SetPrev(null);
        toBeInserted.SetNext(this.first);
        this.first.SetPrev(toBeInserted);
        this.first = toBeInserted;
        ret = toBeInserted;
      } else {
        toBeInserted.SetNext(afterWho.GetNext());
        toBeInserted.SetPrev(afterWho);
        afterWho.SetNext(toBeInserted);
        if (toBeInserted.GetNext() === null) {
          this.last = toBeInserted;
        } else {
          toBeInserted.GetNext().SetPrev(toBeInserted);
          ret = toBeInserted;
        }
      }
      this.size = this.size + 1;
      return ret;
    }
    // -----------------------
    // Method 10: Remove known
    // -----------------------
    RemoveKnown(iNodRemoved) {
      // Check if it's the first node:
      if (iNodRemoved.GetPrev() === null) {
        // Yes! this.first is moved 1 up.
        this.first = this.first.GetNext();
        // Check if size>1:
        if (this.first === null) {
          // No! size now equals to 1. Therefore...
          this.last = null;
        } else {
          this.first.SetPrev(null);
        }
      } else {
        // No! it's not the first.
        const prev = iNodRemoved.GetPrev();
        const next = iNodRemoved.GetNext();
        prev.SetNext(next);
        // Check if it's the last:
        if (next === null) {
          // Yes! last need to move 1 before.
          this.last = prev;
        } else {
          // No! we can set prev.
          next.SetPrev(prev);
        }
      }
      this.size = this.size - 1;
    }
    // -------------------------
    // Method 11: Remove Unknown
    // -------------------------
    RemoveUnknown(data) {
      // Note 1: Assumes an iNod with data exists. Therefore, a delete
      // action is guaranteed.
      // Check if it's the first node:
      const ret = null;
      if (this.first.GetEntity().data === data) {
        // this.first pointer is moved 1 up:
        this.first = this.first.GetNext();
        // Check if size>1:
        if (this.first === null) {
          // No! size now equals to 1. Update this.last:
          this.last = null;
        } else {
          // Yes! can setPrev
          this.first.SetPrev(null);
        }
      } else {
        // No! it's not the first. We need to find it:
        let iNodRemoved = this.first.GetNext();
        for (let i = 1; i < this.size; i++) {
          // Is this the one?
          if (iNodRemoved.GetEntity().data === data) {
            // Yes!
            const prev = iNodRemoved.GetPrev();
            const next = iNodRemoved.GetNext();
            prev.SetNext(next);
            // Check if it's the last:
            if (next === null) {
              // Yes! last need to move 1 before.
              this.last = prev;
            } else {
              // No! we can set prev.
              next.SetPrev(prev);
            }
            break;
          }
          iNodRemoved = iNodRemoved.GetNext();
        }
      }
      this.size = this.size - 1;
      return ret;
    }
    // ------------------------------
    // Method 12: Concatenate 2 Lists
    // ------------------------------
    ConnectHead2Tail(lst) {
      this.last.SetNext(lst.first);
      lst.first.SetPrev(this.last);
      this.SetLast(lst.last);
    }
    // -------------------
    // Method 13: Contains
    // -------------------
    Contains(data) {
      let iNod = this.first;
      let flag = false;
      for (let i = 0; i < this.size; i++) {
        if (iNod.GetEntity().data === data) {
          flag = true;
          break;
        }
        iNod = iNod.GetNext();
      }
      return flag;
    }
    // -------------------
    // Method 14: Contains
    // -------------------
    ContainsAt(value, j) {
      let iNod = this.first;
      let flag = false;
      for (let i = 0; i < this.size; i++) {
        if (iNod.GetEntity().GetArrValue(j) === value) {
          flag = true;
          break;
        }
        iNod = iNod.GetNext();
      }
      return flag;
    }
    // -------------------------
    // Method 15: Insertion Sort
    // -------------------------
    InsertionSort() {
      let iNod = this.first;
      if (iNod !== null && iNod.GetNext() !== null) {
        iNod = iNod.GetNext();
        // Step 1: Sort n-1 elements.
        while (iNod.GetNext() !== null) {
          // A. Remember your place:
          const continueFrom = iNod.GetNext();
          // B. Disconnect iNod:
          iNod.GetPrev().SetNext(iNod.GetNext());
          iNod.GetNext().SetPrev(iNod.GetPrev());
          // C. Check backwards
          let jNod = iNod.GetPrev();
          while (jNod !== null && iNod.GetEntity().data < jNod.GetEntity().data) {
            jNod = jNod.GetPrev();
          }
          // D. if reached 0...
          if (jNod === null) {
            // Connect iNod to beginning
            iNod.SetNext(this.first);
            iNod.SetPrev(null);
            this.first.SetPrev(iNod);
            this.first = iNod;
          } else {
            // Connect iNod after jNod
            iNod.SetNext(jNod.GetNext());
            iNod.SetPrev(jNod);
            jNod.GetNext().SetPrev(iNod);
            jNod.SetNext(iNod);
          }
          iNod = continueFrom;
        }
        // Step 4: Check the last one.
        iNod = this.last;
        let jNod = iNod.GetPrev();
        if (iNod.GetEntity().data < jNod.GetEntity().data) {
          // Step 5: jNod is now new Last.
          this.last = jNod;
          this.last.SetNext(null);
          // C. Check backwards
          jNod = jNod.GetPrev();
          while (jNod !== null && iNod.GetEntity().data < jNod.GetEntity().data) {
            jNod = jNod.GetPrev();
          }
          // D. if reached 0...
          if (jNod === null) {
            // Connect iNod to beginning
            iNod.SetNext(this.first);
            iNod.SetPrev(null);
            this.first.SetPrev(iNod);
            this.first = iNod;
          } else {
            // Connect iNod after jNod
            iNod.SetNext(jNod.GetNext());
            iNod.SetPrev(jNod);
            jNod.GetNext().SetPrev(iNod);
            jNod.SetNext(iNod);
          }
        }
      }
    }
    // ----------------------
    // Method 16: Revert List
    // ----------------------
    ReverseMe() {
      // Note: Nodes remain in their places! nextNode and prevNode
      // pointers remain untouched! Only thing done here is the
      // replacing of pointers on entities.
      const howManySwitches = this.size / 2; // it does flooring anyway because int.
      let st = this.first;
      let ed = this.last;
      for (let i = 0; i < howManySwitches; i++) {
        const saver = st.GetEntity;
        st.SetEntity(ed.GetEntity);
        ed.SetEntity(saver);
        st = st.nextNode;
        ed = ed.prevNode;
      }
    }
    // --------------------
    // Method 17: To String
    // --------------------
    ToString() {
      let str = '[';
      let iNod = this.first;
      while (iNod !== null) {
        str = str + iNod.GetEntity().data;
        if (iNod.GetNext() !== null) {
          str = `${str},`;
        }
        iNod = iNod.GetNext();
      }
      str = `${str}]`;
      return str;
    }
    // ----------------
    // Method 18: Clone
    // ----------------
    Clone() {
      const clonedList = new MyList();
      let iNod = this.first;
      for (let i = 0; i < this.size; i++) {
        clonedList.Enque(iNod.GetEntity().Clone());
        iNod = iNod.GetNext();
      }
      return clonedList;
    }
  }
  const cannonBallArr = new MyList();
  const fireworksArr = new MyList();
  class CannonBall {
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
    constructor(x, y, radius, color, R, theta, dr) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.R = R;
      this.theta = theta;
      this.dr = dr;
      /* ---------------------*/
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
          fireworksArr.Enque(
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
          fireworksArr.Enque(
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
          fireworksArr.Enque(
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
          fireworksArr.Enque(
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
          fireworksArr.Enque(
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
          fireworksArr.Enque(
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
    constructor(x, y, radius, color, theta, dr, sprayEffect) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.theta = theta;
      this.dr = dr;
      /* ---------------------*/
      this.opacity = 1;
      this.sprayEffect = sprayEffect;
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
    // Method 1: Draw Firework
    // -----------------------
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
    // ----------------
    // Method 2: Update
    // ----------------
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

  function launchFirework(destX, destY) {
    // sound.playLaunch();
    // Prepare the cannonBall:
    const x = width / 2;
    const y = height;
    const diffX = destX - x;
    const diffY = destY - y;
    const R = Math.sqrt(diffX ** 2 + diffY ** 2);
    const theta = -Math.atan2(diffY, diffX) + twoPie / 4; //
    cannonBallArr.Enque(new CannonBall(x, y, radius, color, R, theta, dr));
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

  mainCanvas.addEventListener('click', (e) => {
    launchFirework(e.x, e.y);
  });

  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // 555555555555555555555555555555555555555555555555555
  // --------     Phase 5: Implementation     ----------
  // --------     Phase 5: Implementation     ----------
  // --------     Phase 5: Implementation     ----------

  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // 666666666666666666666666666666666666666666666666666
  // -----     Phase 6: Start Animation Loop     -------
  // -----     Phase 6: Start Animation Loop     -------
  // -----     Phase 6: Start Animation Loop     -------
  function animate() {
    // c.globalCompositeOperation = "source-over";

    // Step 1: Clear Drawing Board / Draw Background
    // c.clearRect(0, 0, width, height);
    c.fillStyle = 'rgba(0,8,12,0.3)'; // black
    c.fillRect(0, 0, width, height);
    // c.globalCompositeOperation = "lighter";
    // Step 2: Draw CannonBalls
    let iNod = cannonBallArr.GetFirst();
    while (iNod != null) {
      if (iNod.GetEntity().destReached) {
        cannonBallArr.RemoveKnown(iNod);
      } else {
        iNod.GetEntity().update();
      }
      iNod = iNod.GetNext();
    }

    // Step 3: Draw CannonBalls' Explosion into Fireworks
    iNod = fireworksArr.GetFirst();
    while (iNod != null) {
      if (iNod.GetEntity().opacity <= 0.1) {
        fireworksArr.RemoveKnown(iNod);
      } else {
        iNod.GetEntity().update();
      }
      iNod = iNod.GetNext();
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
