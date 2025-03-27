import type { Sharp } from 'sharp'

export type Query<Output, Input extends unknown[] = []> = (
    screenshot: Sharp,
    ...parameters: Input
) => Promise<Output>
