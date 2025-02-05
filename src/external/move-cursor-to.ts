import { ConsolaInstance } from 'consola'
import { execa } from 'execa'

import { Position } from '../util/position'

import { Config } from './config'
import { GetWindowPosition } from './get-window-position'

// TODO: Move to config
const RETINA_SCALE = 2

export type MoveCursorTo = (position: Position) => Promise<void>

export function moveCursorToFactory({
    config,
    getWindowPosition,
    logger,
}: {
    config: Config
    getWindowPosition: GetWindowPosition
    logger: ConsolaInstance
}): MoveCursorTo {
    const log = logger.withTag('moveCursorTo')

    return async function moveCursorTo({ x, y }: Position): Promise<void> {
        const offset = await getWindowPosition()
        const target = {
            x: Math.floor(x / RETINA_SCALE + offset.x),
            y: Math.floor(y / RETINA_SCALE + offset.y),
        }

        const params = [`m:${target.x},${target.y}`]
        log.trace(
            `Executing command '${config.binary.cliclick} ${params.join(' ')}'`,
        )
        await execa(config.binary.cliclick, params)
    }
}
