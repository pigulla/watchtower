import type { Sharp } from 'sharp'

import type { Sound } from '../types'
import type { Position } from '../util/position'
import type { ConsolaInstance } from 'consola'
import type { Region } from '../util/region'
import type { CharacterSet, OCRMode } from '../ocr.interface'

export type TakeScreenshot = () => Promise<Sharp>
export type PlaySound = (sound: Sound) => Promise<void>
export type ClickAt = (position: Position) => Promise<void>
export type IsTabsOpen = () => Promise<boolean>
export type GetText = (
    screenshot: Sharp,
    region: Region,
    options?: { mode?: OCRMode; characters?: CharacterSet | string },
) => Promise<string>

export type Injections = {
    logger: ConsolaInstance
    takeScreenshot: TakeScreenshot
    playSound: PlaySound
    clickAt: ClickAt
    isTabsOpen: IsTabsOpen
    getText: GetText
}

export type Action<Input extends unknown[] = []> = (
    screenshot: Sharp,
    ...parameters: Input
) => Promise<Sharp>
