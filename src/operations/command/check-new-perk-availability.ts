import type { Sharp } from 'sharp'

import { Sound } from '../../types'
import { uiConfig } from '../../ui-config'
import { LETTERS, OCRMode } from '../../ocr.interface'
import { Injections } from '../injections'

import type { Command } from './command'

export type CheckNewPerkAvailability = Command

export function checkNewPerkAvailabilityFactory({
    getText,
    playSound,
    logger,
}: Injections): CheckNewPerkAvailability {
    let wasNewPerkAvailable = false

    async function isNewPerkAvailable(screenshot: Sharp): Promise<boolean> {
        const text = await getText(
            screenshot.clone().grayscale(),
            uiConfig.stats.perkProgress,
            { mode: OCRMode.SINGLE_LINE, characters: LETTERS },
        )

        return text === 'New Perk'
    }

    return async function checkNewPerkAvailability(
        screenshot: Sharp,
    ): Promise<Sharp> {
        const newPerkAvailable = await isNewPerkAvailable(screenshot)

        if (!wasNewPerkAvailable && newPerkAvailable) {
            await playSound(Sound.PERK_AVAILABLE)
        }

        logger.info('New perk available')
        wasNewPerkAvailable = newPerkAvailable

        return screenshot
    }
}
