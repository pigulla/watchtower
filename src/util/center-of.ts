import { type Position } from './position'
import { type Region } from './region'

export function centerOf(region: Region): Position {
    return {
        x: Math.floor(region.left + region.width / 2),
        y: Math.floor(region.top + region.height / 2),
    }
}
