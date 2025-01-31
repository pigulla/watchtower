import type { Sharp } from 'sharp'

import { type Sound } from './types.js'
import { type ApplicationPosition } from './util/position.js'
import { type ScreenRegion } from './util/region.js'

export interface IApplication {
    activateApplication(): Promise<void>
    clickAt(position: ApplicationPosition): Promise<void>
    getScreenshot(): Promise<Sharp>
    getWindowPosition(): Promise<ScreenRegion>
    isApplicationActive(): Promise<boolean>
    moveCursorTo(position: ApplicationPosition): Promise<void>
    playSound(sound: Sound, volume: number): Promise<void>
}
