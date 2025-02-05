import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { glob, readFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { after, describe, it, mock } from 'node:test'
import { fileURLToPath } from 'node:url'

import { createConsola, LogLevels } from 'consola'
import sharp, { type Sharp } from 'sharp'

import { AttackUpgrade, DefenseUpgrade, UPGRADE_MAXED } from '../src/types'
import { Injections } from '../src/operations/injections'
import { queryFactory } from '../src/operations/factory'
import { getTextFactory } from '../src/external/get-text'
import { getNumberFactory } from '../src/external/get-number'

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

describe('Queries', () => {
    const logger = createConsola({ level: LogLevels.silent })
    const { getText, stop } = getTextFactory({ logger })
    const getNumber = getNumberFactory({ getText, logger })

    const injectionMocks = {
        clickAt: mock.fn(),
        getNumber,
        getText,
        moveCursorTo: mock.fn(),
        playSound: mock.fn(),
        takeScreenshot: mock.fn(),
        logger,
    } satisfies Injections

    const queries = queryFactory(injectionMocks)

    for (const { name, image, expected } of testCases) {
        describe(name, () => {
            it('getAdGemPosition', async () => {
                assert.equal(
                    (await queries.getAdGemPosition(image)) !== null,
                    expected.isAdGemAvailable,
                )
            })

            it('getBuyMultiplier', async () => {
                assert.equal(
                    await queries.getBuyMultiplier(image),
                    expected.buyMultiplier,
                )
            })

            it('getCash', async () => {
                const cash = await queries.getCash(image)

                assert.equal(
                    cash === null ? null : cash.toString(),
                    expected.cash,
                )
            })

            it('getGems', async () => {
                assert.equal(await queries.getGems(image), expected.gems)
            })

            it('getCoins', async () => {
                const coins = await queries.getCoins(image)

                assert.equal(
                    coins === null ? null : coins.toString(),
                    expected.coins,
                )
            })

            it('getOpenTab', async () => {
                assert.equal(await queries.getOpenTab(image), expected.openTab)
            })

            it('isGameOver', async () => {
                assert.equal(
                    await queries.isGameOver(image),
                    expected.isGameOver,
                )
            })

            it('isNewPerkAvailable', async () => {
                assert.equal(
                    expected.isNewPerkAvailable,
                    await queries.isNewPerkAvailable(image),
                )
            })

            if (!expected.isGameOver) {
                if (expected.upgradeCost.attack !== null) {
                    for (const upgrade of Object.values(AttackUpgrade)) {
                        it(`getUpgradeCost of '${upgrade}'`, async () => {
                            const actual = await queries.getUpgradeCost(
                                image,
                                upgrade,
                            )

                            assert.equal(
                                typeof actual === 'bigint'
                                    ? actual.toString()
                                    : actual === UPGRADE_MAXED
                                      ? 'Max'
                                      : actual,
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                expected.upgradeCost.attack![upgrade],
                            )
                        })
                    }
                }

                if (expected.upgradeCost.defense !== null) {
                    for (const upgrade of Object.values(DefenseUpgrade)) {
                        if (upgrade !== DefenseUpgrade.HEALTH) continue

                        it(`getUpgradeCost of '${upgrade}'`, async () => {
                            const actual = await queries.getUpgradeCost(
                                image,
                                upgrade,
                            )

                            assert.equal(
                                typeof actual === 'bigint'
                                    ? actual.toString()
                                    : actual === UPGRADE_MAXED
                                      ? 'Max'
                                      : actual,
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                expected.upgradeCost.defense![upgrade],
                            )
                        })
                    }
                }
            }
        })
    }

    after(() => stop())
})
