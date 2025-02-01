import type { Injections } from './injections'
import type { Commands } from './command/commands'
import type { Queries } from './query/queries'

import { checkNewPerkAvailabilityFactory } from './command/check-new-perk-availability'
import { collectAdGemFactory } from './command/collect-ad-gem'
import { collectFloatingGemFactory } from './command/collect-floating-gem'
import { ensureTabIsOpenFactory } from './command/ensure-tab-is-open'
import { getCashFactory } from './query/get-cash'
import { getCoinsFactory } from './query/get-coins'
import { getGemsFactory } from './query/get-gems'
import { getOpenTabFactory } from './query/get-open-tab'
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
    }

    const ensureTabIsOpen = ensureTabIsOpenFactory(injections, queries)
    const commands = {
        collectFloatingGem: collectFloatingGemFactory(injections),
        collectAdGem: collectAdGemFactory(injections),
        checkNewPerkAvailability: checkNewPerkAvailabilityFactory(injections),
        purchaseUpgrades: purchaseUpgradesFactory(injections, {
            ensureTabIsOpen,
        }),
        ensureTabIsOpen,
    }

    return { queries, commands }
}
