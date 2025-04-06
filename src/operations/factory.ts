import type { Injections } from './injections'
import type { Commands } from './command/commands'
import type { Queries } from './query/queries'

import { collectAdGemFactory } from './command/collect-ad-gem'
import { collectFloatingGemFactory } from './command/collect-floating-gem'
import { ensureTabIsOpenFactory } from './command/ensure-tab-is-open'
import { getBuyMultiplierFactory } from './query/get-buy-multiplier'
import { getCashFactory } from './query/get-cash'
import { getCoinsFactory } from './query/get-coins'
import { getGemsFactory } from './query/get-gems'
import { getOpenTabFactory } from './query/get-open-tab'
import { getWaveFactory } from './query/get-wave'
import { isGameOverFactory } from './query/is-game-over'
import { isNewPertAvailableFactory } from './query/is-new-perk-available'
import { purchaseUpgradesFactory, Strategy } from './command/purchase-upgrades'
import { getAdGemPositionFactory } from './query/get-ad-gem-position'
import { getUpgradeCostFactory } from './query/get-upgrade-cost'
import { moveCursorToIdlePositionFactory } from './command/move-cursor-to-idle-position'
import { DefenseUpgrade } from '../types'

export function queryFactory(injections: Injections): Queries {
    return {
        getAdGemPosition: getAdGemPositionFactory(injections),
        getBuyMultiplier: getBuyMultiplierFactory(injections),
        getCash: getCashFactory(injections),
        getCoins: getCoinsFactory(injections),
        getGems: getGemsFactory(injections),
        getOpenTab: getOpenTabFactory(injections),
        getUpgradeCost: getUpgradeCostFactory(injections),
        getWave: getWaveFactory(injections),
        isGameOver: isGameOverFactory(injections),
        isNewPerkAvailable: isNewPertAvailableFactory(injections),
    }
}

export function factory(
    injections: Injections,
    options: {
        purchase: { strategy: Strategy; upgrades: readonly DefenseUpgrade[] }
    },
): {
    commands: Commands
    queries: Queries
} {
    const queries = queryFactory(injections)

    const ensureTabIsOpen = ensureTabIsOpenFactory(injections, queries)
    const getCash = getCashFactory(injections)
    const commands = {
        collectFloatingGem: collectFloatingGemFactory(injections, queries),
        collectAdGem: collectAdGemFactory(injections),
        moveToIdlePosition: moveCursorToIdlePositionFactory(
            injections,
            queries,
        ),
        purchaseUpgrades: purchaseUpgradesFactory(
            injections,
            {
                ensureTabIsOpen,
                getCash,
            },
            options,
        ),
        ensureTabIsOpen,
    }

    return { queries, commands }
}
