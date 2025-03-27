import dayjs from 'dayjs'
import { createConsola } from 'consola'
import { Command } from '@commander-js/extra-typings'

import { GlobalOptions } from '../global-options'
import { externalsFactory } from '../../external/factory'
import { getConfig } from '../../config'
import { imageFormat } from '../option/image-format.option'

export const screenshotCommand = new Command<[], {}, GlobalOptions>(
    'screenshot',
)
    .requiredOption('-o, --out <name>', 'File to write the screenshot to.')
    .addOption(imageFormat)
    .description('Take a screenshot of the game.')
    .action(async function (): Promise<void> {
        const options = this.optsWithGlobals()
        const config = getConfig({
            logLevel: options.verbose,
            volume: options.silent ? null : options.volume,
            interval: dayjs.duration(0, 'seconds'),
            mailOnGameOver: false,
        })
        const logger = createConsola({
            level: config.logLevel,
        })

        const externals = externalsFactory({ config, logger })

        const image = await externals.takeScreenshot()
        await image.toFormat(options.format).toFile(options.out)

        await externals.stop()
    })
