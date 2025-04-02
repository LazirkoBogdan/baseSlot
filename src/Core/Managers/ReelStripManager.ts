export class ReelStripManager {
  private static instance: ReelStripManager;
  private reelStrip: string[] = [];
  private position: number = 0;

  public static getInstance(): ReelStripManager {
    if (!ReelStripManager.instance) {
      ReelStripManager.instance = new ReelStripManager();
    }
    return ReelStripManager.instance;
  }

  public initReelStrip(strip: string[]): void {
    this.reelStrip = strip;
    this.position = 0;
  }

  public getNextSymbol(): string {
    const symbol = this.reelStrip[this.position];
    this.position = (this.position + 1) % this.reelStrip.length;
    return symbol;
  }

  public getNextSymbols(count: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(this.getNextSymbol());
    }
    return result;
  }

  public peekNextSymbols(count: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const index = (this.position + i) % this.reelStrip.length;
      result.push(this.reelStrip[index]);
    }
    return result;
  }

  public setPosition(index: number): void {
    this.position = index % this.reelStrip.length;
  }

  public getCurrentPosition(): number {
    return this.position;
  }
}
