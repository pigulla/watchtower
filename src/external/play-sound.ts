import { dirname, join } from 'node:path'

import { ConsolaInstance } from 'consola'
import { execa } from 'execa'

import { Sound } from '../types'

import { Config } from '../config'
import { fileURLToPath } from 'node:url'

const SOUND_DIR = join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
    '..',
    'sounds',
)

export type PlaySound = (sound: Sound) => Promise<void>

export function playSoundFactory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): PlaySound {
    const log = logger.withTag('playSound')

    return async function playSound(sound: Sound): Promise<void> {
        const file = join(SOUND_DIR, sound)
        const params = [file, '--volume', config.volume.toString()]
        log.trace(
            `Executing command '${config.binary.afplay} ${params.join(' ')}'`,
        )

        try {
            await execa(config.binary.afplay, params)
        } catch (error) {
            logger.error(`Failed to play sound: ${(error as Error).message}`)
        }
    }
}
