const powers = [
    'K',
    'M',
    'B',
    'T',
    'q',
    'Q',
    's',
    'S',
    'O',
    'N',
    'D',
    // and then:
    // 'aa',
    // 'ab',
    // 'ac',
    // ...
]

export function parseNumber(value: string): bigint | null {
    if (/^\d+$/.test(value)) {
        return BigInt(value)
    }

    const matches = /^(\d{1,3}\.\d{2})\s*([KMBTqQsSOND])$/.exec(value)

    if (matches === null) {
        return null
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const number = Number.parseFloat(matches[1]!)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const power = BigInt(3 * (powers.indexOf(matches[2]!) + 1))
    const numberInK = BigInt(Math.floor(number * 1000))

    return numberInK * BigInt(10) ** BigInt(power - BigInt(3))
}
