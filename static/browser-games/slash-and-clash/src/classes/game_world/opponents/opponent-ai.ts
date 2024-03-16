import { Physics, Scene } from "phaser"
import { Opponent as Opponent } from "./opponent"
import { MainScene } from "../../../scenes"
import { CharacterTypes, characterDefinitions } from "../characters/character-types"
import { DebugSettings } from "../../../classes/c"
import { SoundPlayer } from "../sound-player"
import { debug } from "console"

export class OpponentAI {
    nextDecisionTime: number = 0
    gameInProgress: boolean = true
    private readonly opponent: Opponent = new Opponent(false, this.soundPlayer)
    private readonly assaultCharactersAvailable = [CharacterTypes.SWORDS_MAN, CharacterTypes.KNIGHT]

    constructor(private readonly soundPlayer: SoundPlayer) {

    }

    update(scene: Scene, characters: Physics.Arcade.Group) {
        if (DebugSettings.DISABLE_ENEMY_TRAINING) return

        if (this.gameInProgress && this.opponent.isUnitTrainingReady(scene) && this.nextDecisionTime <= scene.time.now) {
            const charactersToChooseFrom = Object.assign([], this.assaultCharactersAvailable).filter((characterType) => {
                const characterDefinition = characterDefinitions.get(characterType)!!
                return characterDefinition.treeCost <= this.opponent.opponentModel.trees && characterDefinition.goldCost <= this.opponent.opponentModel.gold
            })
            let selectedCharacter = null
            if (charactersToChooseFrom.length > 0) {
                const randomIndex = Math.floor(Math.random() * charactersToChooseFrom.length)
                selectedCharacter = charactersToChooseFrom[randomIndex]
            } else {
                selectedCharacter = CharacterTypes.PEASANT
            }
            const trainedCharacter = this.opponent.trainCharacter(scene, selectedCharacter, MainScene.LEFT_SIDE_UNIT_SPAWN_X, MainScene.UNIT_SPAWN_Y)
            characters.add(trainedCharacter)
            this.nextDecisionTime = scene.time.now + 12 * 1000
        }
    }
}