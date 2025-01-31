import { z } from 'zod'

export type Position = { readonly x: number; readonly y: number }

export const positionSchema = z
    .object({
        x: z.number().int(),
        y: z.number().int(),
    })
    .strict()

export const applicationPositionSchema = positionSchema
    .readonly()
    .brand<'ApplicationPosition'>()

export const screenPositionSchema = positionSchema
    .readonly()
    .brand<'ScreenPosition'>()

export type ApplicationPosition = z.infer<typeof applicationPositionSchema>
export type ScreenPosition = z.infer<typeof screenPositionSchema>

export function asApplicationPosition(data: Position): ApplicationPosition {
    return applicationPositionSchema.parse(data)
}

export function asScreenPosition(data: Position): ScreenPosition {
    return screenPositionSchema.parse(data)
}
