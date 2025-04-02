import { Event } from 'Core/Managers/EventManager';
import { SceneContainer } from 'Core/Scenes/SceneObj/SceneContainer';
import { SceneSprite } from 'Core/Scenes/SceneObj/SceneSprite';
import { SceneText } from 'Core/Scenes/SceneObj/SceneText';
import { Container, TextOptions, Assets } from 'pixi.js';
import { BaseScene } from 'Core/Scenes/BaseScene';

type Mode = 'land' | 'port';

export type SceneObjectConfig = {
  name: string;
  class: string;
  texture?: string;
  anchor?: { x: number; y: number };
  text?: TextOptions;
  land: { x: number; y: number; scale: number };
  port: { x: number; y: number; scale: number };
};

type SceneConfig = {
  name: string;
  objects: SceneObjectConfig[];
};

type SceneMap = Map<string, SceneContainer>;

type ClassRegistry = {
  [key: string]: (config: SceneObjectConfig) => Container;
};

export class SceneManager {
  private static instance: SceneManager;
  private scenes: SceneMap = new Map();
  private currentScene: Container | null = null;
  private mode: Mode = 'land';
  private classRegistry: ClassRegistry = {};

  private constructor() {
    Event.on('scene:mode', (mode: Mode) => this.setMode(mode));
    this.registerClass('Sprite', (cfg) => new SceneSprite(Assets.get(cfg.texture!)));
    this.registerClass('Text', (cfg) => new SceneText(cfg.text));
    this.registerClass('Container', () => new SceneContainer());
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  public registerClass(name: string, constructor: (config: SceneObjectConfig) => Container): void {
    this.classRegistry[name] = constructor;
  }

  public createScene(config: SceneConfig): Container {
    const container = new BaseScene();
    for (const objConfig of config.objects) {
      const ctor = this.classRegistry[objConfig.class];
      if (!ctor) {
        console.warn(`Unregistered class: ${objConfig.class}`);
        continue;
      }

      const obj = ctor(objConfig);
      this.applyLayout(obj, objConfig);
      container.addChild(obj);
    }

    this.scenes.set(config.name, container);
    return container;
  }

  public loadScene(name: string): Container | null {
    const scene = this.scenes.get(name);
    if (!scene) {
      console.warn(`Scene not found: ${name}`);
      return null;
    }

    this.currentScene = scene;
    Event.dispatch('scene:resize');
    return scene;
  }

  public getObjectByName<T extends Container>(sceneName: string, name: string): T | undefined {
    const scene = this.scenes.get(sceneName);
    if (!scene) return undefined;

    return scene.children.find((obj) => (obj as T).name === name) as T;
  }

  public setMode(mode: Mode): void {
    if (this.mode === mode) return;
    this.mode = mode;

    for (const [sceneName, container] of this.scenes) {
      const scene = container;
      console.log(sceneName);
      scene.children.forEach((obj) => {
        const config = (obj as SceneContainer).config as SceneObjectConfig;
        if (config) this.applyLayout(obj, config);
      });
    }
  }

  private applyLayout<T extends SceneContainer>(obj: T, config: SceneObjectConfig): void {
    const layout = config[this.mode];
    obj.position.set(layout.x, layout.y);
    obj.scale.set(layout.scale);

    if ('anchor' in obj && config.anchor) {
      (obj as any).anchor.set(config.anchor.x, config.anchor.y);
    }

    obj.config = config;
    obj.name = config.name;
  }

  public getCurrentScene(): Container | null {
    return this.currentScene;
  }

  public getSceneByName(name: string): Container | undefined {
    return this.scenes.get(name);
  }

  public destroyScene(name: string): void {
    const scene = this.scenes.get(name);
    if (scene) {
      scene.destroy({ children: true });
      this.scenes.delete(name);
    }
  }
}
