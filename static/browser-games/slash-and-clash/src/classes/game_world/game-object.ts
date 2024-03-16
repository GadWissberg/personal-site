import { Physics } from "phaser";

export abstract class GameEntity extends Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, immovable: boolean = false, frame?: string | number) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.addToUpdateList()
        scene.physics.add.existing(this);
    }
}