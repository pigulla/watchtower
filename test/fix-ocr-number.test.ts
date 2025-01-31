import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { fixOcrNumber } from '../src/util/fix-ocr-number'

const testCases: [string, string][] = [
    ['O', '0'],
    ['7', '7'],
    ['100', '100'],
    ['1O0', '100'],
    ['109.9OM', '109.90M'],
    ['4.900', '4.90O'],
    ['4.9OO', '4.90O'],
    ['109.81 K', '109.81K'],
]

/* eslint-disable @typescript-eslint/require-await,@typescript-eslint/no-floating-promises */

describe('fixOcrNumber', () => {
    for (const [input, expected] of testCases) {
        it(`should turn '${input}' into '${expected}'`, () => {
            assert.equal(fixOcrNumber(input), expected)
        })
    }
})
