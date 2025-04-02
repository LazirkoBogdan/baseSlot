import { Event } from 'Core/Managers/EventManager';
import { ActionManager } from 'Core/Managers/ActionManager';
import { GameState } from 'Core/States/StatesTypes';
import { Action } from 'Core/States/Action';

export class StateMachine {
  private currentState: GameState;
  private actionManager: ActionManager;

  constructor(initialState: GameState = 'idle') {
    this.currentState = initialState;
    this.actionManager = new ActionManager();

    Event.on('stateChanged', ({ prevState, newState }) => {
      this.actionManager.executeActions(prevState, newState);
    });
  }

  public getState(): GameState {
    return this.currentState;
  }

  public transition(newState: GameState): void {
    if (this.currentState !== newState) {
      const prevState = this.currentState;
      this.currentState = newState;
      Event.dispatch('stateChanged', { prevState, newState });
    }
  }

  public onStateChange(callback: (states: { prevState: GameState; newState: GameState }) => void): void {
    Event.on('stateChanged', callback);
  }

  public registerAction(state: GameState, action: Action): void {
    this.actionManager.registerAction(state, action);
  }
}
