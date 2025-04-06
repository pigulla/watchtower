import type { GetAdGemPosition } from './get-ad-gem-position'
import type { GetBuyMultiplier } from './get-buy-multiplier'
import type { GetCash } from './get-cash'
import type { GetCoins } from './get-coins'
import type { GetGems } from './get-gems'
import type { GetOpenTab } from './get-open-tab'
import type { GetUpgradeCost } from './get-upgrade-cost'
import type { GetWave } from './get-wave'
import type { IsGameOver } from './is-game-over'
import type { IsNewPerkAvailable } from './is-new-perk-available'

export type Queries = {
    readonly getAdGemPosition: GetAdGemPosition
    readonly getBuyMultiplier: GetBuyMultiplier
    readonly getCoins: GetCoins
    readonly getCash: GetCash
    readonly getGems: GetGems
    readonly getOpenTab: GetOpenTab
    readonly getUpgradeCost: GetUpgradeCost
    readonly getWave: GetWave
    readonly isGameOver: IsGameOver
    readonly isNewPerkAvailable: IsNewPerkAvailable
}
