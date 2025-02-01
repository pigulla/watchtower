import type { GetCoins } from './get-coins'
import type { GetCash } from './get-cash'
import type { GetOpenTab } from './get-open-tab'
import { GetGems } from './get-gems'

export type Queries = {
    readonly getCoins: GetCoins
    readonly getCash: GetCash
    readonly getGems: GetGems
    readonly getOpenTab: GetOpenTab
}
