import { Container } from 'pixi.js';
import { gsap } from 'gsap';

export class BaseScene extends Container {
  public initialized = false;
  private animationDuration = 0.4;

  constructor() {
    super();
  }

  public init(): void {
    this.initialized = true;
  }

  public async show(): Promise<void> {
    this.visible = true;
    gsap.killTweensOf(this);

    return new Promise<void>((resolve) => {
      gsap.to(this, {
        alpha: 1,
        duration: this.animationDuration,
        delay: 1,
        ease: 'power2.out',
        onComplete: resolve,
      });
    });
  }

  public async hide(): Promise<void> {
    gsap.killTweensOf(this);

    return new Promise<void>((resolve) => {
      gsap.to(this, {
        alpha: 0,
        duration: this.animationDuration,
        ease: 'power2.in',
        onComplete: () => {
          this.visible = false;
          resolve();
        },
      });
    });
  }

  public destroyLayer(): void {
    gsap.killTweensOf(this);
    this.removeChildren();
    this.destroy({ children: true, texture: false });
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public add<T extends Container>(displayObject: T): T {
    this.addChild(displayObject);
    return displayObject;
  }

  public remove<T extends Container>(displayObject: T): T {
    this.removeChild(displayObject);
    return displayObject;
  }
}
