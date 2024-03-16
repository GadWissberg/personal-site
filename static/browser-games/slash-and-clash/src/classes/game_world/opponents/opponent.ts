import { Scene } from "phaser";
import { Atlases, Sounds } from "../../../scenes/loading/assets-definitions";
import { Peasant } from "../characters/peasant";
import { OpponentModel } from "./opponent-model";
import { CharacterTypes, characterDefinitions } from "../characters/character-types";
import { SwordsMan } from "../characters/swords-man";
import { Character } from "../characters/character";
import { SoundPlayer } from "../sound-player";
import { Knight } from "../characters/knight";

export class Opponent {

    readonly opponentModel: OpponentModel

    constructor(readonly isPlayer: boolean, readonly soundPlayer: SoundPlayer) {
        this.opponentModel = new OpponentModel(isPlayer)
    }

    trainCharacter(scene: Scene, characterType: CharacterTypes, x: number, y: number) {
        let trainedCharacter: Character | undefined = undefined;
        const atlas = this.isPlayer ? Atlases.CHARACTERS : Atlases.ENEMY_CHARACTERS;
        this.soundPlayer.play(Sounds.CHARACTER_CREATE)
        if (characterType == CharacterTypes.PEASANT) {
            trainedCharacter = new Peasant(scene, x, y, atlas, this.opponentModel, this.soundPlayer);
        } else if (characterType == CharacterTypes.SWORDS_MAN) {
            trainedCharacter = new SwordsMan(scene, x, y, atlas, this.opponentModel, this.soundPlayer);
        } else if (characterType == CharacterTypes.KNIGHT) {
            trainedCharacter = new Knight(scene, x, y, atlas, this.opponentModel, this.soundPlayer);
        }
        scene.physics.add.existing(trainedCharacter!!)
        const definition = characterDefinitions.get(characterType)!!;
        this.opponentModel.nextUnitTrainEnableTime = scene.time.now + characterDefinitions.get(characterType)!!.trainDuration * 1000
        this.opponentModel.trees -= characterDefinitions.get(characterType)!!.treeCost
        this.opponentModel.gold -= definition.goldCost
        return trainedCharacter!!
    }

    isUnitTrainingReady(scene: Scene): Boolean {
        return this.opponentModel.nextUnitTrainEnableTime < scene.time.now
    }

}