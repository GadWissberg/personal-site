import { GameObjects, Scene } from 'phaser';
import { GlobalConstants } from '../../classes/c';
import { Castle } from '../../classes/game_world/castle';
import { Character } from '../../classes/game_world/characters/character';
import { CharacterTypes, characterDefinitions } from '../../classes/game_world/characters/character-types';
import { Peasant } from '../../classes/game_world/characters/peasant';
import { SwordsMan } from '../../classes/game_world/characters/swords-man';
import { Opponent } from '../../classes/game_world/opponents/opponent';
import { OpponentAI } from '../../classes/game_world/opponents/opponent-ai';
import { OpponentModel } from '../../classes/game_world/opponents/opponent-model';
import { SoundPlayer } from '../../classes/game_world/sound-player';
import { Tree } from '../../classes/game_world/tree/tree';
import { TreeSpawner } from '../../classes/game_world/tree/tree-spawner';
import { HudHandler } from '../../classes/ui/hud-handler';
import { Atlases, Images, Sounds } from '../loading/assets-definitions';
import { AtlasKeys, ENEMY_PREFIX, keysToFiles as atlasKeysToFiles } from '../loading/atlas-keys';
import { GameEntitiesGroups } from './game-entities-groups';

export class MainScene extends Scene {

    static readonly RIGHT_SIDE_UNIT_SPAWN_X = 1135;
    static readonly LEFT_SIDE_UNIT_SPAWN_X = GlobalConstants.TARGET_RESOLUTION_WIDTH - this.RIGHT_SIDE_UNIT_SPAWN_X;
    static readonly UNIT_SPAWN_Y = 326;
    static readonly LEFT_SLOPE_HIGH_X = 280;
    static readonly LEFT_SLOPE_LOW_X = 475;
    static readonly RIGHT_SLOPE_HIGH_X = 1000;
    static readonly RIGHT_SLOPE_LOW_X = 805;
    static readonly LEFT_CASTLE_X = 80;
    static readonly CASTLES_Y = 340;
    private static readonly GROUND_DEPTH = 1;
    private static readonly TREE_FALL_OFFSET = 100;
    private static readonly TREE_FALL_DURATION = 3 * 1000;
    private static readonly TREE_FALL_ANGLE = 50;

    private readonly soundPlayer = new SoundPlayer()
    private readonly enemyAi: OpponentAI = new OpponentAI(this.soundPlayer);
    private readonly playerOpponent: Opponent = new Opponent(true, this.soundPlayer)
    private readonly treeSpawner: TreeSpawner = new TreeSpawner()
    private readonly hud: HudHandler = new HudHandler()
    private gameEntitiesGroups: GameEntitiesGroups | null = null
    private gameInProgress: boolean = true;

    constructor() {
        super('main-scene');
    }

    create(): void {
        this.initAnimations()
        this.gameEntitiesGroups = new GameEntitiesGroups(this.physics);
        this.initializeColliders();
        this.initCamera()
        this.physics.world.setBounds(0, 0, GlobalConstants.TARGET_RESOLUTION_WIDTH, GlobalConstants.TARGET_RESOLUTION_HEIGHT);
        this.add.sprite(GlobalConstants.TARGET_RESOLUTION_WIDTH / 2, GlobalConstants.TARGET_RESOLUTION_HEIGHT / 2, Images.SKY).depth = -2;
        this.add.sprite(GlobalConstants.TARGET_RESOLUTION_WIDTH / 2, GlobalConstants.TARGET_RESOLUTION_HEIGHT / 2, Images.GROUND).depth = MainScene.GROUND_DEPTH;
        const topBar = new GameObjects.Sprite(this, 0, 0, Images.TOP_BAR)
        this.hud.init(this, this.playerOpponent, this.gameEntitiesGroups)
        this.add.existing(topBar)
        topBar.setPosition(topBar.width / 2, topBar.height / 2)
        this.addCastle(MainScene.LEFT_CASTLE_X, MainScene.CASTLES_Y, false, false);
        this.addCastle(GlobalConstants.TARGET_RESOLUTION_WIDTH - MainScene.LEFT_CASTLE_X, MainScene.CASTLES_Y, true, true);
        this.soundPlayer.init(this)
    }



