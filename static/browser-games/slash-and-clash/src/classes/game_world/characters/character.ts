import { MainScene } from "../../../scenes";
import { GameEntity } from "../game-object";
import { OpponentModel } from "../opponents/opponent-model";
import { ENEMY_PREFIX } from "../../../scenes/loading/atlas-keys";
import { CharacterTypes, characterDefinitions } from "./character-types";
import { DebugSettings } from "../../../classes/c";
import { SoundPlayer } from "../sound-player";
import { Sounds } from "../../../scenes/loading/assets-definitions";

export abstract class Character extends GameEntity {

    protected static readonly DIRECTION_LEFT = -1;
    protected static readonly DIRECTION_RIGHT = 1;
    private static readonly WALK_SPEED: number = 60;

    direction: number;
    private dead: boolean = false;
    private sleep: boolean = false;

    constructor(
        readonly scene: Phaser.Scene,
        readonly characterType: CharacterTypes,
        x: number,
        y: number,
        texture: string,
        readonly opponentModel: OpponentModel,
        readonly soundPlayer: SoundPlayer) {
        super(scene, x, y, texture, false);
        this.body!!.setSize(this.width / 2, this.height)
        this.characterType = characterType
        this.setFlipX(opponentModel.isPlayer)
        this.setOffset(this.scaleX > 0 ? 0 : this.width, 0)
        this.walkHorizontally();
        this.anims.play((this.opponentModel.isPlayer ? '' : ENEMY_PREFIX) + characterDefinitions.get(characterType)?.atlasKey, true)
        this.direction = opponentModel.isPlayer ? Character.DIRECTION_LEFT : Character.DIRECTION_RIGHT
    }

    setIdle() {
        this.sleep = true
        this.body?.velocity.set(0)
        this.anims.stop()
    }

    isDead() {
        return this.dead
    }

    die(avoidDeathSound: boolean = false) {
        if (!avoidDeathSound) {
            this.soundPlayer.play(Sounds.CHARACTER_DIE_0, Sounds.CHARACTER_DIE_1, Sounds.CHARACTER_DIE_2)
        }
        this.dead = true
        const me = this
        const tweenConfig = {
            targets: me,
            x: me.x,
            y: me.y + 50,
            duration: 500,
            angle: me.angle + 90 * (Math.random() < 0.5 ? 1 : -1),
            ease: 'Expo.In',
            onComplete: () => {
                me.destroy();
            },
        }
        this.scene.tweens.add(tweenConfig)
    }

    getDirection() {
        return this.direction
    }

    flipDirection(): this {
        this.direction *= -1
        this.scaleX *= -1
        this.setOffset(this.scaleX > 0 ? 0 : this.width, 0)
        return this
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        if (this.sleep) return

        const x = this.x;
        if (x < MainScene.RIGHT_SLOPE_HIGH_X && x >= MainScene.RIGHT_SLOPE_LOW_X) {
            this.walkDiagonally(this.direction > 0);
        } else if (x < MainScene.RIGHT_SLOPE_LOW_X && x >= MainScene.LEFT_SLOPE_LOW_X) {
            this.walkHorizontally()
        } else if (x > MainScene.LEFT_SLOPE_HIGH_X && x <= MainScene.LEFT_SLOPE_LOW_X) {
            this.walkDiagonally(this.direction < 0)
        } else {
            this.walkHorizontally()
        }
    }

    private walkDiagonally(up: boolean) {
        this.body!.velocity.set(this.direction, up ? -1 : 1);
        this.body!.velocity.scale(DebugSettings.SUPER_FAST_CHARACTERS ? 240 : Character.WALK_SPEED);
    }

    private walkHorizontally() {
        this.body!.velocity.set(this.direction, 0);
        this.body!.velocity.scale(DebugSettings.SUPER_FAST_CHARACTERS ? 240 : Character.WALK_SPEED);
    }
}