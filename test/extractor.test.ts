import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { glob, readFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

import { createConsola, LogLevels } from 'consola'
import sharp, { type Sharp } from 'sharp'

import { Extractor } from '../src/extractor'
import { UPGRADE_MAXED } from '../src/extractor.interface'
import { OCR } from '../src/ocr'
import { AttackUpgrade, DefenseUpgrade } from '../src/types'

import { schema, type TestCase } from './schema'

/* eslint-disable @typescript-eslint/no-floating-promises */

export const SCREENSHOTS_DIR = join(
    dirname(fileURLToPath(import.meta.url)),
    'screenshots',
)

async function getTestCases(): Promise<
    {
        name: string
        image: Sharp
        expected: TestCase
    }[]
> {
    const result = []

    for await (const file of glob('*.json', { cwd: SCREENSHOTS_DIR })) {
        const name = basename(file, '.json')
        const image = await readFile(join(SCREENSHOTS_DIR, `${name}.jpg`))

        result.push({
            name,
            image: sharp(image),
            expected: schema.parse(
                JSON.parse(
                    readFileSync(
                        join(SCREENSHOTS_DIR, `${name}.json`),
                    ).toString(),
                ),
            ),
        })
    }

    return result
}

const testCases = await getTestCases()

describe('Extractor', () => {
    const logger = createConsola({ level: LogLevels.silent })
    const ocr = new OCR({ logger })
    const extractor = new Extractor({ ocr, logger })

    before(async () => await ocr.start())

    for (const { name, image, expected } of testCases) {
        describe(name, () => {
            it('isGameOver', async () => {
                assert.equal(
                    await extractor.isGameOver(image),
                    expected.isGameOver,
                )
            })

            it('getOpenTab', async () => {
                assert.equal(
                    await extractor.getOpenTab(image),
                    expected.openTab,
                )
            })

            it('getGemCount', async () => {
                assert.equal(await extractor.getGemCount(image), expected.gems)
            })

            it('getCash', async () => {
                const cash = await extractor.getCash(image)

                assert.equal(
                    cash === null ? null : cash.toString(),
                    expected.cash,
                )
            })

            it('getCoins', async () => {
                const coins = await extractor.getCoins(image)

                assert.equal(
                    coins === null ? null : coins.toString(),
                    expected.coins,
                )
            })

            it('getBuyMultiplier', async () => {
                assert.equal(
                    await extractor.getBuyMultiplier(image),
                    expected.buyMultiplier,
                )
            })

            if (!expected.isGameOver) {
                if (expected.upgradeCost.attack !== null) {
                    for (const upgrade of Object.values(AttackUpgrade)) {
                        it(`getUpgradeCost of '${upgrade}'`, async () => {
                            const actual = await extractor.getUpgradeCost(
                                image,
                                upgrade,
                            )

                            assert.equal(
                                typeof actual === 'bigint'
                                    ? actual.toString()
                                    : actual === UPGRADE_MAXED
                                      ? 'Max'
                                      : actual,
                                expected.upgradeCost.attack![upgrade],
                            )
                        })
                    }
                }
                if (expected.upgradeCost.defense !== null) {
                    for (const upgrade of Object.values(DefenseUpgrade)) {
                        it(`getUpgradeCost of '${upgrade}'`, async () => {
                            const actual = await extractor.getUpgradeCost(
                                image,
                                upgrade,
                            )

                            assert.equal(
                                typeof actual === 'bigint'
                                    ? actual.toString()
                                    : actual === UPGRADE_MAXED
                                      ? 'Max'
                                      : actual,
                                expected.upgradeCost.defense![upgrade],
                            )
                        })
                    }
                }
            }

            it('getAdGemButtonPosition', async () => {
                const buttonRegion = await extractor.getAdGemButtonRegion(image)
                assert.equal(expected.isAdGemAvailable, buttonRegion !== null)
            })

            it('isNewPerkAvailable', async () => {
                assert.equal(
                    expected.isNewPerkAvailable,
                    await extractor.isNewPerkAvailable(image),
                )
            })
        })
    }

    after(() => ocr.stop())
})
