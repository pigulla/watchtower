import { type ConsolaInstance } from 'consola'
import { type Sharp } from 'sharp'
import { createWorker, OEM, type Worker } from 'tesseract.js'

import {
    type CharacterSet,
    DIGITS,
    type IOCR,
    LETTERS,
    OCRMode,
    UPPERCASE_LETTERS,
} from './ocr.interface'
import { type Region } from './util/region'

const characterSetMap = {
    [DIGITS]: '1234567890',
    [LETTERS]: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    [UPPERCASE_LETTERS]: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
}

export class OCR implements IOCR {
    private readonly logger: ConsolaInstance
    private workerInstance: Worker | null

    public constructor({ logger }: { logger: ConsolaInstance }) {
        this.logger = logger.withTag(OCR.name)
        this.workerInstance = null
    }

    private get worker(): Worker {
        if (this.workerInstance === null) {
            throw new Error('Not initialized')
        }

        return this.workerInstance
    }

    public async start(): Promise<this> {
        if (this.workerInstance !== null) {
            throw new Error('Already initialized')
        }

        this.workerInstance = await createWorker('eng', OEM.TESSERACT_ONLY)

        // See https://github.com/naptha/tesseract.js/issues/347
        await this.workerInstance.setParameters({ debug_file: '/dev/null' })

        return this
    }

    public async stop(): Promise<void> {
        await this.workerInstance?.terminate()
        this.workerInstance = null
    }

    public async getText(
        image: Sharp,
        region: Region,
        options?: {
            mode?: OCRMode
            characters?: CharacterSet | string
        },
    ): Promise<string> {
        const mode = options?.mode ?? OCRMode.DEFAULT
        const characters =
            typeof options?.characters === 'string'
                ? options.characters
                : options?.characters === undefined
                  ? undefined
                  : characterSetMap[options.characters]

        const result = await this.worker.recognize(await image.toBuffer(), {
            rectangle: region,
            // See https://github.com/naptha/tesseract.js/issues/856
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            tessedit_pageseg_mode: mode,
            tessedit_char_whitelist: characters,
        })
        const text = result.data.text.replaceAll('\n', ' ').trim()

        this.logger.trace(`Recognized text "${text}"`)

        return text
    }
}
