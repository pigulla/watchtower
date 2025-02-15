import { createConsola } from 'consola'
import { Command } from '@commander-js/extra-typings'

import { GlobalOptions } from '../global-options'
import { auto } from '../../auto'
import { externalsFactory } from '../../external/factory'
import { factory as operationsFactory } from '../../operations/factory'
import { getConfig } from '../../config'
import { interval } from '../option/interval.option'
import { notifyOn } from '../option/notifiy-on.option'
import { purchase } from '../option/purchase.option'
import { strategy } from '../option/purchase-strategy.option'
import { mailOnGameOver } from '../option/mail-on-game-over.option'

export const autoCommand = new Command<[], {}, GlobalOptions>('auto')
    .addOption(notifyOn)
    .addOption(interval)
    .addOption(purchase)
    .addOption(strategy)
    .addOption(mailOnGameOver)
    .description('Automate gem collecting and upgrade purchases.')
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

        const externals = externalsFactory({ config, logger })
        const { queries, commands } = operationsFactory(
            {
                logger,
                ...externals,
            },
            {
                purchase: {
                    strategy: options.strategy,
                    upgrades: options.purchase,
                },
            },
        )

        await auto({
            externals,
            queries,
            commands,
            config,
            logger,
        })
    })