    update(time: number, delta: number): void {
        super.update(time, delta)
        this.hud.update(this, this.playerOpponent)
        if (this.gameInProgress) {
            this.treeSpawner.update(this.gameEntitiesGroups!!.getTrees(), this.time.now, this)
        }
        this.enemyAi.update(this, this.gameEntitiesGroups!!.getCharacters())
    }



    private initAnimations(): void {
        const values = Object.values(AtlasKeys)
        for (const atlasKey of values) {
            if (typeof atlasKey === 'string') {
                this.createAnimation(atlasKey, atlasKeysToFiles[atlasKey].file, atlasKeysToFiles[atlasKey].prefix);
                this.createAnimation(ENEMY_PREFIX + atlasKey, ENEMY_PREFIX + atlasKeysToFiles[atlasKey].file, atlasKeysToFiles[atlasKey].prefix);
            }
        }
    }

    private createAnimation(key: string, file: string, prefix: string) {
        this.anims.create({
            repeat: -1,
            key: key,
            frames: this.anims.generateFrameNames(file, {
                prefix: `${prefix}_`,
                end: 3,
            }),
            frameRate: 8,
        });
    }

    private initializeColliders() {
        this.initializeCollisionCharactersTrees();
        this.initializeCollisionCharactersCastles();
        this.initializeCollisionCharacters();
    }

    private initializeCollisionCharactersCastles() {
        this.physics.add.overlap(this.gameEntitiesGroups!!.getCharacters(), this.gameEntitiesGroups!!.getCastles(), ((character, castle) => {
            const characterObject = <Character>character;
            if (characterObject.isDead()) return
            const castleObject = <Castle>castle;
            if (characterObject.characterType == CharacterTypes.PEASANT) {
                this.handlePeasantCastleCollision(characterObject, castleObject);
            } else {
                this.handleFightingCharacterCastleCollision(characterObject, castleObject);
            }
        }), undefined, this);
    }

    private handleFightingCharacterCastleCollision(characterObject: Character, castleObject: Castle) {
        const swordsMan = <SwordsMan>characterObject;
        if (castleObject.isPlayer != characterObject.opponentModel.isPlayer) {
            swordsMan.die(true);
            this.soundPlayer.play(Sounds.SWORD_0, Sounds.SWORD_1, Sounds.SWORD_2)
            castleObject.takeDamage();
            if (castleObject.getHp() <= 0) {
                const tweenConfig = {
                    targets: castleObject,
                    x: castleObject.x,
                    y: castleObject.y + castleObject.height,
                    duration: 5 * 1000,
                    angle: castleObject.angle + 20 * (Math.random() < 0.5 ? 1 : -1),
                    ease: 'Expo.In',
                    onComplete: () => {
                        castleObject.destroy();
                        this.soundPlayer.play(castleObject.isPlayer ? Sounds.LOSE : Sounds.WIN)
                        this.hud.gameFinished(this, castleObject.isPlayer ? "Game Over!" : "You Win!")
                        this.gameInProgress = false
                        this.enemyAi.gameInProgress = false
                        this.gameEntitiesGroups!!.getCharacters().getChildren().forEach(function (gameObject) {
                            (<Character>gameObject).setIdle()
                        }, this);
                    },
                };
                this.soundPlayer.play(Sounds.CASTLE_FALL)
                this.tweens.add(tweenConfig);
            }
            if (castleObject.isPlayer) {
                this.hud.updateHpIndicator(castleObject.getHp());
            }
        }
    }

    private handlePeasantCastleCollision(characterObject: Character, castleObject: Castle) {
        const peasant = <Peasant>characterObject;
        if (castleObject.isPlayer == characterObject.opponentModel.isPlayer) {
            const treeValue = peasant.getTreeValue();
            if (treeValue > 0) {
                peasant.destroy();
                peasant.opponentModel.trees += treeValue;
                if (peasant.opponentModel.isPlayer) {
                    this.hud.addLabelEffect(this, treeValue, HudHandler.LABEL_TREES_X, HudHandler.LABELS_Y, 0x00e235);
                    this.hud.updateTreesLabelValue(peasant.opponentModel.trees);
                }
            } else if (peasant.getDirection() > 0) {
                peasant.flipDirection();
            }
        } else {
            peasant.flipDirection();
        }
    }

