import type { Sharp } from 'sharp'

import type { Injections } from '../injections'
import { tabOf, Upgrade } from '../../types'
import { uiConfig } from '../../ui-config'
import { OCRMode } from '../../ocr.interface'
import { parseNumber } from '../../util/parse-number'
import type { EnsureTabIsOpen } from './ensure-tab-is-open'
import { centerOf } from '../../util/center-of'

import type { Command } from './command'

export enum PurchaseStrategy {
    SEQUENTIAL = 'sequential',
    ROUND_ROBIN = 'round robin',
    CHEAPEST_FIRST = 'cheapest first',
    RANDOM = 'random',
}

export type PurchaseUpgrades = Command<[PurchaseStrategy, readonly Upgrade[]]>

export function purchaseUpgradesFactory(
    { getText, takeScreenshot, click, logger }: Injections,
    { ensureTabIsOpen }: { ensureTabIsOpen: EnsureTabIsOpen },
): PurchaseUpgrades {
    const MAXED = Symbol('max')
    const UNPARSABLE = Symbol('unparsable')

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

    return async function purchaseUpgrades(
        screenshot: Sharp,
        strategy: PurchaseStrategy,
        upgrades: readonly Upgrade[],
    ): Promise<Sharp> {
        // TODO: Implement other strategies
        if (strategy !== PurchaseStrategy.SEQUENTIAL) {
            throw new Error(`Strategy '${strategy}' not yet supported`)
        }

        // TODO: Check if the upgrade can actually be purchased (i.e., there's enough cash available)

        for (const upgrade of upgrades) {
            screenshot = await ensureTabIsOpen(screenshot, tabOf(upgrade))

            const cost = await getUpgradeCost(screenshot, upgrade)

            if (cost === MAXED) {
                logger.debug(`Upgrade '${upgrade}' is maxed`)
            } else if (cost === UNPARSABLE) {
                logger.info(`Failed to parse cost for upgrade '${upgrade}`)
            } else {
                logger.info(`Purchasing upgrade '${upgrade}'`)
                const position = centerOf(uiConfig.tabs.upgrades[upgrade].cost)
                await click(position)
                screenshot = await takeScreenshot()
                break
            }
        }

        return screenshot
    }
}
