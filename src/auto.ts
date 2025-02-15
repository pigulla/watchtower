import { ConsolaInstance } from 'consola'
import { Sharp } from 'sharp'

import { Externals } from './external/factory'
import type { Commands } from './operations/command/commands'
import type { Queries } from './operations/query/queries'
import { sleep } from './util/sleep'
import { Config } from './config'
import { Sound } from './types'

type State = {
    gems: number | null
}

export async function auto({
    externals: { activateApplication, takeScreenshot, stop, playSound },
    queries: { getGems, isGameOver },
    commands: {
        collectAdGem,
        collectFloatingGem,
        purchaseUpgrades,
        moveToIdlePosition,
    },
    config: { interval },
    logger,
}: {
    externals: Externals
    commands: Commands
    queries: Queries
    config: Config
    logger: ConsolaInstance
}): Promise<void> {
    const state: State = {
        gems: null,
    }

    try {
        let screenshot: Sharp

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            logger.debug('Running in auto mode')
            screenshot = await takeScreenshot()

            if (await isGameOver(screenshot)) {
                logger.success('Game is over')
                await playSound(Sound.GAME_OVER)
                break
            }

            screenshot = await activateApplication()
                .then(takeScreenshot)
                .then(collectAdGem)
                .then(collectFloatingGem)
                .then(purchaseUpgrades)
                .then(moveToIdlePosition)

            const gems = await getGems(screenshot)

            if (gems !== null && state.gems !== gems) {
                logger.info(`Gem count is ${gems}`)
                state.gems = gems
            }

            logger.trace(`Waiting for ${interval.asSeconds()} second(s)`)
            await sleep(interval.asMilliseconds())
        }
    } catch (error) {
        logger.fatal((error as Error).message)
        console.error(error)
        await playSound(Sound.ERROR)
        process.exitCode = 1
    }

    await stop()
}
