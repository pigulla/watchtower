import { ConsolaInstance } from 'consola'
import { Sharp } from 'sharp'

import { Externals } from './external/factory'
import type { Commands } from './operations/command/commands'
import type { Queries } from './operations/query/queries'
import { sleep } from './util/sleep'
import { Event, Sound } from './types'
import { Config } from './config'

type State = {
    adGemAvailable: boolean
    newPerkAvailable: boolean
    gems: number | null
}

export async function watch({
    externals: { takeScreenshot, stop, playSound },
    queries: { isNewPerkAvailable, getAdGemPosition, getGems, isGameOver },
    config: { interval },
    options: { repeatAlerts, notifyOn },
    logger,
}: {
    externals: Externals
    commands: Commands
    queries: Queries
    config: Config
    options: { repeatAlerts: boolean; notifyOn: ReadonlySet<Event> }
    logger: ConsolaInstance
}): Promise<void> {
    const state: State = {
        adGemAvailable: false,
        newPerkAvailable: false,
        gems: null,
    }

    try {
        let screenshot: Sharp

        do {
            logger.debug('Running in watch mode')
            screenshot = await takeScreenshot()

            const [adGemPosition, newPerkAvailable, gems] = await Promise.all([
                getAdGemPosition(screenshot),
                isNewPerkAvailable(screenshot),
                getGems(screenshot),
            ])

            if (
                notifyOn.has(Event.AD_GEM_AVAILABLE) &&
                !state.adGemAvailable &&
                adGemPosition !== null
            ) {
                logger.info(`New ad gem available`)
                void playSound(Sound.AD_GEM_DETECTED)
            }
            if (
                notifyOn.has(Event.NEW_PERK_AVAILABLE) &&
                !state.newPerkAvailable &&
                newPerkAvailable
            ) {
                logger.info(`New perk available`)
                void playSound(Sound.PERK_AVAILABLE)
            }
            if (gems !== null && state.gems !== gems) {
                logger.info(`Gem count is ${gems}`)
                state.gems = gems
            }

            state.adGemAvailable = repeatAlerts ? false : adGemPosition !== null
            state.newPerkAvailable = repeatAlerts ? false : newPerkAvailable

            logger.trace(`Waiting for ${interval.asSeconds()} second(s)`)
            await sleep(interval.asMilliseconds())
        } while (!(await isGameOver(screenshot)))
    } catch (error) {
        logger.fatal((error as Error).message)
        console.error(error)
        await playSound(Sound.ERROR)
        process.exitCode = 1
    }

    await stop()
}
