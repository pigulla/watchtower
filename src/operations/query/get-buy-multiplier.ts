import type { Injections } from '../injections'
import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import { Query } from './query'
import { OCRMode } from '../../ocr.interface'
import { BuyMultiplier } from '../../types'

export type GetBuyMultiplier = Query<BuyMultiplier | null>

export function getBuyMultiplierFactory({
    getText,
}: Injections): GetBuyMultiplier {
    return async function getBuyMultiplier(
        screenshot: Sharp,
    ): Promise<BuyMultiplier | null> {
        const text = await getText(screenshot, uiConfig.tabs.buyMultiplier, {
            mode: OCRMode.SINGLE_WORD,
            threshold: 192,
        })

        if (Object.values<string>(BuyMultiplier).includes(text)) {
            return text as BuyMultiplier
        }

        return null
    }
}
