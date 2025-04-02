export const Config = {
  balance: {
    initial: 100,
    spinCost: 1,
  },

  payouts: {
    twoOfAKindMultiplier: 2,
    threeOfAKindMultiplier: 3,
  },

  ui: {
    spinButtonPosition: { x: 400, y: 550 },
    balanceTextPosition: { x: 20, y: 20 },
    winTextPosition: { x: 20, y: 60 },
  },

  render: {
    screen: { land: { width: 1920, height: 1080 }, port: { width: 1080, height: 1920 } },
    background: '#000000',
    resizeTo: window,
    sharedTicker: true,
    autoDensity: true,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  },

  assets: {
    game: ['assets/atlas/game/game-0.json'],
  },
  reel: {
    x: 960,
    y: 400,
    symbols: ['SYM01', 'SYM02', 'SYM03', 'SYM04', 'SYM05', 'SYM06'],
    speed: 20,
    turboSpeed: 100,
    spinDuration: 3,
    quickStopDuration: 200,
    symbolSize: 150,
    visibleCount: 3,
    startTweenDuration: 0.25,
    endTweenDuration: 1,
    startEase: 'power2.out',
    endEase: 'Back.easeIn.config(1)',
    endOffset: 3,
    turboSpinTime: 0.5,
    totalSpinTime: 3,

    reelsStrip: [
      'SYM01',
      'SYM05',
      'SYM01',
      'SYM03',
      'SYM04',
      'SYM03',
      'SYM02',
      'SYM04',
      'SYM03',
      'SYM06',
      'SYM03',
      'SYM01',
      'SYM06',
      'SYM01',
      'SYM02',
      'SYM01',
      'SYM02',
      'SYM02',
      'SYM02',
      'SYM01',
      'SYM02',
      'SYM01',
      'SYM04',
      'SYM01',
      'SYM03',
      'SYM06',
      'SYM01',
      'SYM03',
      'SYM02',
      'SYM05',
      'SYM03',
      'SYM01',
      'SYM02',
      'SYM02',
      'SYM02',
      'SYM01',
      'SYM04',
      'SYM01',
      'SYM04',
      'SYM01',
      'SYM03',
      'SYM02',
      'SYM04',
      'SYM04',
      'SYM05',
      'SYM02',
      'SYM03',
      'SYM01',
      'SYM01',
      'SYM01',
      'SYM04',
      'SYM05',
      'SYM02',
      'SYM02',
      'SYM02',
      'SYM01',
      'SYM05',
      'SYM06',
      'SYM01',
      'SYM03',
      'SYM04',
      'SYM02',
      'SYM05',
      'SYM02',
      'SYM01',
      'SYM05',
      'SYM01',
      'SYM02',
      'SYM01',
      'SYM01',
      'SYM01',
      'SYM04',
      'SYM04',
      'SYM03',
      'SYM03',
      'SYM05',
      'SYM05',
      'SYM04',
      'SYM02',
      'SYM05',
      'SYM02',
      'SYM01',
      'SYM03',
      'SYM02',
      'SYM03',
      'SYM01',
      'SYM04',
      'SYM03',
      'SYM04',
      'SYM02',
      'SYM03',
      'SYM04',
      'SYM01',
      'SYM01',
      'SYM01',
      'SYM02',
      'SYM06',
      'SYM03',
      'SYM02',
      'SYM03',
      'SYM01',
      'SYM05',
    ],
  },

  scene: {
    name: 'MainScene',
    objects: [
      {
        name: 'bg',
        class: 'Sprite',
        texture: 'bg',
        anchor: { x: 0.5, y: 0.5 },
        land: { x: 960, y: 540, scale: 2 },
        port: { x: 540, y: 960, scale: 2 },
      },
      {
        name: 'spinButton',
        class: 'SpinButton',
        texture: 'PLAY',
        anchor: { x: 0.5, y: 0.5 },
        land: { x: 1600, y: 740, scale: 1 },
        port: { x: 540, y: 1560, scale: 1 },
      },
      {
        name: 'title',
        class: 'Text',
        text: {
          text: 'SLOT GAME',
          style: {
            fontFamily: 'Impact, Charcoal, sans-serif',
            fontSize: 100,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 'rgb(152, 137, 250)',
            stroke: { color: 'rgb(122, 43, 43)', width: 1, join: 'round' },
            dropShadow: {
              color: 'rgb(0, 0, 0, 0.5)',
              blur: 4,
              angle: Math.PI / 6,
              distance: 6,
            },
          },
        },
        anchor: { x: 0.5, y: 0 },
        land: { x: 960, y: 50, scale: 1 },
        port: { x: 540, y: 50, scale: 0.8 },
      },
      {
        name: 'reel',
        class: 'Reel',
        land: { x: 960, y: 350, scale: 1.5 },
        port: { x: 540, y: 600, scale: 2 },
      },

      {
        name: 'Banance_bg',
        class: 'Sprite',
        texture: 'Banance_bg',
        anchor: { x: 0.5, y: 0.5 },
        land: { x: 1620, y: 980, scale: 0.7 },
        port: { x: 840, y: 1800, scale: 0.7 },
      },
      {
        name: 'LabelBalance',
        class: 'Text',
        text: {
          text: '100$',
          style: {
            fontFamily: 'Impact, Charcoal, sans-serif',
            fontSize: 50,

            fill: 'rgb(255, 255, 255)',
            stroke: { color: 'rgb(0, 0, 0)', width: 2, join: 'round' },
          },
        },
        anchor: { x: 0.5, y: 0.5 },
        land: { x: 1670, y: 975, scale: 0.8 },
        port: { x: 870, y: 1795, scale: 0.8 },
      },
      {
        name: 'winLabel',
        class: 'Text',
        text: {
          text: 'WIN:0$',
          style: {
            fontFamily: 'Impact, Charcoal, sans-serif',
            fontSize: 50,

            fill: 'rgb(255, 255, 255)',
            stroke: { color: 'rgb(0, 0, 0)', width: 2, join: 'round' },
          },
        },
        anchor: { x: 0.5, y: 0.5 },
        land: { x: 960, y: 975, scale: 0.8 },
        port: { x: 540, y: 1400, scale: 0.8 },
      },
    ],
  },
};

export type RenderConfig = {
  screen: {
    land: { width: number; height: number };
    port: { width: number; height: number };
  };
  background: string;
  resizeTo: Window;
  sharedTicker: boolean;
};

export type GameConfig = {
  balance: {
    initial: number;
    spinCost: number;
  };
  reel: {
    reelsStrip: string[];
    spinDuration: number;
    quickStopDuration: number;
    symbolSize: number;
    visibleCount: number;
  };
  payouts: {
    twoOfAKindMultiplier: number;
    threeOfAKindMultiplier: number;
  };
  ui: {
    spinButtonPosition: { x: number; y: number };
    balanceTextPosition: { x: number; y: number };
    winTextPosition: { x: number; y: number };
  };
  render: RenderConfig;
};
