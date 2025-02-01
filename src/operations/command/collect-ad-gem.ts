import type { Command } from './command'
import type { Injections } from '../injections'
import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import type { Region } from '../../util/region'
import { OCRMode, UPPERCASE_LETTERS } from '../../ocr.interface'
import { Sound } from '../../types'
import { centerOf } from '../../util/center-of'

export type CollectAdGem = Command

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
            logger.verbose(`No ad gem detected`)
            return screenshot
        }

        logger.success('Ad gem detected')
        const position = centerOf(region)
        await clickAt(position)
        await playSound(Sound.GEM_COLLECTED)

        return takeScreenshot()
    }
}
