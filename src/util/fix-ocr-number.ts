// Special handling for common OCR mistakes, such as recognizing a "B" as an "8".

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
