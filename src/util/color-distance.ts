import { type RGB } from '../types'

export function colorDistance(a: RGB, b: RGB): number {
    return Math.sqrt(
        Math.pow(b[0] - a[0], 2) +
            Math.pow(b[1] - a[1], 2) +
            Math.pow(b[1] - a[1], 2),
    )
}
