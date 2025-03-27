import { Option } from '@commander-js/extra-typings'
import { type LogLevel, LogLevels } from 'consola'

const supportedLogLevels = [
    LogLevels.log,
    LogLevels.info,
    LogLevels.debug,
    LogLevels.trace,
] as const

export const verbose = new Option('-v, --verbose', 'increase logging verbosity')
    .default<LogLevel>(supportedLogLevels[0])
    .argParser<LogLevel>(
        (_, previous) =>
            supportedLogLevels[
                Math.min(
                    supportedLogLevels.length - 1,
                    supportedLogLevels.indexOf(previous) + 1,
                )
            ] as LogLevel,
    )
