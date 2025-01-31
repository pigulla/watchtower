import { Injections } from './action'
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

export type Actions = {
    collectFloatingGem: CollectFloatingGem
    collectAdGem: CollectAdGem
    checkNewPerkAvailability: CheckNewPerkAvailability
    purchaseUpgrades: PurchaseUpgrades
    ensureTabIsOpen: EnsureTabIsOpen
}

export function actionsFactory(injections: Injections): Actions {
    const ensureTabIsOpen = ensureTabIsOpenFactory(injections)

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
