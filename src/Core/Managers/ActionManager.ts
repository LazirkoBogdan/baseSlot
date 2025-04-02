import { GameState } from 'Core/States/StatesTypes';
import { Action } from 'Core/States/Action';
export class ActionManager {
  private actions: Record<GameState, Action[]> = {
    idle: [],
    spinning: [],
    result: [],
    loading: [],
  };

  public registerAction(state: GameState, action: Action): void {
    this.actions[state].push(action);
  }

  public async executeActions(prevState: GameState, newState: GameState): Promise<void> {
    for (const action of this.actions[newState]) {
      await action.execute(prevState, newState);
    }
  }
}
