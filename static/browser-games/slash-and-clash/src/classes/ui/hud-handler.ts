import { GameObjects, Scene } from "phaser";
import { ButtonStyle } from "./button-style";
import { Fonts, Images } from "../../scenes/loading/assets-definitions";
import { MainScene } from "../../scenes";
import { Button } from "./button";
import { Opponent } from "../game_world/opponents/opponent";
import { GameEntitiesGroups } from "../../scenes/game/game-entities-groups";
import { GlobalConstants } from "../c";
import { CharacterTypes, characterDefinitions } from "../game_world/characters/character-types";
import gameConfig from '../../index'

class ButtonDeclaration {
    constructor(readonly icon: Images, readonly unitType: CharacterTypes) {

    }
}

export class HudHandler {

    static readonly HUD_DEPTH = 2;
    static readonly LABEL_TREES_X: number = 892;
    static readonly LABEL_GOLD_X: number = 762;
    static readonly LABELS_Y: number = 17;
    private static readonly LABEL_EFFECT_DURATION = 4 * 1000;
    private static readonly PLAYER_HP_INDICATOR_MAX_WIDTH = 325;
    private static readonly HP_INDICATOR_GREEN = Phaser.Display.Color.ValueToColor(0x00FF00)
    private static readonly HP_INDICATOR_RED = Phaser.Display.Color.ValueToColor(0xFF0000)
    private static readonly HUD_PADDING = 40;
    private static readonly ButtonsDeclarations: ButtonDeclaration[] = [
        new ButtonDeclaration(Images.BUTTON_PEASANT, CharacterTypes.PEASANT),
        new ButtonDeclaration(Images.BUTTON_SWORDMAN, CharacterTypes.SWORDS_MAN),
        new ButtonDeclaration(Images.BUTTON_KNIGHT, CharacterTypes.KNIGHT),
    ];

    private readonly buttons = new Map<ButtonDeclaration, Button>()
    private labelValueTrees: GameObjects.BitmapText | null = null;
    private labelValueGold: GameObjects.BitmapText | null = null;
    private playerHpIndicator: GameObjects.Rectangle | null = null;

    constructor() {
    }

    init(scene: Scene, playerOpponent: Opponent, gameEntitiesGroups: GameEntitiesGroups) {
        this.addButtons(scene, playerOpponent, gameEntitiesGroups)
        this.playerHpIndicator = scene.add.rectangle(1100, 20, HudHandler.PLAYER_HP_INDICATOR_MAX_WIDTH, 30, 0x00FF00)
        this.playerHpIndicator.depth = -1
        const playerHpIndicatorBackground = scene.add.rectangle(1100, 20, HudHandler.PLAYER_HP_INDICATOR_MAX_WIDTH, 30, 0x111111)
        playerHpIndicatorBackground.depth = -2
        this.labelValueTrees = this.addLabel('0', HudHandler.LABEL_TREES_X, HudHandler.LABELS_Y, scene)
        this.labelValueGold = this.addLabel('0', HudHandler.LABEL_GOLD_X, HudHandler.LABELS_Y, scene)
        this.addLabel(gameConfig.version!!, 10, GlobalConstants.TARGET_RESOLUTION_HEIGHT - 20, scene)
    }

    update(scene: Scene, playerOpponent: Opponent) {
        HudHandler.ButtonsDeclarations.forEach(key => {
            const button = this.buttons.get(key)
            if (button) {
                this.updateButton(button, scene, playerOpponent)
            }
        })
        if (this.playerHpIndicator != null) {
            const ratio = this.playerHpIndicator.width / HudHandler.PLAYER_HP_INDICATOR_MAX_WIDTH
            const r = Math.floor(HudHandler.HP_INDICATOR_GREEN.red - (HudHandler.HP_INDICATOR_RED.red - HudHandler.HP_INDICATOR_GREEN.red) * ratio);
            const g = Math.floor(HudHandler.HP_INDICATOR_GREEN.green - (HudHandler.HP_INDICATOR_RED.green - HudHandler.HP_INDICATOR_GREEN.green) * ratio);
            const b = Math.floor(HudHandler.HP_INDICATOR_GREEN.blue - (HudHandler.HP_INDICATOR_RED.blue - HudHandler.HP_INDICATOR_GREEN.blue) * ratio);
            this.playerHpIndicator.setFillStyle(Phaser.Display.Color.GetColor(r, g, b));
        }
    }

    updateHpIndicator(hp: number) {
        this.playerHpIndicator!!.width = HudHandler.PLAYER_HP_INDICATOR_MAX_WIDTH * hp / GlobalConstants.CASTLE_HP
    }

