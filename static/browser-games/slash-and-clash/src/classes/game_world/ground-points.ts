import { GlobalConstants } from "../c"

export class Position {
    constructor(public readonly x: number, public readonly y: number) { }
}

export abstract class GroundPoints {
    static readonly LEFT_HIGH_GROUND_LEFT_EDGE = new Position(0, 340)
    static readonly LEFT_HIGH_GROUND_RIGHT_EDGE = new Position(275, this.LEFT_HIGH_GROUND_LEFT_EDGE.y)
    static readonly LOW_GROUND_LEFT_EDGE = new Position(465, 540)
    static readonly LOW_GROUND_RIGHT_EDGE = new Position(GlobalConstants.TARGET_RESOLUTION_WIDTH - this.LOW_GROUND_LEFT_EDGE.x, this.LOW_GROUND_LEFT_EDGE.y)
    static readonly RIGHT_HIGH_GROUND_LEFT_EDGE = new Position(GlobalConstants.TARGET_RESOLUTION_WIDTH - this.LEFT_HIGH_GROUND_RIGHT_EDGE.x, this.LEFT_HIGH_GROUND_LEFT_EDGE.y)
    static readonly RIGHT_HIGH_GROUND_RIGHT_EDGE = new Position(GlobalConstants.TARGET_RESOLUTION_WIDTH, this.LEFT_HIGH_GROUND_LEFT_EDGE.y)
}