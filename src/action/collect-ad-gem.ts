import type { Action, Injections } from './action'
import type { Sharp } from 'sharp'

import { uiConfig } from '../ui-config'
import type { Region } from '../util/region'
import { OCRMode, UPPERCASE_LETTERS } from '../ocr.interface'
import { Sound } from '../types'
import { centerOf } from '../util/center-of'

export interface CollectAdGem extends Action {}

export function collectAdGemFactory({
    clickAt,
    getText,
    playSound,
    takeScreenshot,
    logger,
}: Injections): CollectAdGem {
    async function getAdGemButtonRegion(
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

    return async function collectAdGem(screenshot: Sharp): Promise<Sharp> {
        const region = await getAdGemButtonRegion(screenshot)

        if (!region) {
            return screenshot
        }

        logger.success('Ad gem detected')
        await playSound(Sound.GEM_COLLECTED)
        const position = centerOf(region)
        await clickAt(position)

        return takeScreenshot()
    }
}
