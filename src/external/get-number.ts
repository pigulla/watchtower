import { ConsolaInstance } from 'consola'
import type { Sharp } from 'sharp'

import type { Region } from '../util/region'
import { OCRMode } from '../ocr.interface'
import { parseNumber } from '../util/parse-number'

import { GetText } from './get-text'

export type GetNumber = (
    image: Sharp,
    region: Region,
    options?: { threshold?: number },
) => Promise<bigint | null>

export function fixOcrNumber(input: string): string {
    if (input.length === 0) {
        return input
    }

    let output = input.replaceAll(' ', '')

    if (input.includes('.')) {
        // The existence of a dot implies that the number has a symbol suffix
        if (input.endsWith('8')) {
            output = input.slice(0, -1) + 'B'
        }
        if (input.endsWith('0')) {
            output = input.slice(0, -1) + 'O'
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        output = output.slice(0, -1).replaceAll('O', '0') + output.at(-1)!
    } else {
        output = output.replaceAll('O', '0')
    }

    return output
}

export function getNumberFactory({
    getText,
    logger,
}: {
    getText: GetText
    logger: ConsolaInstance
}): GetNumber {
    const log = logger.withTag('getNumber')

    return async function getNumber(
        image: Sharp,
        region: Region,
        options?: { threshold?: number },
    ): Promise<bigint | null> {
        const text = await getText(
            image.clone().threshold(options?.threshold ?? 192),
            region,
            {
                mode: OCRMode.SINGLE_LINE,
                characters: '1234567890.KMBTqQsSOND',
            },
        )

        if (text.length === 0) {
            return null
        }

        const result = fixOcrNumber(text)

        if (result !== text) {
            log.verbose(`Corrected '${text}' to '${result}'`)
        }

        return parseNumber(result)
    }
}
