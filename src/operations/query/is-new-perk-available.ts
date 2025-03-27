import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import { LETTERS, OCRMode } from '../../ocr.interface'
import { Injections } from '../injections'

import { Query } from './query'

export type IsNewPerkAvailable = Query<boolean>

export function isNewPertAvailableFactory({
    getText,
}: Injections): IsNewPerkAvailable {
    return async function isNewPerkAvailable(
        screenshot: Sharp,
    ): Promise<boolean> {
        const text = await getText(
            screenshot.clone().grayscale(),
            uiConfig.stats.perkProgress,
            { mode: OCRMode.SINGLE_LINE, characters: LETTERS },
        )

        return text === 'New Perk'
    }
}
