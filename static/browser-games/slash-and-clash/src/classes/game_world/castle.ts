import { Atlases } from "../../scenes/loading/assets-definitions";
import { AtlasKeys, ENEMY_PREFIX } from "../../scenes/loading/atlas-keys";
import { GlobalConstants } from "../c";
import { GameEntity } from "./game-object";

export class Castle extends GameEntity {

    readonly isPlayer: boolean;
    private hp: number = GlobalConstants.CASTLE_HP;

    constructor(scene: Phaser.Scene, atlas: Atlases, isPlayer: boolean, x: number = 0, y: number = 0, frame?: string | number) {
        super(scene, x, y, atlas, true, frame);
        this.isPlayer = isPlayer;
        this.anims.play((isPlayer ? '' : ENEMY_PREFIX) + AtlasKeys.CASTLE, true)
        this.body?.setSize(this.width / 2, this.height)
        this.setImmovable(true)
        this.setPushable(false)
    }

    takeDamage() {
        this.hp -= 1
        this.setTint(0xFF0000);
        const me = this
        setTimeout(() => { me.clearTint(); }, 100);
    }

    getHp() {
        return this.hp
    }
}