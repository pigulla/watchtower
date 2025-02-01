import sharp, { Sharp } from 'sharp'

import { TakeScreenshot } from '../operations/injections'
import { Config } from './config'
import { ConsolaInstance } from 'consola'
import { GetWindowPosition } from './get-window-position'
import { execa } from 'execa'
import { Position } from '../util/position'

export function takeScreenshotFactory({
    config,
    getWindowPosition,
    logger,
}: {
    config: Config
    getWindowPosition: GetWindowPosition
    logger: ConsolaInstance
}): TakeScreenshot {
    const log = logger.withTag('takeScreenshot')
    const { width, height } = config.application.size

    async function captureApplicationWindowToClipboard({
        x,
        y,
    }: Position): Promise<void> {
        const params = [`-R${x},${y},${width},${height}`, '-tpng', '-c']
        log.trace(
            `Executing command '${config.binary.screencapture} ${params.join(' ')}'`,
        )
        await execa(config.binary.screencapture, params)
    }

    async function loadScreenshotFromClipboard(): Promise<Uint8Array> {
        const params = ['-']
        log.trace(
            `Executing command '${config.binary.pngpaste} ${params.join(' ')}'`,
        )

        const { stdout } = await execa(config.binary.pngpaste, params, {
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

        return sharp(buffer)
    }
}