    updateTreesLabelValue(treesResources: number) {
        this.labelValueTrees?.setText(treesResources.toString())
    }

    updateGoldLabelValue(goldResources: number) {
        this.labelValueGold?.setText(goldResources.toString())
    }

    displayCenterHeader(scene: Scene, text: string) {
        const label = scene.add.bitmapText(0, 0, Fonts.HEADER, text).setDepth(HudHandler.HUD_DEPTH);
        label.setPosition(GlobalConstants.TARGET_RESOLUTION_WIDTH / 2 - label.width / 2, GlobalConstants.TARGET_RESOLUTION_HEIGHT / 2 - label.height / 2);
    }

    addLabelEffect(scene: Scene, value: number, x: number, y: number, color: number) {
        const label = scene.add.bitmapText(0, 0, Fonts.GAME, "+" + value.toString()).setDepth(HudHandler.HUD_DEPTH);
        label.setPosition(x, y);
        label.setTint(color)
        const tweenConfig = {
            targets: label,
            alpha: { value: 0, duration: HudHandler.LABEL_EFFECT_DURATION },
            x: label.x,
            y: label.y + 50,
            duration: HudHandler.LABEL_EFFECT_DURATION,
            ease: 'Expo.In',
            onComplete: () => {
                label.destroy();
            },
        };
        scene.tweens.add(tweenConfig);
    }

    gameFinished(scene: Scene, header: string) {
        this.displayCenterHeader(scene, header)
        this.buttons.forEach(button => {
            button.destroy()
        })
        this.buttons.clear()
    }

    private updateButton(button: Button, scene: Scene, playerOpponent: Opponent) {
        if (button.isDisabled() && playerOpponent.isUnitTrainingReady(scene)) {
            this.buttons.forEach(button => {
                if (button.characterDefinition.treeCost <= playerOpponent.opponentModel.trees && button.characterDefinition.goldCost <= playerOpponent.opponentModel.gold) {
                    button.setDisabled(false)
                }
            })
        }
    }


    private addButtons(scene: Scene, playerOpponent: Opponent, gameEntitiesGroups: GameEntitiesGroups) {
        const buttonStyle = new ButtonStyle(Images.BUTTON_UP, Images.BUTTON_DOWN, Images.BUTTON_OVER);
        for (let i = 0; i < HudHandler.ButtonsDeclarations.length; i++) {
            this.addButton(scene, buttonStyle, playerOpponent, gameEntitiesGroups, i)
        }
    }

    private addButton(scene: Scene, buttonStyle: ButtonStyle, playerOpponent: Opponent, gameEntitiesGroups: GameEntitiesGroups, index: integer) {
        const buttonDeclaration = HudHandler.ButtonsDeclarations[index];
        const characterDefinition = characterDefinitions.get(buttonDeclaration.unitType)!!;
        const button = new Button(scene, characterDefinition, buttonStyle, buttonDeclaration.icon)
        button.setOnClick(((): void => {
            if (!button.isDisabled() && characterDefinition.treeCost <= playerOpponent.opponentModel.trees && characterDefinition.goldCost <= playerOpponent.opponentModel.gold) {
                const spawnedUnit = playerOpponent.trainCharacter(scene, buttonDeclaration.unitType, MainScene.RIGHT_SIDE_UNIT_SPAWN_X, MainScene.UNIT_SPAWN_Y)
                gameEntitiesGroups!!.getCharacters().add(spawnedUnit)
                this.updateTreesLabelValue(playerOpponent.opponentModel.trees);
                this.updateGoldLabelValue(playerOpponent.opponentModel.gold);
                this.buttons.forEach(button => button.setDisabled(true))
            }
        }).bind(this))
        const x = GlobalConstants.TARGET_RESOLUTION_WIDTH - HudHandler.HUD_PADDING - button.width / 2 - index * (20 + button.width)
        const y = GlobalConstants.TARGET_RESOLUTION_HEIGHT - HudHandler.HUD_PADDING - button.height / 2;
        button.setPosition(x, y)
        scene.add.existing(button);
        this.buttons.set(buttonDeclaration, button)
        if (buttonDeclaration.unitType != CharacterTypes.PEASANT) {
            button.setDisabled(true)
        }
        return button;
    }

    private addLabel(text: string, x: number, y: number, scene: Scene) {
        const label = scene.add.bitmapText(
            0, 0, Fonts.GAME,
            text,
        ).setDepth(HudHandler.HUD_DEPTH)
        label.setPosition(
            x,
            y - label.height / 2)
        return label
    }

}