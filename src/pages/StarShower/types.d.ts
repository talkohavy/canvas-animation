export type AnimationSettings = {
  moonStar: {
    drawProps: {
      color: string;
      borderColor: string;
      shadowColor: string;
      shadowBlur: number;
    };
    gravity: number;
    elasticity: number;
    shrinkFactor: number;
    explode: {
      miniStarsCount: number;
    };
  };
  miniStar: {
    drawProps: {
      color: string;
      shadowColor: string;
      shadowBlur: number;
    };
    gravity: number;
    elasticity: number;
  };
  general: {
    gravity: number;
    randomSpawnRate: number;
    initialMoonStarsCount: number;
  };
  background: {
    groundHeight: number;
    starsCount: number;
  };
  rollFriction: number;
  minInRadians: number;
  maxInRadians: number;
  maxBoomPower: number;
};

export type MiniStarProps = SharedStarProps;

export type MoonStarProps = SharedStarProps;

export type SharedStarProps = {
  ctx: CanvasRenderingContext2D;
  animationSettings: AnimationSettings;
  x: number;
  y: number;
  radius: number;
  dx?: number;
  dy?: number;
  boundingBox: { width: number; height: number };
  onExplode?: (props: any) => void;
};
