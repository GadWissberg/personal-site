import { Sounds } from "../../scenes/loading/assets-definitions";
import { MainScene } from "../../scenes";
import { Scene } from "phaser";

export class SoundPlayer {

    private scene!: Scene;
    private sounds: Map<Sounds, Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound> = new Map()
    init(scene: Scene) {
        this.scene = scene
        const values = Object.values(Sounds)
        for (const value of values) {
            if (typeof value === 'string') {
                this.sounds.set(value, scene.sound.add(value))
            }
        }
    }

    play(...sounds: Sounds[]) {
        const sound = this.sounds.get(sounds[Math.floor(Math.random() * sounds.length)]);
        sound!!.setDetune(50 + Math.random() * 200 * (Math.random() > 0.5 ? 1 : -1))
        sound!!.play()
    }
}