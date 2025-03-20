import type { Sharp } from 'sharp'
import shuffle from 'array-shuffle'

import type { Injections } from '../injections'
import { DefenseUpgrade, Tab, Upgrade } from '../../types'
import { uiConfig } from '../../ui-config'
import { OCRMode } from '../../ocr.interface'
import { parseNumber } from '../../util/parse-number'
import type { EnsureTabIsOpen } from './ensure-tab-is-open'
import { centerOf } from '../../util/center-of'

import type { Command } from './command'
import { compareBigint } from '../../util/compare-bigint'
import { GetCash } from '../query/get-cash'

export enum Strategy {
    SEQUENTIAL = 'sequential',
    ROUND_ROBIN = 'round robin',
    CHEAPEST_FIRST = 'cheapest first',
    RANDOM = 'random',
}

export type PurchaseUpgrades = Command

const MAXED = Symbol('max')
const UNPARSABLE = Symbol('unparsable')

type UpgradeSelector = (
    screenshot: Sharp,
) => Promise<{ upgrade: DefenseUpgrade; cost: bigint } | null>

// TODO: Refactor to use a nice generator function instead
// TODO: Add cross-tab purchase support
function getUpgradeSelector({
    strategy,
    upgrades,
    getUpgradeCost,
}: {
    strategy: Strategy
    upgrades: readonly DefenseUpgrade[]
    getUpgradeCost: (
        screenshot: Sharp,
        upgrade: DefenseUpgrade,
    ) => Promise<bigint | typeof MAXED | typeof UNPARSABLE>
}): UpgradeSelector {
    switch (strategy) {
        case Strategy.RANDOM: {
            return async function random(screenshot: Sharp) {
                for (const upgrade of shuffle(upgrades)) {
                    const cost = await getUpgradeCost(screenshot, upgrade)
                    if (typeof cost === 'bigint') {
                        return { upgrade, cost }
                    }
                }
                return null
            }
        }
        case Strategy.CHEAPEST_FIRST: {
            return async function cheapestFirst(screenshot: Sharp) {
                const costs = await Promise.all(
                    upgrades.map(async upgrade => ({
                        upgrade,
                        cost: await getUpgradeCost(screenshot, upgrade),
                    })),
                )
                const cheapest = costs
                    .filter(
                        (
                            item,
                        ): item is { upgrade: DefenseUpgrade; cost: bigint } =>
                            typeof item.cost === 'bigint',
                    )
                    .sort((a, b) => compareBigint(a.cost, b.cost))[0]

                return cheapest
                    ? { upgrade: cheapest.upgrade, cost: cheapest.cost }
                    : null
            }
        }
        case Strategy.ROUND_ROBIN: {
            // const i = 0
            // eslint-disable-next-line @typescript-eslint/require-await
            return async function roundRobin(_screenshot: Sharp) {
                // const result = upgrades[i]
                // i = (i + 1) % upgrades.length

                // TODO: Implement strategy
                return null
            }
        }
        case Strategy.SEQUENTIAL: {
            return async function (screenshot: Sharp) {
                for (const upgrade of upgrades) {
                    const cost = await getUpgradeCost(screenshot, upgrade)
                    if (typeof cost === 'bigint') {
                        return { upgrade, cost }
                    }
                }
                return null
            }
        }
    }
}

export function purchaseUpgradesFactory(
    { getText, takeScreenshot, click, logger }: Injections,
    {
        ensureTabIsOpen,
        getCash,
    }: { ensureTabIsOpen: EnsureTabIsOpen; getCash: GetCash },
    {
        purchase: { strategy, upgrades },
    }: {
        purchase: { strategy: Strategy; upgrades: readonly DefenseUpgrade[] }
    },
): PurchaseUpgrades {
    if (upgrades.length === 0) {
        return (screenshot: Sharp) => Promise.resolve(screenshot)
    }

    async function getUpgradeCost(
        screenshot: Sharp,
        upgrade: Upgrade,
    ): Promise<bigint | typeof MAXED | typeof UNPARSABLE> {
        const title = await getText(
            screenshot,
            uiConfig.tabs.upgrades[upgrade].title,
        )

        if (title !== upgrade.toString()) {
            throw new Error(
                `Expected upgrade title '${upgrade}' but found '${title}'`,
            )
        }

        const cost = await getText(
            screenshot,
            uiConfig.tabs.upgrades[upgrade].cost,
            {
                mode: OCRMode.SINGLE_LINE,
            },
        )

        if (cost === 'Max') {
            return MAXED
        }

        const matches = /^[5S$]\s*(.+)$/.exec(cost)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return matches ? (parseNumber(matches[1]!) ?? UNPARSABLE) : UNPARSABLE
    }

    const selector = getUpgradeSelector({
        strategy,
        upgrades,
        getUpgradeCost,
    })

    return async function purchaseUpgrades(screenshot: Sharp): Promise<Sharp> {
        // TODO: Check if the upgrade can actually be purchased (i.e., there's enough cash available)
        screenshot = await ensureTabIsOpen(screenshot, Tab.DEFENSE_UPGRADES)
        const cash = await getCash(screenshot)
        const selected = await selector(screenshot)

        if (selected === null) {
            logger.verbose(`No upgrade to purchase found`)
            return screenshot
        }
        if (cash !== null && selected.cost > cash) {
            logger.verbose(`Insufficient cash to purchase upgrade`)
            return screenshot
        }

        logger.info(`Purchasing upgrade '${selected.upgrade}'`)
        const position = centerOf(uiConfig.tabs.upgrades[selected.upgrade].cost)
        await click(position)

        return takeScreenshot()
    }
}
