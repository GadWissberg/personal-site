import { Scene } from 'phaser';
import { Atlases, Fonts, Images, Sounds } from './assets-definitions'
export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene');
  }
  create(): void {
    this.scene.start('main-scene');
  }

  preload(): void {
    this.load.baseURL = 'assets/';
    const scene = this
    this.loadAssets(Object.values(Images), (key: string, value: string): void => { scene.load.image(key, `images/${value}.png`) });
    this.loadAssets(Object.values(Atlases), (key: string, value: string): void => { scene.load.atlas(key, `atlases/${value}.png`, `atlases/${value}.json`) });
    this.loadAssets(Object.values(Sounds), (key: string, value: string): void => { scene.load.audio(key, `sounds/${value}.wav`) });
    const fontsDefinitions = Object.values(Fonts);
    for (const value of fontsDefinitions) {
      if (typeof value === 'string') {
        this.load.bitmapFont(
          value,
          `fonts/${value}.png`,
          `fonts/${value}.fnt`
        );
      }
    }

  }

  private loadAssets(values: string[], loadFunction: (key: string, value: string) => void) {
    for (const value of values) {
      if (typeof value === 'string') {
        loadFunction(value, value);
      }
    }
  }
}

