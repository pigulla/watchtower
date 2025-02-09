import { createConsola } from 'consola'
import { Command } from '@commander-js/extra-typings'

import { notifyOn } from '../option/notifiy-on.option'
import { interval } from '../option/interval.option'
import { strategy } from '../option/purchase-strategy.option'
import { factory as operationsFactory } from '../../operations/factory'
import { purchase } from '../option/purchase.option'
import { GlobalOptions } from '../global-options'
import { getConfig } from '../../config'
import { auto } from '../../auto'
import { externalsFactory } from '../../external/factory'

export const autoCommand = new Command<[], {}, GlobalOptions>('auto')
    .addOption(notifyOn)
    .addOption(interval)
    .addOption(purchase)
    .addOption(strategy)
    .description('Automate gem collecting and upgrade purchases.')
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

        const externals = externalsFactory({ config, logger })
        const { queries, commands } = operationsFactory({
            logger,
            ...externals,
        })

        await auto({
            externals,
            queries,
            commands,
            config,
            options: {
                upgrades: options.purchase,
                strategy: options.strategy,
            },
            logger,
        })
    })
