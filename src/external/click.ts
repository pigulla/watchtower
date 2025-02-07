import { ConsolaInstance } from 'consola'
import { execa } from 'execa'

import { Position } from '../util/position'

import { Config } from '../config'
import { GetWindowPosition } from './get-window-position'

export type Click = (position?: Position) => Promise<void>

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
    const scale = config.application.isRetina ? 2 : 1

    return async function clickAt(position?: Position): Promise<void> {
        let params = [`c:.`]

        if (position) {
            const offset = await getWindowPosition()
            const target = {
                x: Math.floor(position.x / scale + offset.x),
                y: Math.floor(position.y / scale + offset.y),
            }

            params = [`c:${target.x},${target.y}`]
        }

        log.trace(
            `Executing command '${config.binary.cliclick} ${params.join(' ')}'`,
        )
        await execa(config.binary.cliclick, params)
    }
}
