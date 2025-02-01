import type { Sharp } from 'sharp'

import { uiConfig } from '../../ui-config'
import { Injections } from '../injections'
import { OCRMode } from '../../ocr.interface'

import { Query } from './query'

export type IsGameOver = Query<boolean>

export function isGameOverFactory({ getText }: Injections): IsGameOver {
    return async function isGameOver(screenshot: Sharp): Promise<boolean> {
        const text = await getText(screenshot, uiConfig.killedByText, {
            mode: OCRMode.SINGLE_LINE,
        })

        return text.startsWith('Killed By')
    }
}
