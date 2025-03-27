import type { ConsolaInstance } from 'consola'

import type { Click } from '../external/click'
import type { GetNumber } from '../external/get-number'
import type { GetText } from '../external/get-text'
import type { MoveCursorTo } from '../external/move-cursor-to'
import type { PlaySound } from '../external/play-sound'
import type { TakeScreenshot } from '../external/take-screenshot'

export type Injections = {
    click: Click
    getNumber: GetNumber
    getText: GetText
    logger: ConsolaInstance
    moveCursorTo: MoveCursorTo
    playSound: PlaySound
    takeScreenshot: TakeScreenshot
}
