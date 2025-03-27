import type { Injections } from '../injections'
import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import { OCRMode, UPPERCASE_LETTERS } from '../../ocr.interface'
import { Region } from '../../util/region'

import { Query } from './query'

export type GetAdGemPosition = Query<Region | null>

export function getAdGemPositionFactory({
    getText,
}: Injections): GetAdGemPosition {
    return async function getAdGemPosition(
        screenshot: Sharp,
    ): Promise<Region | null> {
        const offset = uiConfig.adGem.claimTextOffset

        for (const candidate of uiConfig.adGem.regions) {
            const text = await getText(
                screenshot,
                {
                    left: candidate.left + offset.left,
                    top: candidate.top + offset.top,
                    height: offset.height,
                    width: offset.width,
                },
                {
                    mode: OCRMode.SINGLE_WORD,
                    characters: UPPERCASE_LETTERS,
                },
            )

            if (text === 'CLAIM') {
                return candidate
            }
        }

        return null
    }
}
