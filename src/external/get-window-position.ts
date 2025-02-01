import { execa } from 'execa'

import { Position } from '../util/position'

import { Config } from './config'
import { ConsolaInstance } from 'consola'

export type GetWindowPosition = () => Promise<Position>

export function getWindowPositionFactory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): GetWindowPosition {
    const log = logger.withTag('getWindowPosition')
    const { binary, application } = config

    return async function getWindowPosition(): Promise<Position> {
        const params = [
            '-e',
            `tell application "System Events" to tell process "${application.title}" to tell window 1 to get its { position, size }`,
        ]

        log.trace(`Executing command '${binary.osascript} ${params.join(' ')}'`)
        const { stdout } = await execa(binary.osascript, params)
        const matches = /^(-?\d+), (-?\d+), (\d+), (\d+)$/.exec(stdout)

        if (matches === null) {
            throw new Error(`Failed to parse window position and size`)
        }

        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const left = Number.parseInt(matches[1]!)
        const top = Number.parseInt(matches[2]!)
        const width = Number.parseInt(matches[3]!)
        const height = Number.parseInt(matches[4]!)
        /* eslint-enable @typescript-eslint/no-non-null-assertion */

        if (
            width !== application.size.width ||
            height !== application.size.height
        ) {
            throw new Error(
                `Expected application window of size ${application.size.width}x${application.size.height} but detected ${width},${height}`,
            )
        }

        return {
            x: left,
            y: top,
        }
    }
}
