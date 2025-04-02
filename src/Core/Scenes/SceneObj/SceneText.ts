import { Text, TextOptions } from 'pixi.js';
import { SceneObject, SceneObjectConfig } from 'types';

export class SceneText extends Text implements SceneObject {
  public config?: SceneObjectConfig;
  constructor(options?: TextOptions) {
    super(options);
  }
}
