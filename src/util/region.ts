import { z } from 'zod'

export type Region = {
    readonly left: number
    readonly top: number
    readonly width: number
    readonly height: number
}

export const regionSchema = z
    .object({
        left: z.number().int(),
        top: z.number().int(),
        width: z.number().int(),
        height: z.number().int(),
    })
    .strict()

// A region in application coordinates.
export const applicationRegionSchema = regionSchema
    .readonly()
    .brand<'ApplicationRegion'>()

// A region in screen coordinates.
export const screenRegionSchema = regionSchema
    .readonly()
    .brand<'ScreenRegion'>()

export type ApplicationRegion = z.infer<typeof applicationRegionSchema>
export type ScreenRegion = z.infer<typeof screenRegionSchema>

export function asApplicationRegion(data: Region): ApplicationRegion {
    return applicationRegionSchema.parse(data)
}

export function asScreenRegion(data: Region): ScreenRegion {
    return screenRegionSchema.parse(data)
}
