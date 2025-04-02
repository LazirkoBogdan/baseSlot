import { BaseComponent } from 'Core/Components/BaseComponent';
import { Assets, Sprite } from 'pixi.js';
import gsap from 'gsap';
import { Event } from 'Core/Managers/EventManager';
import { GameModel } from 'Core/Models/GameModel';

export class SpinButton extends BaseComponent {
  private icon: Sprite;
  private isDisabled: boolean = false;
  protected isTurbo: boolean = false;
  private isSpinning: boolean = false;

  constructor() {
    super();

    this.icon = new Sprite(Assets.get('PLAY'));
    this.icon.anchor.set(0.5);
    this.addChild(this.icon);

    this.interactive = true;

    this.on('pointerdown', this.onPress, this);
    this.on('pointerup', this.onRelease, this);
    this.on('pointerupoutside', this.onRelease, this);

    Event.on('REEL:END:SPIN', () => {
      this.reset();
    });
  }

  private onPress(): void {
    if (this.isDisabled) return;

    gsap.to(this.scale, {
      x: 0.9,
      y: 0.9,
      duration: 0.1,
      ease: 'power1.out',
    });
  }

  private onRelease(): void {
    if (this.isDisabled) return;

    gsap.to(this.scale, {
      x: 1,
      y: 1,
      duration: 0.1,
      ease: 'power1.out',
      onComplete: () => {
        const gameModel = GameModel.getInstance();
        if (!gameModel.canSpin()) {
          this.disable();
          return;
        }

        if (!this.isSpinning) {
          this.isSpinning = true;
          Event.dispatch('REEL:SPIN');
        } else if (!this.isTurbo) {
          this.isTurbo = true;
          this.disable();
          Event.dispatch('REEL:TURBO');
        }
      },
    });
  }

  public reset(): void {
    this.isDisabled = false;
    this.isSpinning = false;
    this.isTurbo = false;
    this.icon.texture = Assets.get('PLAY');
    this.alpha = 1;
    this.interactive = true;
  }

  public enable(): void {
    this.isDisabled = false;
    this.interactive = true;
    this.alpha = 1;
    this.isSpinning = false;
    this.isTurbo = false;
  }

  public disable(): void {
    this.isDisabled = true;
    this.interactive = false;
    this.icon.texture = Assets.get('PLAY_DISABLED');
  }

  protected init(): void {}

  public update(_delta?: number): void {}
}
