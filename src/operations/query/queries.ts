import type { GetCash } from './get-cash'
import type { GetCoins } from './get-coins'
import type { GetGems } from './get-gems'
import type { GetOpenTab } from './get-open-tab'
import type { IsGameOver } from './is-game-over'
import type { IsNewPerkAvailable } from './is-new-perk-available'

export type Queries = {
    readonly getCoins: GetCoins
    readonly getCash: GetCash
    readonly getGems: GetGems
    readonly getOpenTab: GetOpenTab
    readonly isGameOver: IsGameOver
    readonly isNewPerkAvailable: IsNewPerkAvailable
}
