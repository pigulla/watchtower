import { ConsolaInstance } from 'consola'
import { execa } from 'execa'

import { Config } from './config'

export type Click = () => Promise<void>

export function clickFactory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): Click {
    const log = logger.withTag('click')

    return async function clickAt(): Promise<void> {
        const params = [`c:.`]
        log.trace(
            `Executing command '${config.binary.cliclick} ${params.join(' ')}'`,
        )
        await execa(config.binary.cliclick, params)
    }
}
