import { Scene } from "phaser"
import { Atlases } from "../../../scenes/loading/assets-definitions"
import { OpponentModel } from "../opponents/opponent-model"
import { AtlasKeys, ENEMY_PREFIX } from "../../../scenes/loading/atlas-keys"
import { Character } from "./character"
import { CharacterTypes } from "./character-types"
import { SoundPlayer } from "../sound-player"

export class Peasant extends Character {

    private treeValue = 0

    constructor(scene: Scene, x: number, y: number, atlas: Atlases, opponentModel: OpponentModel, soundPlayer: SoundPlayer) {
        super(scene, CharacterTypes.PEASANT, x, y, atlas, opponentModel, soundPlayer)
    }

    applyTree(treeValue: number) {
        this.treeValue = treeValue
        this.anims.play((this.opponentModel.isPlayer ? '' : ENEMY_PREFIX) + AtlasKeys.PEASANT_RUN_WITH_TREE, true)
        if ((this.opponentModel.isPlayer && this.getDirection() == Character.DIRECTION_LEFT) || (!this.opponentModel.isPlayer && this.getDirection() == Character.DIRECTION_RIGHT)) {
            this.flipDirection()
        }
    }

    getTreeValue() {
        return this.treeValue
    }

    isGoldOnDeath(): number {
        return 0
    }
}