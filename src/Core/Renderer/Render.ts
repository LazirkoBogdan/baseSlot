import { Application, Container } from 'pixi.js';
import { Config, GameConfig, RenderConfig } from 'config';
import { Event } from 'Core/Managers/EventManager';
import gsap from 'gsap';

export type Orientation = 'land' | 'port';

export class Renderer extends Application {
  private config: GameConfig;
  public orientation: Orientation;
  public camera: Container;

  constructor() {
    super();
    this.config = Config;
    this.orientation = this.checkOrientation();
    this.camera = new Container();
    this.stage.addChild(this.camera);

    Event.on('Camera:Zoom', () => {
      this.CameraZoom();
    });
  }

  addResizeListener(): void {
    this.resizeRenderer();
    window.addEventListener('resize', () => {
      this.resizeRenderer();
    });

    window.addEventListener('orientationchange', () => {
      this.resizeRenderer();
    });

    Event.on('scene:resize', () => {
      this.resizeRenderer();
    });
  }

  private resizeRenderer(): void {
    const settings: RenderConfig = this.config.render;

    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.orientation = this.checkOrientation();
    const stageSize = settings.screen[this.orientation];

    this.renderer.resize(screen.width, screen.height);

    const scale = Math.min(screen.width / stageSize.width, screen.height / stageSize.height);

    this.camera.scale.set(scale);

    this.camera.position.set(screen.width / 2, screen.height / 2);

    this.camera.pivot.set(stageSize.width / 2, stageSize.height / 2);

    Event.dispatch('scene:mode', this.orientation);
  }

  public checkOrientation(): Orientation {
    return window.innerWidth > window.innerHeight ? 'land' : 'port';
  }

  public CameraZoom(scale: number = 1.01): void {
    gsap.to(this.camera.scale, { x: scale, y: scale, duration: 1, ease: 'power2.inOut', yoyo: true, repeat: 1 });
  }
}
