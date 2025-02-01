import { join } from 'node:path'

import { ConsolaInstance } from 'consola'
import { execa } from 'execa'

import { PlaySound } from '../operations/injections'
import { Sound } from '../types'

import { Config } from './config'

export function playSoundFactory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): PlaySound {
    const log = logger.withTag('playSound')

    return async function playSound(sound: Sound): Promise<void> {
        const file = join(config.sound.directory, sound)
        const params = [file, '--volume', config.sound.volume.toString()]
        log.trace(
            `Executing command '${config.binary.afplay} ${params.join(' ')}'`,
        )
        await execa(config.binary.afplay, params)
    }
}
