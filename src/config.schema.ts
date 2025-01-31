import { sep as SEPARATOR } from 'node:path'

import { z } from 'zod'

const pathSchema = z.string().startsWith(SEPARATOR)

export const configSchema = z
    .object({
        logLevel: z.union([
            z.literal('silent'),
            z.literal('fatal'),
            z.literal('error'),
            z.literal('warn'),
            z.literal('log'),
            z.literal('info'),
            z.literal('success'),
            z.literal('fail'),
            z.literal('ready'),
            z.literal('start'),
            z.literal('box'),
            z.literal('debug'),
            z.literal('trace'),
            z.literal('verbose'),
        ]),
        delayInSeconds: z.number().int().positive(),
        theTowerApplication: z
            .object({
                titleBarHeight: z.number().int().min(1),
                name: z.string().min(1),
                title: z.string().min(1),
            })
            .strict(),
        binaries: z
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

export type Config = z.infer<typeof configSchema>
