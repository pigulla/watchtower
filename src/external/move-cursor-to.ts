import { ClickAt } from '../operations/injections'
import { Position } from '../util/position'
import { GetWindowPosition } from './get-window-position'
import { ConsolaInstance } from 'consola'
import { Config } from './config'
import { execa } from 'execa'

// TODO: Move to config
const RETINA_SCALE = 2

export function moveCursorToFactory({
    config,
    getWindowPosition,
    logger,
}: {
    config: Config
    getWindowPosition: GetWindowPosition
    logger: ConsolaInstance
}): ClickAt {
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
