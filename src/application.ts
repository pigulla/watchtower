import { type ConsolaInstance } from 'consola'
import { execa } from 'execa'
import sharp, { type Sharp } from 'sharp'

import { type IApplication } from './application.interface'
import {
    type ApplicationPosition,
    asScreenPosition,
    type ScreenPosition,
} from './util/position'
import { type ScreenRegion, asScreenRegion } from './util/region'

type Binaries = {
    readonly afplay: string
    readonly cliclick: string
    readonly osascript: string
    readonly pngpaste: string
    readonly screencapture: string
}

type TheTowerApplication = {
    readonly titleBarHeight: number
    readonly name: string
    readonly title: string
}

export class Application implements IApplication {
    private readonly theTowerApplication: TheTowerApplication
    private readonly binaries: Binaries
    private readonly logger: ConsolaInstance

    public constructor({
        binaries,
        theTowerApplication,
        logger,
    }: {
        binaries: Binaries
        theTowerApplication: TheTowerApplication
        logger: ConsolaInstance
    }) {
        this.binaries = { ...binaries }
        this.theTowerApplication = { ...theTowerApplication }
        this.logger = logger.withTag(Application.name)
    }

    public async activateApplication(): Promise<void> {
        await this.run(this.binaries.osascript, [
            '-e',
            `tell application "${this.theTowerApplication.title}" to activate`,
        ])
    }

    private async run<T extends { asBuffer: boolean }>(
        command: string,
        args: string | string[],
        options?: T,
    ): Promise<T extends { asBuffer: true } ? Buffer : string> {
        this.logger.trace(
            `Executing command: ${command} ${(Array.isArray(args) ? args : [args]).join(' ')}`,
        )

        const result = await execa(
            command,
            typeof args === 'string' ? [args] : args,
            {
                encoding: options?.asBuffer ? 'buffer' : 'utf8',
            },
        )

        return result.stdout as T extends { asBuffer: true } ? Buffer : string
    }

    public async getWindowPosition(): Promise<ScreenRegion> {
        const result = await this.run(this.binaries.osascript, [
            '-e',
            `tell application "System Events" to tell process "${this.theTowerApplication.title}" to tell window 1 to get its { position, size }`,
        ])
        const matches = /^(-?\d+), (-?\d+), (\d+), (\d+)$/.exec(result)

        if (matches === null) {
            throw new Error(`Failed to parse window position and size`)
        }

        return asScreenRegion({
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            left: Number.parseInt(matches[1]!),
            top: Number.parseInt(matches[2]!),
            width: Number.parseInt(matches[3]!),
            height: Number.parseInt(matches[4]!),
        })
    }

    public async isApplicationActive(): Promise<boolean> {
        const name = await this.run(this.binaries.osascript, [
            '-e',
            'tell application "System Events" to tell (first process whose frontmost is true) to return name',
        ])

        return name === this.theTowerApplication.name
    }

    private async toScreenPosition(
        position: ApplicationPosition,
    ): Promise<ScreenPosition> {
        const RETINA_SCALE = 2
        const { left, top } = await this.getWindowPosition()

        return asScreenPosition({
            x: Math.floor(position.x / RETINA_SCALE + left),
            y: Math.floor(position.y / RETINA_SCALE + top),
        })
    }

    public async moveCursorTo(position: ApplicationPosition): Promise<void> {
        const { x, y } = await this.toScreenPosition(position)

        await this.run(this.binaries.cliclick, [`m:${x},${y}`])
    }

    public async clickAt(position: ApplicationPosition): Promise<void> {
        const { x, y } = await this.toScreenPosition(position)

        await this.run(this.binaries.cliclick, [`c:${x},${y}`])
    }

    public async getScreenshot(): Promise<Sharp> {
        const { left, top, width, height } = await this.getWindowPosition()

        this.logger.trace(
            `Detected window with size ${width}x${height} at (${left}, ${top})`,
        )

        if (left < 0 || top < 0) {
            throw new Error(`Window position is outside the desktop area`)
        }

        await this.run(this.binaries.screencapture, [
            `-R${left},${top},${width},${height}`,
            '-tpng',
            '-c',
        ])
        const buffer = await this.run(this.binaries.pngpaste, ['-'], {
            asBuffer: true,
        })

        return sharp(buffer)
    }
}
