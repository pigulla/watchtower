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
import { isGameOverFactory } from './query/is-game-over'
import { isNewPertAvailableFactory } from './query/is-new-perk-available'
import { purchaseUpgradesFactory } from './command/purchase-upgrades'
import { getAdGemPositionFactory } from './query/get-ad-gem-position'
import { getUpgradeCostFactory } from './query/get-upgrade-cost'

export function queryFactory(injections: Injections): Queries {
    return {
        getAdGemPosition: getAdGemPositionFactory(injections),
        getBuyMultiplier: getBuyMultiplierFactory(injections),
        getCash: getCashFactory(injections),
        getCoins: getCoinsFactory(injections),
        getGems: getGemsFactory(injections),
        getOpenTab: getOpenTabFactory(injections),
        getUpgradeCost: getUpgradeCostFactory(injections),
        isGameOver: isGameOverFactory(injections),
        isNewPerkAvailable: isNewPertAvailableFactory(injections),
    }
}

export function factory(injections: Injections): {
    commands: Commands
    queries: Queries
} {
    const queries = queryFactory(injections)

    const ensureTabIsOpen = ensureTabIsOpenFactory(injections, queries)
    const commands = {
        collectFloatingGem: collectFloatingGemFactory(injections, queries),
        collectAdGem: collectAdGemFactory(injections),
        purchaseUpgrades: purchaseUpgradesFactory(injections, {
            ensureTabIsOpen,
        }),
        ensureTabIsOpen,
    }

    return { queries, commands }
}
