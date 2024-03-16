import { Scene } from "phaser"
import { Atlases } from "../../../scenes/loading/assets-definitions"
import { OpponentModel } from "../opponents/opponent-model"
import { Character } from "./character"
import { CharacterTypes } from "./character-types"
import { SoundPlayer } from "../sound-player"

export class SwordsMan extends Character {


    constructor(readonly scene: Scene, x: number, y: number, readonly atlas: Atlases, readonly opponentModel: OpponentModel, readonly soundPlayer: SoundPlayer) {
        super(scene, CharacterTypes.SWORDS_MAN, x, y, atlas, opponentModel, soundPlayer)
    }

}