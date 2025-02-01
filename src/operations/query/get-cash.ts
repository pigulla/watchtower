import type { Injections } from '../injections'
import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import { Query } from './query'

export type GetCash = Query<bigint | null>

export function getCashFactory({ getNumber }: Injections): GetCash {
    return async function getCash(screenshot: Sharp): Promise<bigint | null> {
        return getNumber(screenshot, uiConfig.stats.cash)
    }
}
