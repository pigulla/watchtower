import { type Sharp } from 'sharp'
import { PSM } from 'tesseract.js'

import { type Region } from './util/region.js'

export enum OCRMode {
    /* eslint-disable @typescript-eslint/prefer-literal-enum-member */
    SINGLE_LINE = PSM.SINGLE_LINE,
    DEFAULT = PSM.SINGLE_BLOCK,
    SINGLE_WORD = PSM.SINGLE_WORD,
    /* eslint-enable @typescript-eslint/prefer-literal-enum-member */
}

export const DIGITS = Symbol('digits')
export const LETTERS = Symbol('letters')
export const UPPERCASE_LETTERS = Symbol('uppercase letters')

export type CharacterSet =
    | typeof DIGITS
    | typeof LETTERS
    | typeof UPPERCASE_LETTERS

export interface IOCR {
    getText(
        image: Sharp,
        region: Region,
        options?: { mode?: OCRMode; characters?: CharacterSet | string },
    ): Promise<string>
}
