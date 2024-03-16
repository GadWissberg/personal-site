import { Scene } from "phaser";
import { GameEntity } from "../game-object";
import { Images } from "../../../scenes/loading/assets-definitions";

export class Tree extends GameEntity {
    private static GROWING_INTERVAL_MIN = 3 * 1000;
    private static GROWING_INTERVAL_MAX = 10 * 1000;
    private static readonly sizes: Images[] = [Images.TREE_SMALL, Images.TREE_MED, Images.TREE_HIGH]

    cuttable: boolean = true;
    private size: number;
    private nextGrowingTime = 0;


    constructor(scene: Scene) {
        super(scene, 0, 0, Images.TREE_SMALL, true)
        this.size = 0
        this.calculateNextGrowingTime();
        this.body?.setSize(this.width / 3, this.height / 3)
        this.body?.setOffset(this.width / 3, 2 * this.height / 3)
        if (this.body != null) {
            this.body.enable = false;
        }
        this.setImmovable(true)
        this.setPushable(false)
    }

    getSize(): number {
        return this.size
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        if (this.cuttable && this.body?.enable && this.size < Tree.sizes.length - 1 && this.scene.time.now >= this.nextGrowingTime) {
            this.size++
            this.setTexture(Tree.sizes[this.size])
            this.calculateNextGrowingTime();
        }
    }

    private calculateNextGrowingTime() {
        this.nextGrowingTime = this.scene.time.now + Tree.GROWING_INTERVAL_MIN + (Tree.GROWING_INTERVAL_MAX - Tree.GROWING_INTERVAL_MIN) * Math.random();
    }
}