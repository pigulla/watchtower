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
    'sounds',
)

const soundFiles: Readonly<Record<Sound, string>> = {
    [Sound.AD_GEM_DETECTED]: 'ad-gem-detected.mp3',
    [Sound.ERROR]: 'error.mp3',
    [Sound.GAME_OVER]: 'game-over.mp3',
    [Sound.GEM_COLLECTED]: 'gem-collected.wav',
    [Sound.PERK_AVAILABLE]: 'perk-available.mp3',
    [Sound.START]: 'start.mp3',
}

export type PlaySound = (sound: Sound) => Promise<void>

export function playSoundFactory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): PlaySound {
    const log = logger.withTag('playSound')
    const { volume } = config

    if (volume === null) {
        return async (_sound: Sound) => {}
    }

    return async function playSound(sound: Sound): Promise<void> {
        const file = join(SOUND_DIR, soundFiles[sound])
        const params = [file, '--volume', volume.toString()]
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
