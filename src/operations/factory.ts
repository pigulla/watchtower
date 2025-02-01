import type { Injections } from './injections'
import type { Commands } from './command/commands'
import type { Queries } from './query/queries'

import { collectAdGemFactory } from './command/collect-ad-gem'
import { collectFloatingGemFactory } from './command/collect-floating-gem'
import { ensureTabIsOpenFactory } from './command/ensure-tab-is-open'
import { getCashFactory } from './query/get-cash'
import { getCoinsFactory } from './query/get-coins'
import { getGemsFactory } from './query/get-gems'
import { getOpenTabFactory } from './query/get-open-tab'
import { isGameOverFactory } from './query/is-game-over'
import { isNewPertAvailableFactory } from './query/is-new-perk-available'
import { purchaseUpgradesFactory } from './command/purchase-upgrades'

export function factory(injections: Injections): {
    commands: Commands
    queries: Queries
} {
    const queries: Queries = {
        getCash: getCashFactory(injections),
        getCoins: getCoinsFactory(injections),
        getGems: getGemsFactory(injections),
        getOpenTab: getOpenTabFactory(injections),
        isGameOver: isGameOverFactory(injections),
        isNewPerkAvailable: isNewPertAvailableFactory(injections),
    }

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
