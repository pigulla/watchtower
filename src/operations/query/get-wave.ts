import type { Injections } from '../injections'
import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import { Query } from './query'
import { OCRMode } from '../../ocr.interface'

export type GetWave = Query<number | null>

export function getWaveFactory({ getText }: Injections): GetWave {
    return async function getWave(screenshot: Sharp): Promise<number | null> {
        for (const region of uiConfig.stats.wave.regions) {
            const text = await getText(screenshot, region, {
                mode: OCRMode.SINGLE_LINE,
                threshold: 192,
            })

            if (/^Wave \d+$/.test(text)) {
                return Number.parseInt(text.substring('Wave '.length))
            }
        }

        return null
    }
}
