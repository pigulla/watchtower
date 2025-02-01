import type { Sharp } from 'sharp'

export type Command<Input extends unknown[] = []> = (
    screenshot: Sharp,
    ...parameters: Input
) => Promise<Sharp>
