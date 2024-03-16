import { AtlasKeys } from "../../../scenes/loading/atlas-keys";


export enum CharacterTypes {
    PEASANT,
    SWORDS_MAN,
    KNIGHT
}

export class CharacterDefinition {
    constructor(
        readonly type: CharacterTypes,
        readonly atlasKey: AtlasKeys,
        readonly treeCost: number,
        readonly goldCost: number,
        readonly trainDuration: number,
        readonly goldWorth: number,
        readonly attacks: boolean = true) { }
}
export const characterDefinitions: Map<CharacterTypes, CharacterDefinition> = new Map();

characterDefinitions.set(CharacterTypes.PEASANT, new CharacterDefinition(CharacterTypes.PEASANT, AtlasKeys.PEASANT_RUN, 0, 0, 5, 1, false));
characterDefinitions.set(CharacterTypes.SWORDS_MAN, new CharacterDefinition(CharacterTypes.SWORDS_MAN, AtlasKeys.SWORDS_MAN_RUN, 1, 0, 6, 2));
characterDefinitions.set(CharacterTypes.KNIGHT, new CharacterDefinition(CharacterTypes.KNIGHT, AtlasKeys.KNIGHT_RUN, 2, 1, 6, 3));
