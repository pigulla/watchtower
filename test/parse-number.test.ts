import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { parseNumber } from '../src/util/parse-number'

const testCases: [string, bigint | null][] = [
    ['7', BigInt('7')],
    ['100', BigInt('100')],
    ['109.81 K', BigInt('109810')],
    ['849.90K', BigInt('849900')],
    ['155.96B', BigInt('155960000000')],
    ['0.99M', BigInt('990000')],
    ['123.00B', BigInt('123000000000')],
]

/* eslint-disable @typescript-eslint/require-await,@typescript-eslint/no-floating-promises */

describe('parseNumber', () => {
    for (const [input, expected] of testCases) {
        it(`should parse '${input}'`, () => {
            assert.equal(parseNumber(input), expected)
        })
    }
})
