import { createConsola } from 'consola'
import { Command } from '@commander-js/extra-typings'

import { GlobalOptions } from '../global-options'
import { externalsFactory } from '../../external/factory'
import { factory as operationsFactory } from '../../operations/factory'
import { getConfig } from '../../config'
import { interval } from '../option/interval.option'
import { mailOnGameOver } from '../option/mail-on-game-over.option'
import { notifyOn } from '../option/notifiy-on.option'
import { watch } from '../../watch'
import { Strategy } from '../../operations/command/purchase-upgrades'

export const watchCommand = new Command<[], {}, GlobalOptions>('watch')
    .addOption(notifyOn)
    .addOption(interval)
    .addOption(mailOnGameOver)
    .option('-r, --repeat', 'Repeat alerts each iteration.')
    .description('Watch the game and notify on important events.')
    .action(async function (): Promise<void> {
        const options = this.optsWithGlobals()
        const config = getConfig({
            logLevel: options.verbose,
            volume: options.silent ? null : options.volume,
            interval: options.interval,
            mailOnGameOver: options.mailOnGameOver,
        })
        const logger = createConsola({
            level: config.logLevel,
        })

        if (options.notifyOn.size === 0) {
            logger.warn(`No notifications are enabled`)
        }

        const externals = externalsFactory({ config, logger })
        const { queries, commands } = operationsFactory(
            {
                logger,
                ...externals,
            },
            {
                // TODO: Refactor that this isn't required in watch mode
                purchase: { strategy: Strategy.RANDOM, upgrades: [] },
            },
        )

        await watch({
            externals,
            queries,
            commands,
            config,
            options: {
                repeatAlerts: Boolean(options.repeat),
                notifyOn: options.notifyOn,
            },
            logger,
        })
    })
