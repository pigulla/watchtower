import { type Sharp } from 'sharp'

import { type BuyMultiplier, type Tab, type Upgrade } from './types'
import { type ApplicationRegion } from './util/region'

export const UPGRADE_MAXED = Symbol('upgrade-maxed')

export interface IExtractor {
    isGameOver(screenshot: Sharp): Promise<boolean>
    getUpgradeCost(
        screenshot: Sharp,
        upgrade: Upgrade,
    ): Promise<bigint | typeof UPGRADE_MAXED | null>
    getAdGemButtonRegion(screenshot: Sharp): Promise<ApplicationRegion | null>
    getCash(screenshot: Sharp): Promise<bigint | null>
    getCoins(screenshot: Sharp): Promise<bigint | null>
    getBuyMultiplier(screenshot: Sharp): Promise<BuyMultiplier | null>
    isNewPerkAvailable(screenshot: Sharp): Promise<boolean>
    isTabsOpen(screenshot: Sharp): Promise<boolean>
    getOpenTab(screenshot: Sharp): Promise<Tab | null>
    getGemCount(screenshot: Sharp): Promise<number | null>
}
