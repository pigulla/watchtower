import type { ConsolaInstance } from 'consola'

import type { ClickAt } from '../external/click-at'
import type { GetText } from '../external/get-text'
import type { MoveCursorTo } from '../external/move-cursor-to'
import type { PlaySound } from '../external/play-sound'
import type { TakeScreenshot } from '../external/take-screenshot'
import type { GetNumber } from '../external/get-number'

export type Injections = {
    clickAt: ClickAt
    getNumber: GetNumber
    getText: GetText
    logger: ConsolaInstance
    moveCursorTo: MoveCursorTo
    playSound: PlaySound
    takeScreenshot: TakeScreenshot
}
