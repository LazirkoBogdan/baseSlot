import { GameState } from 'Core/States/StatesTypes';
export abstract class Action {
  abstract execute(prevState: GameState, newState: GameState): Promise<void>;
}
