import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { formatNumber } from '../src/util/format-number'

const testCases: [bigint, string][] = [
    [BigInt('1'), '1'],
    [BigInt('12'), '12'],
    [BigInt('123'), '123'],
    [BigInt('1234'), '1.23K'],
    [BigInt('12345'), '12.35K'],
    [BigInt('123456'), '123.46K'],
    [BigInt('1234567'), '1.23M'],
    [BigInt('12345678'), '12.35M'],
    [BigInt('123456789'), '123.46M'],
    [BigInt('1234567890'), '1.23B'],
]

/* eslint-disable @typescript-eslint/require-await,@typescript-eslint/no-floating-promises */

describe('formatNumber', () => {
    for (const [input, expected] of testCases) {
        it(`should format '${input}'`, () => {
            assert.equal(formatNumber(input), expected)
        })
    }
})
