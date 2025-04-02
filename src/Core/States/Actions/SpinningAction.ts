import { GameState } from 'Core/States/StatesTypes';
import { StateAction } from 'Core/States/StateAction';
export class SpinningAction extends StateAction {
  async execute(prevState: GameState, newState: GameState): Promise<void> {
    console.log(`Executing spinning animation from ${prevState} to ${newState}`);
  }
}
