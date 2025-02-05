import { ConsolaInstance } from 'consola'
import { execa } from 'execa'

import { Position } from '../util/position'

import { Config } from './config'
import { GetWindowPosition } from './get-window-position'

export type Click = (position?: Position) => Promise<void>

// TODO: Move to config
const RETINA_SCALE = 2

export function clickFactory({
    config,
    getWindowPosition,
    logger,
}: {
    config: Config
    getWindowPosition: GetWindowPosition
    logger: ConsolaInstance
}): Click {
    const log = logger.withTag('click')

    return async function clickAt(position?: Position): Promise<void> {
        let params = [`c:.`]

        if (position) {
            const offset = await getWindowPosition()
            const target = {
                x: Math.floor(position.x / RETINA_SCALE + offset.x),
                y: Math.floor(position.y / RETINA_SCALE + offset.y),
            }

            params = [`c:${target.x},${target.y}`]
        }

        log.trace(
            `Executing command '${config.binary.cliclick} ${params.join(' ')}'`,
        )
        await execa(config.binary.cliclick, params)
    }
}
