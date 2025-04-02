import { Assets } from 'pixi.js';
import { Renderer } from 'Core/Renderer/Render';
import { SceneManager } from 'Core/Scenes/SceneFactory';
import { Config } from './config';
import { StateMachine } from 'Core/States/StateMachine';
import { SpinningAction } from 'Core/States/Actions/SpinningAction';
import 'Core/Components';
import { GameModel } from 'Core/Models/GameModel';

(async () => {
  const app = new Renderer();
  await app.init(Config.render);

  document.getElementById('pixi-container')?.appendChild(app.canvas);
  app.addResizeListener();

  await Assets.load(Config.assets.game);
  await initGame(app);
})();

async function initGame(app: Renderer) {
  const gameModel = GameModel.getInstance();

  setupStateMachine();
  createSceneObjects();

  const scene = SceneManager.getInstance().loadScene('MainScene');
  if (!scene) return;

  attachGameViews(gameModel);
  app.camera.addChild(scene);
}

function setupStateMachine() {
  const stateMachine = new StateMachine();
  stateMachine.registerAction('spinning', new SpinningAction('spinning'));

  stateMachine.onStateChange(({ prevState, newState }) => {
    console.log(`State changed from ${prevState} to ${newState}`);
  });

  stateMachine.transition('spinning');
  stateMachine.transition('result');
  stateMachine.transition('idle');
}

function createSceneObjects() {
  SceneManager.getInstance().createScene({
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
          text: 'BASIC SLOT GAME',
          style: {
            fontFamily: 'Impact, Charcoal, sans-serif',
            fontSize: 100,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 'rgb(152, 137, 250)',
            stroke: { color: 'rgb(122, 43, 43)', width: 1, join: 'round' },
            dropShadow: {
              color: 'rgba(0, 0, 0, 0.5)',
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
  });
}

function attachGameViews(gameModel: GameModel) {
  const sceneName = 'MainScene';
  const sceneManager = SceneManager.getInstance();

  const balanceText = sceneManager.getObjectByName(sceneName, 'LabelBalance');
  const winText = sceneManager.getObjectByName(sceneName, 'winLabel');

  if (!balanceText) {
    console.error('Balance view not found!');
  } else {
    gameModel.setBalanceView(balanceText);
  }

  if (!winText) {
    console.error('Win view not found!');
  } else {
    gameModel.setWinView(winText);
  }
}
