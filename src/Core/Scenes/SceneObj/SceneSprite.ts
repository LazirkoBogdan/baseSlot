import { Sprite, Texture } from 'pixi.js';
import { SceneObject, SceneObjectConfig } from 'types';

export class SceneSprite extends Sprite implements SceneObject {
  public config?: SceneObjectConfig;
  constructor(texture: Texture) {
    super(texture);
  }
}