    private initializeCollisionCharacters() {
        this.physics.add.overlap(this.gameEntitiesGroups!!.getCharacters(), this.gameEntitiesGroups!!.getCharacters(), ((character1, character2) => {
            const char1Obj = <Character>character1;
            const char2Obj = <Character>character2;
            const character1Type = char1Obj.characterType;
            const character2Type = char2Obj.characterType;
            const char1Def = characterDefinitions.get(character1Type);
            const char2Def = characterDefinitions.get(character2Type);
            const char1OpponentModel = char1Obj.opponentModel;
            const char2OpponentModel = char2Obj.opponentModel;
            if ((char1OpponentModel.isPlayer == char2OpponentModel.isPlayer) || char1Obj.isDead() || char2Obj.isDead() || (!char1Def!!.attacks && !char2Def!!.attacks)) return

            if (character1Type > character2Type) {
                this.killCharacter(char2Obj, char1OpponentModel);
            } else if (character1Type < character2Type) {
                this.killCharacter(char1Obj, char2OpponentModel);
            } else {
                this.killCharacter(char1Obj, char2OpponentModel);
                this.killCharacter(char2Obj, char1OpponentModel);
            }
        }), undefined, this);
    }

    private killCharacter(character: Character, rivalModel: OpponentModel) {
        character.die();
        this.soundPlayer.play(Sounds.SWORD_0, Sounds.SWORD_1, Sounds.SWORD_2)
        const gold = characterDefinitions.get(character.characterType)!!.goldWorth;
        if (gold > 0) {
            rivalModel.gold += gold;
            if (rivalModel.isPlayer) {
                this.hud.updateGoldLabelValue(rivalModel.gold);
                this.hud.addLabelEffect(this, rivalModel.gold, HudHandler.LABEL_GOLD_X, HudHandler.LABELS_Y, 0x00e235);
            }
        }
    }

    private initializeCollisionCharactersTrees() {
        this.physics.add.overlap(this.gameEntitiesGroups!!.getCharacters(), this.gameEntitiesGroups!!.getTrees(), ((character, tree) => {
            const characterObject = <Character>character;
            if (characterObject.isDead() || characterObject.characterType != CharacterTypes.PEASANT) return

            const peasant = <Peasant>characterObject;
            const treeObject = <Tree>tree;
            if (!peasant.getTreeValue() && treeObject.cuttable) {
                const treeObject = <Tree>tree;
                const tweenConfig = {
                    targets: tree,
                    x: treeObject.x,
                    y: treeObject.y + MainScene.TREE_FALL_OFFSET,
                    duration: MainScene.TREE_FALL_DURATION,
                    angle: treeObject.angle + MainScene.TREE_FALL_ANGLE * (Math.random() < 0.5 ? 1 : -1),
                    ease: 'Expo.In',
                    onComplete: () => {
                        tree.destroy();
                    },
                };
                this.soundPlayer.play(Sounds.TREE_FALL_0, Sounds.TREE_FALL_1, Sounds.TREE_FALL_2)
                this.tweens.add(tweenConfig);
                peasant.applyTree(treeObject.getSize() + 1);
                treeObject.cuttable = false
            }
        }), undefined, this);
    }

    private addCastle(x: number, y: number, flip: boolean, isPlayer: boolean) {
        const castle = new Castle(this, Atlases.CASTLE, isPlayer);
        castle.setFlipX(flip)
        castle.setPosition(x, y - castle.height / 2);
        this.gameEntitiesGroups!!.getCastles().add(castle)
        return castle
    }

    private initCamera(): void {
        this.cameras.main.setSize(GlobalConstants.TARGET_RESOLUTION_WIDTH, GlobalConstants.TARGET_RESOLUTION_HEIGHT);
        this.cameras.main.setPosition(
            this.sys.game.canvas.width / 2 - GlobalConstants.TARGET_RESOLUTION_WIDTH / 2,
            this.sys.game.canvas.height / 2 - GlobalConstants.TARGET_RESOLUTION_HEIGHT / 2);
    }
}