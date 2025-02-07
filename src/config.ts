import { sep as SEPARATOR } from 'node:path'

import { z } from 'zod'
import nodeConfig from 'config'
import { LogLevel } from 'consola'
import dayjs from 'dayjs'
import { Duration } from 'dayjs/plugin/duration'

const pathSchema = z.string().startsWith(SEPARATOR)

const jsonConfigSchema = z
    .object({
        application: z
            .object({
                title: z.string().min(1),
                name: z.string().min(1),
                isRetina: z.boolean(),
                size: z
                    .object({
                        width: z.number().int().min(1),
                        height: z.number().int().min(1),
                    })
                    .strict(),
            })
            .strict(),
        binary: z
            .object({
                afplay: pathSchema,
                cliclick: pathSchema,
                osascript: pathSchema,
                pngpaste: pathSchema,
                screencapture: pathSchema,
            })
            .strict(),
    })
    .strict()

const configSchema = jsonConfigSchema.extend({
    logLevel: z.number().int().min(0).max(5),
    volume: z.number().min(0).max(1).nullable(),
    interval: z.custom<Duration>(
        value =>
            dayjs.isDuration(value) && !Number.isNaN(value.asMilliseconds()),
    ),
})

export type Config = z.infer<typeof configSchema>

export function getConfig({
    logLevel,
    volume,
    interval,
}: {
    logLevel: LogLevel
    volume: number | null
    interval: Duration
}): Config {
    return configSchema.parse({
        ...nodeConfig.util.toObject(),
        logLevel,
        volume,
        interval,
    })
}
