import { GlobalConstants } from "../../../classes/c";

export class OpponentModel {
    nextUnitTrainEnableTime = 0;
    trees = GlobalConstants.START_WITH_TREES_AND_GOLD;
    gold = GlobalConstants.START_WITH_TREES_AND_GOLD;

    constructor(readonly isPlayer: boolean) {

    }

}