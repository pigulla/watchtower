import type { Injections } from '../injections'
import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import { Query } from './query'

export type GetCoins = Query<bigint | null>

export function getCoinsFactory({ getNumber }: Injections): GetCoins {
    return async function getCoins(screenshot: Sharp): Promise<bigint | null> {
        return getNumber(screenshot, uiConfig.stats.coins, { threshold: 192 })
    }
}
