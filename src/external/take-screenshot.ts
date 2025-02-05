import { ConsolaInstance } from 'consola'
import { execa } from 'execa'
import sharp, { Sharp } from 'sharp'

import { Position } from '../util/position'

import { GetWindowPosition } from './get-window-position'
import { Config } from './config'
import { GetText } from './get-text'
import { LETTERS, OCRMode } from '../ocr.interface'

export type TakeScreenshot = () => Promise<Sharp>

export function takeScreenshotFactory({
    config: { binary, application },
    getWindowPosition,
    getText,
    logger,
}: {
    config: Config
    getWindowPosition: GetWindowPosition
    getText: GetText
    logger: ConsolaInstance
}): TakeScreenshot {
    const log = logger.withTag('takeScreenshot')
    const { width, height } = application.size

    async function captureApplicationWindowToClipboard({
        x,
        y,
    }: Position): Promise<void> {
        const params = [`-R${x},${y},${width},${height}`, '-tpng', '-c']
        log.trace(
            `Executing command '${binary.screencapture} ${params.join(' ')}'`,
        )
        await execa(binary.screencapture, params)
    }

    async function loadScreenshotFromClipboard(): Promise<Uint8Array> {
        const params = ['-']
        log.trace(`Executing command '${binary.pngpaste} ${params.join(' ')}'`)

        const { stdout } = await execa(binary.pngpaste, params, {
            encoding: 'buffer',
        })

        return stdout
    }

    return async function takeScreenshot(): Promise<Sharp> {
        const { x, y } = await getWindowPosition()

        if (x < 0 || y < 0) {
            throw new Error(`Window position is outside the desktop area`)
        }

        await captureApplicationWindowToClipboard({ x, y })
        const buffer = await loadScreenshotFromClipboard()
        const screenshot = sharp(buffer)

        const title = await getText(
            screenshot,
            { left: 500, top: 5, width: width * 2 - 2 * 500, height: 50 },
            { mode: OCRMode.SINGLE_LINE, characters: LETTERS },
        )

        if (title !== application.title) {
            throw new Error(
                `Expected to find application title '${application.title}' in screenshot`,
            )
        }

        return screenshot
    }
}
