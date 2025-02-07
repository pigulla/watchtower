import { readPackage } from 'read-pkg'
import { Command } from '@commander-js/extra-typings'

import './setup.js'

import { verbose } from './cli/option/verbose.option'
import { volume } from './cli/option/volume.option'
import { watchCommand } from './cli/command/watch.command'

const { name, version, description } = await readPackage()

const program = new Command()
    .name(name)
    .version(version)
    .description(description ?? name)
    .addOption(verbose)
    .addOption(volume)
    .option('-s, --silent', 'Disable sounds')
    .configureHelp({ showGlobalOptions: true })

program.addCommand(watchCommand)

program.parse(process.argv)
