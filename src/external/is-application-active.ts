import { ConsolaInstance } from 'consola'
import { execa } from 'execa'

import { Config } from '../config'

export type IsApplicationActive = () => Promise<boolean>

export function isApplicationActiveFactory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): IsApplicationActive {
    const log = logger.withTag('isApplicationActive')

    return async function isApplicationActive(): Promise<boolean> {
        const params = [
            '-e',
            'tell application "System Events" to tell (first process whose frontmost is true) to return name',
        ]

        log.trace(
            `Executing command '${config.binary.osascript} ${params.join(' ')}'`,
        )
        const { stdout } = await execa(config.binary.osascript, params)

        return stdout === config.application.name
    }
}
