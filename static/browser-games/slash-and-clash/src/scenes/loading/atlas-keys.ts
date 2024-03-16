import { Atlases } from "./assets-definitions";
export const ENEMY_PREFIX = 'enemy_';

export enum AtlasKeys {
    PEASANT_RUN = `peasant_run`,
    PEASANT_RUN_WITH_TREE = `peasant_run_with_tree`,
    SWORDS_MAN_RUN = `swordsman_run`,
    KNIGHT_RUN = `knight_run`,
    CASTLE = `castle`
}

export const keysToFiles: Record<AtlasKeys, { file: Atlases, prefix: string }> = {
    [AtlasKeys.CASTLE]: { file: Atlases.CASTLE, prefix: 'castle' },
    [AtlasKeys.PEASANT_RUN]: { file: Atlases.CHARACTERS, prefix: 'peasant' },
    [AtlasKeys.PEASANT_RUN_WITH_TREE]: { file: Atlases.CHARACTERS, prefix: 'tree_peasant' },
    [AtlasKeys.SWORDS_MAN_RUN]: { file: Atlases.CHARACTERS, prefix: 'swordsman' },
    [AtlasKeys.KNIGHT_RUN]: { file: Atlases.CHARACTERS, prefix: 'knight' },
}