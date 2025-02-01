import { ConsolaInstance } from 'consola'
import { execa } from 'execa'

import { Config } from './config'

export type IsApplicationActive = () => Promise<void>

export function activateApplicationFactory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): IsApplicationActive {
    const log = logger.withTag('activateApplication')

    return async function activateApplication(): Promise<void> {
        const params = [
            '-e',
            `tell application "${config.application.name}" to activate`,
        ]

        log.trace(
            `Executing command '${config.binary.osascript} ${params.join(' ')}'`,
        )
        await execa(config.binary.osascript, params)
    }
}
