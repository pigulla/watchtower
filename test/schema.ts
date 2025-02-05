import { z } from 'zod'

import { AttackUpgrade, BuyMultiplier, DefenseUpgrade, Tab } from '../src/types'

const upgradeCostSchema = z.union([z.literal('Max'), z.string().regex(/^\d+$/)])

export const schema = z
    .object({
        openTab: z.nativeEnum(Tab).nullable(),
        isMenuOpen: z.boolean(),
        isGameOver: z.boolean(),
        wave: z.number().int().min(1).nullable(),
        cash: z.string().regex(/^\d+$/).nullable(),
        coins: z.string().regex(/^\d+$/).nullable(),
        gems: z.number().int().min(0).nullable(),
        isAdGemAvailable: z.boolean(),
        isNewPerkAvailable: z.boolean(),
        buyMultiplier: z.nativeEnum(BuyMultiplier).nullable(),
        upgradeCost: z
            .object({
                attack: z
                    .record(z.nativeEnum(AttackUpgrade), upgradeCostSchema)
                    .nullable(),
                defense: z
                    .record(z.nativeEnum(DefenseUpgrade), upgradeCostSchema)
                    .nullable(),
            })
            .strict(),
    })
    .strict()

export type TestCase = z.infer<typeof schema>
