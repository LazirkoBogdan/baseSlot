import { Container } from 'pixi.js';
import { SceneObject, SceneObjectConfig } from 'types';
export class SceneContainer extends Container implements SceneObject {
  public config?: SceneObjectConfig;
  constructor() {
    super();
  }
}
