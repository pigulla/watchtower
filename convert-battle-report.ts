import { EOL } from 'node:os'

import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import duration from 'dayjs/plugin/duration.js'
import clipboard from 'clipboardy'
import { z } from 'zod'
import dayjs, { UnitTypeShort } from 'dayjs'
import { readFile } from 'node:fs/promises'

dayjs.extend(customParseFormat)
dayjs.extend(duration)

const symbols = [
    '',
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
    'aa',
    'ab',
    'ac',
    // ...
]

function roundTo(number: number, digits: number): number {
    const n = 10 ** digits
    return Math.round(number * n) / n
}

export function formatNumber(value: bigint): string {
    const index = Math.floor((value.toString().length - 1) / 3)
    const divisor = BigInt(10) ** BigInt(3 * index)
    const number = roundTo(
        Number((BigInt(1000) * value) / divisor) / 1000,
        2,
    ).toFixed(2)

    return `${number}${symbols[index]}`
}

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
    'aa',
    'ab',
    'ac',
    // ...
]

const bigNumberRegex = /^(\d{1,3}\.\d{2})\s*(K|M|B|T|q|Q|s|S|O|N|D|aa|ab|ac)$/

export function parseNumber(value: string): bigint {
    const matches = bigNumberRegex.exec(value)

    if (matches === null) {
        throw new Error('Invalid number string')
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const number = Number.parseFloat(matches[1]!)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const power = BigInt(3 * (powers.indexOf(matches[2]!) + 1))
    const numberInK = BigInt(Math.floor(number * 1000))

    return numberInK * BigInt(10) ** BigInt(power - BigInt(3))
}

const smallNumberSchema = z.union([
    z
        .string()
        .regex(/^\d+\.\d+$/)
        .transform(value => Number.parseFloat(value)),
    z
        .string()
        .regex(/^\d+$/)
        .transform(value => BigInt(value)),
])
const bigNumberSchema = z
    .string()
    .regex(bigNumberRegex)
    .transform(value => parseNumber(value))

const numberSchema = z
    .union([smallNumberSchema, bigNumberSchema])
    .refine(value => value >= 0n)

const cashSchema = z.preprocess(
    value =>
        typeof value === 'string' && value.startsWith('$')
            ? value.substring(1)
            : value,
    numberSchema,
)

const dateSchema = z
    .string()
    .transform(value => dayjs(value))
    .refine(value => value.isValid())

const timeSchema = z
    .string()
    .regex(/^(\d{1}d )?\d{1,2}h \d{1,2}m \d{1,2}s$/)
    .transform(value =>
        value
            .split(' ')
            .map(
                value =>
                    [
                        Number.parseInt(value.substring(0, value.length - 1)),
                        value.substring(value.length - 1) as UnitTypeShort,
                    ] as const,
            )
            .reduce(
                (duration, [value, unit]) => duration.add(value, unit),
                dayjs.duration(0),
            ),
    )
    .transform(value => value.asDays().toFixed(4))

const reportSchema = z.object({
    // Battle Report
    // 'Battle Date': dateSchema,
    'Game Time': timeSchema,
    'Real Time': timeSchema,
    Tier: z.coerce.number().int().positive(),
    Wave: z.coerce.number().int().positive(),
    'Killed By': z.string().nullable(),
    'Coins earned': bigNumberSchema,
    'Coins per hour': bigNumberSchema,
    'Cash earned': cashSchema,
    'Interest earned': cashSchema,
    'Gem Blocks Tapped': numberSchema,
    'Cells Earned': numberSchema,
    'Reroll Shards Earned': numberSchema,

    // Combat
    'Damage Dealt': numberSchema,
    'Damage Taken': numberSchema,
    'Damage Taken Wall': numberSchema,
    'Damage Taken While Berserked': numberSchema,
    'Damage Gain From Berserk': z.preprocess(
        value =>
            typeof value === 'string' && value.startsWith('x')
                ? value.substring(1)
                : value,
        z.coerce.number().min(0),
    ),
    'Death Defy': numberSchema,
    Lifesteal: numberSchema,
    'Projectiles Damage': numberSchema,
    'Projectiles Count': numberSchema,
    'Thorn damage': numberSchema,
    'Orb Damage': numberSchema,
    'Enemies Hit by Orbs': numberSchema,
    'Land Mine Damage': numberSchema,
    'Land Mines Spawned': numberSchema,
    'Rend Armor Damage': numberSchema,
    'Death Ray Damage': numberSchema,
    'Smart Missile Damage': numberSchema,
    'Inner Land Mine Damage': numberSchema,
    'Chain Lightning Damage': numberSchema,
    'Death Wave Damage': numberSchema,
    'Tagged by Death Wave': numberSchema,
    'Swamp Damage': numberSchema,
    'Black Hole Damage': numberSchema,

    // Utility
    'Waves Skipped': numberSchema,
    'Recovery Packages': numberSchema,
    'Free Attack Upgrade': numberSchema,
    'Free Defense Upgrade': numberSchema,
    'Free Utility Upgrade': numberSchema,
    'HP From Death Wave': numberSchema,
    'Coins From Death Wave': numberSchema,
    'Cash From Golden Tower': cashSchema,
    'Coins From Golden Tower': numberSchema,
    'Coins From Black Hole': numberSchema,
    'Coins From Spotlight': numberSchema,
    'Coins From Orb': numberSchema,
    'Coins from Coin Upgrade': numberSchema,
    'Coins from Coin Bonuses': numberSchema,

    // Enemies destroyed
    'Total Enemies': numberSchema,
    Basic: numberSchema,
    Fast: numberSchema,
    Tank: numberSchema,
    Ranged: numberSchema,
    Boss: numberSchema,
    Protector: numberSchema,
    'Total Elites': numberSchema,
    Vampires: numberSchema,
    Rays: numberSchema,
    Scatters: numberSchema,
    Saboteur: numberSchema,
    Commander: numberSchema,
    Overcharge: numberSchema,
    'Destroyed By Orbs': numberSchema,
    'Destroyed by Thorns': numberSchema,
    'Destroyed by Death Ray': numberSchema,
    'Destroyed by Land Mine': numberSchema,
    'Destroyed in Spotlight': numberSchema,

    // Bots
    'Flame Bot Damage': numberSchema,
    'Thunder Bot Stuns': numberSchema,
    'Golden Bot Coins Earned': numberSchema,
    'Destroyed in Golden Bot': numberSchema,

    // Guardian
    Damage: numberSchema,
    'Summoned enemies': numberSchema,
    'Guardian coins stolen': numberSchema,
    'Coins Fetched': numberSchema,
    Gems: numberSchema,
    Medals: numberSchema,
    'Reroll Shards Earned': numberSchema,
    'Cannon Shards': numberSchema,
    'Armor Shards': numberSchema,
    'Generator Shards': numberSchema,
    'Core Shards': numberSchema,
    'Common Modules': numberSchema,
    'Rare Modules': numberSchema,
})

function textToObject(input: string): Record<string, string | null> {
    const lines = input.split(EOL)

    return Object.fromEntries(
        lines
            .map(line => line.split('\t') as [string, string | undefined])
            .map(([k, v]) => [k, v ?? null] as const)
            .filter(([k, _]) => k !== ''),
    )
}

async function main(): Promise<void> {
    const text = await clipboard.read()
    // const text = (await readFile('example.txt')).toString('utf8')
    const data = textToObject(text)
    const report = reportSchema.parse(data)

    const columns = [
        // Battle Report
        // report['Battle Date'].format('YYYY-MM-DD'),
        report['Game Time'],
        report['Real Time'],
        report['Tier'],
        report['Wave'],
        report['Killed By'],
        report['Coins earned'],
        report['Coins per hour'],
        report['Cash earned'],
        report['Interest earned'],
        report['Gem Blocks Tapped'],
        report['Cells Earned'],
        report['Reroll Shards Earned'],

        // Combat
        report['Damage Taken'],
        report['Damage Taken Wall'],
        report['Damage Taken While Berserked'],
        report['Damage Gain From Berserk'],
        report['Death Defy'],
        report['Damage dealt'],
        report['Projectiles Damage'],
        report['Rend Armor Damage'],
        report['Projectiles Count'],
        report['Lifesteal'],
        report['Thorn damage'],
        report['Orb Damage'],
        report['Enemies Hit by Orbs'],
        report['Land Mine Damage'],
        report['Land Mines Spawned'],
        report['Death Ray Damage'],
        report['Smart Missile Damage'],
        report['Inner Land Mine Damage'],
        report['Chain Lightning Damage'],
        report['Death Wave Damage'],
        report['Swamp Damage'],
        report['Black Hole Damage'],

        // Utility
        report['Waves Skipped'],
        report['Recovery Packages'],
        report['Free Attack Upgrade'],
        report['Free Defense Upgrade'],
        report['Free Utility Upgrade'],
        report['HP From Death Wave'],
        report['Coins From Death Wave'],
        report['Cash From Golden Tower'],
        report['Coins From Golden Tower'],
        report['Coins From Black Hole'],
        report['Coins From Spotlight'],
        report['Coins From Orb'],
        report['Coins from Coin Upgrade'],
        report['Coins from Coin Bonuses'],

        // Enemies destroyed
        report['Total Enemies'],
        report['Basic'],
        report['Fast'],
        report['Tank'],
        report['Ranged'],
        report['Boss'],
        report['Protector'],
        report['Total Elites'],
        report['Vampires'],
        report['Rays'],
        report['Scatters'],
        report['Saboteur'],
        report['Commander'],
        report['Overcharge'],
        report['Destroyed By Orbs'],
        report['Destroyed by Thorns'],
        report['Destroyed by Death Ray'],
        report['Destroyed by Land Mine'],
        report['Destroyed in Spotlight'],

        // Bots
        report['Flame Bot Damage'],
        report['Thunder Bot Stuns'],
        report['Golden Bot Coins Earned'],
        report['Destroyed in Golden Bot'],

        // Guardian
        report['Damage'],
        report['Guardian coins stolen'],
        0,
        report['Coins Fetched'],
        report['Gems'],
        report['Medals'],
        report['Reroll Shards'],
        report['Cannon Shards'],
        report['Armor Shards'],
        report['Generator Shards'],
        report['Core Shards'],
        report['Common Modules'],
        report['Rare Modules'],

        // Custom
        dayjs().format('YYYY-MM-DD'),
        formatNumber(report['Coins earned']),
    ]

    process.stdout.write(columns.join(';'))
    await clipboard.write(columns.join(';'))
}

main().catch((error: unknown) => {
    console.dir(error, { depth: Infinity })
    process.exit(1)
})
