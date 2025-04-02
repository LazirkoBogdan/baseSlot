import { Container, Text } from 'pixi.js';

type SymbolWin = { symbolCurrentId: string; winAnimation: () => void };

export class GameModel {
  private static instance: GameModel;

  private balance: number = 100;
  private bet: number = 1;
  private winAmount: number = 0;

  public balanceView!: Container | Text;
  public winView!: Container | Text;

  private constructor() {}

  // Singleton
  public static getInstance(): GameModel {
    if (!GameModel.instance) {
      GameModel.instance = new GameModel();
    }
    return GameModel.instance;
  }

  // Views
  public setBalanceView(view: Container | Text): void {
    this.balanceView = view;
    this.updateBalanceView();
  }

  public setWinView(view: Container | Text): void {
    this.winView = view;
    this.updateWinView();
  }

  private updateTextView(view: Container | Text | undefined, text: string): void {
    if (view instanceof Text) {
      view.text = text;
    } else {
      console.warn('View does not support text update');
    }
  }

  private updateBalanceView(): void {
    this.updateTextView(this.balanceView, `Balance: ${this.balance} $`);
  }

  private updateWinView(): void {
    this.updateTextView(this.winView, `WIN: ${this.winAmount} $`);
  }

  // Public API
  public getBalance(): number {
    return this.balance;
  }

  public getWin(): number {
    return this.winAmount;
  }

  public canSpin(): boolean {
    return this.balance >= this.bet;
  }

  public spin(): number {
    if (!this.canSpin()) return 0;

    this.winAmount = 0;
    this.balance -= this.bet;

    this.updateBalanceView();
    this.updateWinView();

    return this.balance;
  }

  public checkWin(reelSymbols: SymbolWin[]): number {
    const visible = reelSymbols.slice(0, 3);
    const { count, symbols } = this.getMostCommonSymbols(visible);

    if (count >= 2) {
      this.winAmount = this.bet * count;
      this.balance += this.winAmount;

      for (const symbol of symbols) {
        symbol.winAnimation();
      }
    } else {
      this.winAmount = 0;
    }

    this.updateBalanceView();
    this.updateWinView();

    return this.winAmount;
  }

  // Utility
  private getMostCommonSymbols(symbols: SymbolWin[]) {
    const countMap: Record<string, SymbolWin[]> = {};

    for (const symbol of symbols) {
      const id = symbol.symbolCurrentId;
      if (!countMap[id]) {
        countMap[id] = [];
      }
      countMap[id].push(symbol);
    }

    let maxGroup: SymbolWin[] = [];

    for (const group of Object.values(countMap)) {
      if (group.length > maxGroup.length) {
        maxGroup = group;
      }
    }

    return { count: maxGroup.length, symbols: maxGroup };
  }
}
