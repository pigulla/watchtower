import type { Injections } from '../injections'
import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import { Query } from './query'
import { DIGITS, OCRMode } from '../../ocr.interface'

export type GetGems = Query<number | null>

export function getGemsFactory({ getText }: Injections): GetGems {
    return async function getGems(screenshot: Sharp): Promise<number | null> {
        const text = await getText(screenshot, uiConfig.stats.gemCounter, {
            mode: OCRMode.SINGLE_WORD,
            characters: DIGITS,
            threshold: 192,
        })

        if (/^\d+$/.test(text)) {
            return Number.parseInt(text)
        }

        return null
    }
}
