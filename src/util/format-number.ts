const symbols = ['', 'K', 'M', 'B', 'T', 'q', 'Q', 's', 'S', 'O', 'N', 'D']

function roundTo(number: number, digits: number): number {
    const n = 10 ** digits
    return Math.round(number * n) / n
}

export function formatNumber(value: bigint): string {
    const index = Math.floor((value.toString().length - 1) / 3)
    const divisor = BigInt(10) ** BigInt(3 * index)
    const number = roundTo(Number((BigInt(1000) * value) / divisor) / 1000, 2)

    return `${number}${symbols[index]}`
}
