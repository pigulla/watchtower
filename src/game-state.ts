import EventEmitter from 'node:events'

import { type ConsolaInstance } from 'consola'
import { type Sharp } from 'sharp'

import { type IExtractor } from './extractor.interface'
import { type ApplicationRegion } from './util/region'

export class GameState extends EventEmitter<{
    gemCount: [number]
    adGemAvailable: [ApplicationRegion]
    newPerkAvailable: [boolean]
    gameOver: []
}> {
    private readonly extractor: IExtractor
    private readonly logger: ConsolaInstance

    private readonly state: {
        gemCount: null | number
        isNewPerkAvailable: boolean
    }

    public constructor({
        extractor,
        logger,
    }: {
        extractor: IExtractor
        logger: ConsolaInstance
    }) {
        super()

        this.extractor = extractor
        this.logger = logger.withTag(GameState.name)

        this.state = {
            gemCount: null,
            isNewPerkAvailable: false,
        }
    }

    private async checkAdGemAvailability(screenshot: Sharp): Promise<void> {
        const adGemRegion =
            await this.extractor.getAdGemButtonRegion(screenshot)

        if (adGemRegion) {
            this.emit('adGemAvailable', adGemRegion)
        }
    }

    private async checkGemCount(screenshot: Sharp): Promise<void> {
        const gemCount = await this.extractor.getGemCount(screenshot)

        if (gemCount !== null && this.state.gemCount !== gemCount) {
            this.logger.verbose(
                `Gem count changed from ${this.state.gemCount} to ${gemCount}`,
            )
            this.state.gemCount = gemCount
            this.emit('gemCount', gemCount)
        }
    }

    private async checkNewPerkAvailability(screenshot: Sharp): Promise<void> {
        const isNewPerkAvailable =
            await this.extractor.isNewPerkAvailable(screenshot)

        if (this.state.isNewPerkAvailable !== isNewPerkAvailable) {
            this.logger.verbose(
                `New perk availability changed from ${this.state.isNewPerkAvailable} to ${isNewPerkAvailable}`,
            )
            this.state.isNewPerkAvailable = isNewPerkAvailable
            this.emit('newPerkAvailable', isNewPerkAvailable)
        }
    }

    private async checkIsGameOver(screenshot: Sharp): Promise<void> {
        const isGameOver = await this.extractor.isGameOver(screenshot)

        if (isGameOver) {
            this.emit('gameOver')
        }
    }

    public async update(screenshot: Sharp): Promise<void> {
        await Promise.all([
            this.checkGemCount(screenshot),
            this.checkNewPerkAvailability(screenshot),
            this.checkIsGameOver(screenshot),
            this.checkAdGemAvailability(screenshot),
        ])
    }
}
