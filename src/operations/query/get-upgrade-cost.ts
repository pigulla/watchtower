import type { Injections } from '../injections'
import type { Sharp } from 'sharp'

import { OCRMode } from '../../ocr.interface'
import { Upgrade, UPGRADE_MAXED } from '../../types'
import { parseNumber } from '../../util/parse-number'
import { uiConfig } from '../../ui-config'

import { Query } from './query'

export type GetUpgradeCost = Query<
    bigint | typeof UPGRADE_MAXED | null,
    [Upgrade]
>

export function getUpgradeCostFactory({ getText }: Injections): GetUpgradeCost {
    return async function getUpgradeCost(
        screenshot: Sharp,
        upgrade: Upgrade,
    ): Promise<bigint | typeof UPGRADE_MAXED | null> {
        const title = await getText(
            screenshot,
            uiConfig.tabs.upgrades[upgrade].title,
        )

        if (title !== upgrade.toString()) {
            throw new Error(
                `Expected upgrade title '${upgrade}' but found '${title}'`,
            )
        }

        for (const threshold of [undefined, 96, 192]) {
            const cost = await getText(
                screenshot,
                uiConfig.tabs.upgrades[upgrade].cost,
                {
                    mode: OCRMode.SINGLE_LINE,
                    threshold,
                },
            )

            if (cost === 'Max') {
                return UPGRADE_MAXED
            }

            const matches = /^[5S$]\s*(.+)$/.exec(cost)

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return matches ? parseNumber(matches[1]!) : null
        }

        return null
    }
}
