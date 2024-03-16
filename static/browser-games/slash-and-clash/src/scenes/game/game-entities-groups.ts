export class GameEntitiesGroups {
    private readonly characters: Phaser.Physics.Arcade.Group;
    private readonly trees: Phaser.Physics.Arcade.Group;
    private readonly castles: Phaser.Physics.Arcade.Group;

    constructor(physics: Phaser.Physics.Arcade.ArcadePhysics) {
        this.characters = physics.add.group();
        this.trees = physics.add.group();
        this.castles = physics.add.group();
    }

    getCharacters(): Phaser.Physics.Arcade.Group {
        return this.characters
    }

    getTrees() {
        return this.trees
    }

    getCastles() {
        return this.castles
    }

}