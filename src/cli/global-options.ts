import { type OptionValues } from '@commander-js/extra-typings'
import { type LogLevel } from 'consola'

export interface GlobalOptions extends OptionValues {
    verbose: LogLevel
    silent: boolean
    volume: number
}
