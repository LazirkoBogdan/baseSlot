import { BaseComponent } from 'Core/Components/BaseComponent';
import { Assets, Sprite, Graphics } from 'pixi.js';
import { Config } from 'config';
import gsap from 'gsap';

export class Symbol extends BaseComponent {
  private sprite: Sprite;
  private winFrame: Sprite;
  public symbolCurrentId: string = '';

  constructor(symbolId: string) {
    super();

    const graphics = new Graphics();
    graphics.rect(-Config.reel.symbolSize / 2, -Config.reel.symbolSize / 2, Config.reel.symbolSize, Config.reel.symbolSize);
    graphics.fill(0xde3249, 0.01);
    this.addChild(graphics);

    this.winFrame = new Sprite(Assets.get('WIN_BG'));
    this.winFrame.anchor.set(0.5);
    this.winFrame.scale.set(1.1);
    this.winFrame.visible = false;
    this.addChild(this.winFrame);

    this.sprite = new Sprite(Assets.get(symbolId));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.rescaleMaxWidth(this.sprite, Config.reel.symbolSize);
  }

  winAnimation(): void {
    this.winFrame.visible = true;
    this.winFrame.alpha = 0;
    this.winFrame.scale.set(1);

    gsap.to(this.winFrame, {
      alpha: 1,
      duration: 0.2,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.to(this.winFrame.scale, {
          x: 1.2,
          y: 1.2,
          duration: 0.25,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1,
        });

        gsap.to(this.winFrame, {
          alpha: 0,
          duration: 0.15,
          repeat: 5,
          yoyo: true,
          ease: 'none',
          onComplete: () => {
            this.winFrame.visible = false;
          },
        });
      },
    });
  }

  rescaleMaxWidth(obj: any, width: number) {
    obj.scale.set(1);
    const newScale = width / obj.width;
    obj.scale.set(newScale);
  }

  changeTexture(symbolId: string): void {
    this.symbolCurrentId = symbolId;
    this.sprite.texture = Assets.get(symbolId);
  }

  protected init(): void {}

  public update(_delta?: number): void {}
}
