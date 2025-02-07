import { ConsolaInstance } from 'consola'
import { Sharp } from 'sharp'

import { Externals } from './external/factory'
import type { Commands } from './operations/command/commands'
import type { Queries } from './operations/query/queries'
import { sleep } from './util/sleep'
import { Sound } from './types'
import { Config } from './config'

export async function watch({
    externals: { takeScreenshot, stop, playSound },
    queries: { isNewPerkAvailable, getAdGemPosition, isGameOver },
    config: { interval },
    logger,
}: {
    externals: Externals
    commands: Commands
    queries: Queries
    config: Config
    logger: ConsolaInstance
}): Promise<void> {
    let screenshot: Sharp
    const state = {
        adGemAvailable: false,
        perkAvailable: false,
    }

    try {
        do {
            logger.debug('Running in watch mode')
            screenshot = await takeScreenshot()

            const [adGemPosition, newPerkAvailable] = await Promise.all([
                getAdGemPosition(screenshot),
                isNewPerkAvailable(screenshot),
            ])

            if (!state.adGemAvailable && adGemPosition !== null) {
                logger.info(`New ad gem available`)
                void playSound(Sound.AD_GEM_AVAILABLE)
            }
            if (!state.perkAvailable && newPerkAvailable) {
                logger.info(`New perk available`)
                void playSound(Sound.PERK_AVAILABLE)
            }

            state.adGemAvailable = adGemPosition !== null
            state.perkAvailable = newPerkAvailable

            logger.debug(`Waiting for ${interval.asSeconds()} second(s)`)
            await sleep(interval.asMilliseconds())
        } while (!(await isGameOver(screenshot)))
    } catch (error) {
        logger.fatal((error as Error).message)
        console.error(error)
        process.exitCode = 1
    }

    await stop()
}
