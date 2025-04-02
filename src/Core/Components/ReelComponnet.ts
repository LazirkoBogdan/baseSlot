import { Config } from 'config';
import gsap from 'gsap';
import { BaseComponent } from 'Core/Components/BaseComponent';
import { Symbol } from 'Core/Components/SymbolComponent';
import { Sprite, Graphics, Container, Text } from 'pixi.js';
import { Assets, Ticker } from 'pixi.js';
import { Event } from 'Core/Managers/EventManager';
import { GameModel } from 'Core/Models/GameModel';
import { ReelStripManager } from 'Core/Managers/ReelStripManager';

export type SpinPhase = 'start' | 'spinning' | 'end' | 'idle';

interface TweenParams {
  distance: number;
  duration: number;
  ease: string;
  target?: number;
}

export class Reel extends BaseComponent {
  protected symbols: Symbol[] = [];
  protected symbolContainer = new Container();

  private phase: SpinPhase = 'idle';
  private elapsedTime = 0;
  private reelPosition = 0;
  private spinTime = 0;

  private isSpinning = false;
  private turbo = false;

  private startTween: gsap.core.Tween | null = null;
  private endTween: gsap.core.Tween | null = null;

  constructor() {
    super();
    ReelStripManager.getInstance().initReelStrip(Config.reel.reelsStrip);
    this.setup();
  }

  private setup(): void {
    this.createSignal();
    this.init();
    this.addRender();
  }

  public createSignal(): void {
    Event.on('REEL:SPIN', () => {
      if (this.isSpinning) {
        this.turbo = true;
      } else {
        this.startSpin();
      }
    });
  }

  public reset(): void {
    this.phase = 'idle';
    this.elapsedTime = 0;
    this.spinTime = 0;
    this.reelPosition = 0;
    this.startTween = null;
    this.endTween = null;
    this.isSpinning = false;
    this.turbo = false;
  }

  public init(): void {
    this.createReelBackground();
    this.createReelMask();
    this.initSymbols();
    this.updateSymbols();

    this.addChild(this.symbolContainer);
  }

  public initPosition(): void {
    this.position.set(Config.reel.x, Config.reel.y);
  }

  public addRender(): void {
    Ticker.shared.add((time) => this.update(time.deltaTime), this, 1);
  }

  public update(delta: number): void {
    if (this.phase === 'idle') return;

    this.elapsedTime += delta;

    switch (this.phase) {
      case 'start':
        this.handleStart();
        break;
      case 'spinning':
        this.handleSpinning(delta);
        break;
      case 'end':
        this.handleEnd();
        break;
    }
  }

  private handleStart(): void {
    if (this.startTween) return;

    this.startTween = this.createTween(
      {
        distance: this.reelPosition - 0.5,
        duration: Config.reel.startTweenDuration,
        ease: Config.reel.startEase,
      },
      () => {
        this.phase = 'spinning';
        this.startTween = null;
      },
    );
  }

  private handleSpinning(delta: number): void {
    if (this.endTween) return;

    const easeFactor = this.getEaseFactor();
    const speed = this.getSpinSpeed(easeFactor);

    this.reelPosition += speed * (delta * 0.016);
    this.updateSymbols();

    this.spinTime += delta * 0.016;

    if (this.spinTime > this.getMaxSpinTime() - 1) {
      this.endSpin();
    }
  }

  private handleEnd(): void {
    if (this.endTween) return;

    const { distance, duration, ease, target } = this.getEndTweenParams();

    this.endTween = gsap.to(this, {
      reelPosition: distance,
      duration,
      ease,
      onUpdate: () => this.updateSymbols(),
      onComplete: () => {
        gsap.to(this, {
          reelPosition: target!,
          duration,
          ease: 'linear',
          onUpdate: () => this.updateSymbols(),
          onComplete: () => {
            this.stopSpin();
            this.endTween = null;
          },
        });
      },
    });
  }

  private createTween(params: TweenParams, onComplete: () => void): gsap.core.Tween {
    return gsap.to(this, {
      reelPosition: params.distance,
      duration: params.duration,
      ease: params.ease,
      onUpdate: () => this.updateSymbols(),
      onComplete,
    });
  }

  private getEaseFactor(): number {
    const t = Math.min(this.spinTime / this.getMaxSpinTime(), 1);
    return 1 - t * t;
  }

  private getSpinSpeed(ease: number): number {
    return this.turbo ? Config.reel.turboSpeed * ease : Config.reel.speed * ease;
  }

  private getMaxSpinTime(): number {
    return this.turbo ? Config.reel.turboSpinTime : Config.reel.totalSpinTime;
  }

  private getEndTweenParams(): TweenParams {
    const endOffset = Config.reel.endOffset;
    return {
      distance: this.reelPosition + endOffset,
      target: Math.round(this.reelPosition - endOffset),
      duration: this.turbo ? 0.1 : Config.reel.endTweenDuration / 2,
      ease: Config.reel.endEase,
    };
  }

  private getRandomSymbol(): string {
    return ReelStripManager.getInstance().getNextSymbol();
  }

  private initSymbols(): void {
    this.symbols = [];
    for (let i = 0; i < Config.reel.visibleCount + 1; i++) {
      const symbol = new Symbol(this.getRandomSymbol());
      const debugText = new Text(i.toString());
      symbol.addChild(debugText);
      symbol.position.set(0, i * Config.reel.symbolSize);
      this.symbols.push(symbol);
      this.symbolContainer.addChild(symbol);
    }
  }

  public updateSymbols(): void {
    const total = this.symbols.length;
    const itemHeight = Config.reel.symbolSize;
    const reelHeight = total * itemHeight;

    for (let i = 0; i < total; i++) {
      const symbol = this.symbols[i];
      const prevY = symbol.y;
      let newY = (((this.reelPosition + i) * itemHeight) % reelHeight) - itemHeight;

      if (newY < -itemHeight) newY += reelHeight;
      symbol.y = newY;

      if (symbol.y < 0 && prevY >= itemHeight && this.phase === 'spinning') {
        symbol.changeTexture(this.getRandomSymbol());
      }
    }
  }

  public startSpin(): void {
    this.reset();
    this.isSpinning = true;
    this.phase = 'start';
    Event.dispatch('Camera:Zoom');
    GameModel.getInstance().spin();
  }

  public endSpin(): void {
    this.phase = 'end';
    this.elapsedTime = 0;
  }

  private stopSpin(): void {
    this.phase = 'idle';
    const itemHeight = Config.reel.symbolSize;

    this.symbols.forEach((s, i) => (s.y = i * itemHeight));

    this.reset();
    GameModel.getInstance().checkWin(this.symbols);
    Event.dispatch('REEL:END:SPIN');
  }

  protected createReelBackground(): void {
    const bg = new Sprite(Assets.get('REEL'));
    bg.anchor.set(0.5);
    bg.y = 150;
    bg.scale.set(1.15);
    this.addChild(bg);
  }

  protected createReelMask(): void {
    const mSize = Config.reel.symbolSize;
    const vSize = Config.reel.visibleCount;

    const mask = new Graphics().rect(-mSize / 2, mSize / 2, mSize, mSize * vSize - 10).fill(0xffffff);

    mask.y = -mSize + 5;
    this.addChild(mask);
    this.symbolContainer.mask = mask;
  }
}
