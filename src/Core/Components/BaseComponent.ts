import { SceneContainer } from 'Core/Scenes/SceneObj/SceneContainer';

export abstract class BaseComponent extends SceneContainer {
  constructor() {
    super();
  }

  protected abstract init(): void;

  public abstract update(delta: number): void;

  public destroyComponent(): void {
    this.removeAllListeners();
    this.destroy({ children: true, texture: false });
  }
}
