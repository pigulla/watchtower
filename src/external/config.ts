import { ConsolaInstance } from 'consola'

export type Config = {
    readonly application: {
        readonly title: string
        readonly name: string
        readonly size: {
            readonly width: number
            readonly height: number
        }
    }
    readonly logger: ConsolaInstance
    readonly sound: {
        readonly directory: string
        readonly volume: number
    }
    readonly binary: {
        readonly afplay: string
        readonly cliclick: string
        readonly osascript: string
        readonly pngpaste: string
        readonly screencapture: string
    }
}
