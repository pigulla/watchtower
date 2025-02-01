import type { ConsolaInstance } from 'consola'
import type { Sharp } from 'sharp'

import type { Sound } from '../types'
import type { Region } from '../util/region'
import type { Position } from '../util/position'
import type { CharacterSet, OCRMode } from '../ocr.interface'

export type TakeScreenshot = () => Promise<Sharp>
export type PlaySound = (sound: Sound) => Promise<void>
export type ClickAt = (position: Position) => Promise<void>
export type MoveCursorTo = (position: Position) => Promise<void>
export type GetText = (
    screenshot: Sharp,
    region: Region,
    options?: { mode?: OCRMode; characters?: CharacterSet | string },
) => Promise<string>
export type GetNumber = (
    screenshot: Sharp,
    region: Region,
) => Promise<bigint | null>

export type Injections = {
    clickAt: ClickAt
    getNumber: GetNumber
    getText: GetText
    logger: ConsolaInstance
    moveCursorTo: MoveCursorTo
    playSound: PlaySound
    takeScreenshot: TakeScreenshot
}
