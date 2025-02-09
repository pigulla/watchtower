import { createConsola } from 'consola'
import { Command } from '@commander-js/extra-typings'

import { notifyOn } from '../option/notifiy-on.option'
import { interval } from '../option/interval.option'
import { GlobalOptions } from '../global-options'
import { getConfig } from '../../config'
import { watch } from '../../watch'
import { externalsFactory } from '../../external/factory'
import { factory as operationsFactory } from '../../operations/factory'

export const watchCommand = new Command<[], {}, GlobalOptions>('watch')
    .addOption(notifyOn)
    .addOption(interval)
    .option('-r, --repeat', 'Repeat alerts each iteration.')
    .description('Watch the game and notify on important events.')
    .action(async function (): Promise<void> {
        const options = this.optsWithGlobals()
        const config = getConfig({
            logLevel: options.verbose,
            volume: options.silent ? null : options.volume,
            interval: options.interval,
        })
        const logger = createConsola({
            level: config.logLevel,
        })

        if (options.notifyOn.size === 0) {
            logger.warn(`No notifications are enabled`)
        }

        const externals = externalsFactory({ config, logger })
        const { queries, commands } = operationsFactory({
            logger,
            ...externals,
        })

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
