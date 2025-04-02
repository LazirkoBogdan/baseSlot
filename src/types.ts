import { Container, TextStyle } from 'pixi.js';

export type SceneObjectConfig = {
  name: string;
  class: string;
  texture?: string;
  anchor?: { x: number; y: number };
  style?: Partial<TextStyle>;
  land: { x: number; y: number; scale: number };
  port: { x: number; y: number; scale: number };
};

export interface SceneObject extends Container {
  config?: SceneObjectConfig;
}
