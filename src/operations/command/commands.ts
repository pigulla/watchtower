import { Injections } from '../injections'
import { Queries } from '../query/queries'

import {
    type CollectFloatingGem,
    collectFloatingGemFactory,
} from './collect-floating-gem'
import { type CollectAdGem, collectAdGemFactory } from './collect-ad-gem'
import {
    type CheckNewPerkAvailability,
    checkNewPerkAvailabilityFactory,
} from './check-new-perk-availability'
import {
    type PurchaseUpgrades,
    purchaseUpgradesFactory,
} from './purchase-upgrades'
import { EnsureTabIsOpen, ensureTabIsOpenFactory } from './ensure-tab-is-open'

export type Commands = {
    readonly collectFloatingGem: CollectFloatingGem
    readonly collectAdGem: CollectAdGem
    readonly checkNewPerkAvailability: CheckNewPerkAvailability
    readonly purchaseUpgrades: PurchaseUpgrades
    readonly ensureTabIsOpen: EnsureTabIsOpen
}

export function commandsFactory(
    injections: Injections,
    queries: Queries,
): Commands {
    const ensureTabIsOpen = ensureTabIsOpenFactory(injections, queries)

    return {
        collectFloatingGem: collectFloatingGemFactory(injections),
        collectAdGem: collectAdGemFactory(injections),
        checkNewPerkAvailability: checkNewPerkAvailabilityFactory(injections),
        purchaseUpgrades: purchaseUpgradesFactory(injections, {
            ensureTabIsOpen,
        }),
        ensureTabIsOpen,
    }
}
