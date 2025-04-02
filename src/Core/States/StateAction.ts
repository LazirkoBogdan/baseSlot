import { GameState } from 'Core/States/StatesTypes';
import { Action } from './Action';

export abstract class StateAction extends Action {
  constructor(protected state: GameState) {
    super();
  }
}
