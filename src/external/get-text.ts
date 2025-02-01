import { ConsolaInstance } from 'consola'
import type { Sharp } from 'sharp'
import { createWorker, OEM } from 'tesseract.js'

import type { Region } from '../util/region'
import {
    CharacterSet,
    DIGITS,
    LETTERS,
    OCRMode,
    UPPERCASE_LETTERS,
} from '../ocr.interface'

export type GetText = (
    image: Sharp,
    region: Region,
    options?: { mode?: OCRMode; characters?: CharacterSet | string },
) => Promise<string>

const characterSetMap = {
    [DIGITS]: '1234567890',
    [LETTERS]: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    [UPPERCASE_LETTERS]: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
}

export function getTextFactory({ logger }: { logger: ConsolaInstance }): {
    getText: GetText
    stop: () => Promise<void>
} {
    const log = logger.withTag('getText')
    const workerPromise = createWorker('eng', OEM.TESSERACT_ONLY).then(
        async worker => {
            await worker.setParameters({ debug_file: '/dev/null' })
            return worker
        },
    )

    async function stop(): Promise<void> {
        const worker = await workerPromise
        await worker.terminate()
    }

    async function getText(
        image: Sharp,
        region: Region,
        options?: {
            mode?: OCRMode
            characters?: CharacterSet | string
        },
    ): Promise<string> {
        const worker = await workerPromise

        const mode = options?.mode ?? OCRMode.DEFAULT
        const characters =
            typeof options?.characters === 'string'
                ? options.characters
                : options?.characters === undefined
                  ? undefined
                  : characterSetMap[options.characters]

        const result = await worker.recognize(await image.toBuffer(), {
            rectangle: region,
            // See https://github.com/naptha/tesseract.js/issues/856
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            tessedit_pageseg_mode: mode,
            tessedit_char_whitelist: characters,
        })
        const text = result.data.text.replaceAll('\n', ' ').trim()

        log.trace(`Recognized text "${text}"`)

        return text
    }

    return { getText, stop }
}
