import { Scene } from "phaser";
import { GlobalConstants } from "../../c";
import { GroundPoints } from "../ground-points";
import { Tree } from "./tree";

export class TreeSpawner {
    static readonly TREE_SPAWN_POSITION_MINIMUM_X_RELATIVE = 180;
    private static readonly MAX_TREES = 10;
    private static readonly TREE_SPAWN_INTERVAL_MIN = 3000;
    private static readonly TREE_SPAWN_INTERVAL_MAX = 10000;
    private static readonly groundPoints = [
        GroundPoints.LEFT_HIGH_GROUND_LEFT_EDGE,
        GroundPoints.LEFT_HIGH_GROUND_RIGHT_EDGE,
        GroundPoints.LOW_GROUND_LEFT_EDGE,
        GroundPoints.LOW_GROUND_RIGHT_EDGE,
        GroundPoints.RIGHT_HIGH_GROUND_LEFT_EDGE,
        GroundPoints.RIGHT_HIGH_GROUND_RIGHT_EDGE]
    private static readonly SIDE_PLAYER: number = 1;

    private nextTreeCreation: number = 0
    private sideToSpawnTree = 1;

    update(trees: Phaser.Physics.Arcade.Group, now: number, scene: Scene) {
        if (trees.getLength() < TreeSpawner.MAX_TREES && now >= this.nextTreeCreation) {
            this.spawnTree(trees, scene);
            this.nextTreeCreation += TreeSpawner.TREE_SPAWN_INTERVAL_MIN + Math.random() * (TreeSpawner.TREE_SPAWN_INTERVAL_MAX - TreeSpawner.TREE_SPAWN_INTERVAL_MIN)
        }
    }

    private spawnTree(trees: Phaser.Physics.Arcade.Group, scene: Scene) {
        const MAX_X = GlobalConstants.TARGET_RESOLUTION_WIDTH - TreeSpawner.TREE_SPAWN_POSITION_MINIMUM_X_RELATIVE;
        this.sideToSpawnTree *= -1
        var spawnX: number = 0
        if (this.sideToSpawnTree == TreeSpawner.SIDE_PLAYER) {
            const leftEdge = GlobalConstants.TARGET_RESOLUTION_WIDTH / 2
            const rightEdge = MAX_X
            spawnX = leftEdge + Math.random() * (rightEdge - leftEdge)
        } else {
            const leftEdge = TreeSpawner.TREE_SPAWN_POSITION_MINIMUM_X_RELATIVE
            const rightEdge = GlobalConstants.TARGET_RESOLUTION_WIDTH / 2
            spawnX = leftEdge + Math.random() * (rightEdge - leftEdge)
        }
        let spawnY = 0
        for (let i = 1; i < TreeSpawner.groundPoints.length; i++) {
            const currentGroundPoint = TreeSpawner.groundPoints[i];
            if (currentGroundPoint.x > spawnX) {
                const prevPoint = TreeSpawner.groundPoints[i - 1]
                const slope = (prevPoint.y - currentGroundPoint.y) / (prevPoint.x - currentGroundPoint.x);
                spawnY = currentGroundPoint.y + slope * (spawnX - currentGroundPoint.x);
                break
            }
        }
        const tree = new Tree(scene);
        tree.setPosition(spawnX, spawnY - tree.height / 2);
        trees.add(tree)
    }
}