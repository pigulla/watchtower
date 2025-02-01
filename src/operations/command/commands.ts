import type { CollectAdGem } from './collect-ad-gem'
import type { CollectFloatingGem } from './collect-floating-gem'
import type { EnsureTabIsOpen } from './ensure-tab-is-open'
import type { PurchaseUpgrades } from './purchase-upgrades'

export type Commands = {
    readonly collectAdGem: CollectAdGem
    readonly collectFloatingGem: CollectFloatingGem
    readonly ensureTabIsOpen: EnsureTabIsOpen
    readonly purchaseUpgrades: PurchaseUpgrades
}
