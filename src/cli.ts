import { readPackage } from 'read-pkg'
import { Command } from '@commander-js/extra-typings'
import { createConsola, type LogLevel } from 'consola'

import './setup.js'

import { notifyOn } from './cli/option/notifiy-on.option'
import { verbose } from './cli/option/verbose.option'
import { volume } from './cli/option/volume.option'
import { interval } from './cli/option/interval.option'

const { name, version, description } = await readPackage()

const program = new Command()
    .name(name)
    .version(version)
    .description(description ?? name)
    .addOption(verbose)
    .option('-s, --silent', 'Disable sounds')
    .addOption(volume)

program.add
    .command('watch')
    .addOption(notifyOn)
    .addOption(interval)
    .description('Watch the game and notify on important events.')
    .action(function (options, command: Command): void {
        const level = this.optsWithGlobals().verbose as LogLevel
        const logger = createConsola({ level })
        logger.debug(`Log verbosity is set to ${level}`)

        console.dir(this.optsWithGlobals().interval)
    })

program.parse(process.argv)
