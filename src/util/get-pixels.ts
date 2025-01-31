import assert from 'node:assert/strict'

import ndarray from 'ndarray'
import { type Sharp } from 'sharp'

import { type RGB } from '../types'

import { type Position } from './position'

export async function getPixels(
    image: Sharp,
    positions: Position[],
): Promise<RGB[]> {
    const { data, info } = await image
        .clone()
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
    const pixels = ndarray(
        new Uint8Array(data),
        [info.width, info.height, 3],
        [3, Math.trunc(3 * info.width), 1],
        0,
    )

    return positions.map(({ x, y }) => {
        assert(x >= 0 && x < info.height)
        assert(y >= 0 && x < info.width)
        return [pixels.get(x, y, 0), pixels.get(x, y, 1), pixels.get(x, y, 2)]
    })
}
