import { GameObjects, Scene } from "phaser";
import { ButtonStyle } from "./button-style";
import { Images } from "../../scenes/loading/assets-definitions";
import { MainScene } from "../../scenes";
import { HudHandler } from "./hud-handler";
import { CharacterDefinition } from "../game_world/characters/character-types";

export class Button extends GameObjects.Sprite {
    private static readonly ICON_DEPTH = 3;
    private static readonly DISABLED_TINT = 0x222222;

    private disabled = false
    private iconImage: GameObjects.Sprite | undefined;

    constructor(
        readonly scene: Scene,
        readonly characterDefinition: CharacterDefinition,
        private buttonStyle: ButtonStyle,
        private icon: Images,
        x = 0,
        y = 0) {
        super(scene, x, y, buttonStyle.textureUp);
        this.characterDefinition = characterDefinition;
        this.depth = HudHandler.HUD_DEPTH
        this.setInteractive()
        const button = this
        this.iconImage = scene.add.sprite(x, y, icon);
        this.iconImage.depth = Button.ICON_DEPTH
        this.on('pointerover', function () {
            button.setTexture(Images.BUTTON_OVER)
        });
        this.on('pointerup', function () {
            button.setTexture(Images.BUTTON_OVER)
        });
        this.on('pointerout', function () {
            button.setTexture(Images.BUTTON_UP)
        });
    }
    
    destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene)
        this.iconImage?.destroy()
    }
    
    setOnClick(onClick: () => void) {
        const button = this
        this.on('pointerdown', function () {
            button.setTexture(Images.BUTTON_DOWN)
            onClick()
        });
    }

    setDisabled(disabled: boolean) {
        const tint = disabled ? Button.DISABLED_TINT : 0xFFFFFF;
        this.setTint(tint)
        this.iconImage?.setTint(tint)
        this.disabled = disabled
        if (disabled) {
            this.disableInteractive()
        } else {
            this.setInteractive()
        }
    }

    isDisabled() {
        return this.disabled
    }

    setPosition(x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined): this {
        super.setPosition(x, y, z, w)
        this.iconImage?.setPosition(x, y, z, w)
        return this
    }
}