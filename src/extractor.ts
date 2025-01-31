import { type ConsolaInstance } from 'consola'
import { type Sharp } from 'sharp'

import { type IExtractor, UPGRADE_MAXED } from './extractor.interface'
import {
    DIGITS,
    type IOCR,
    LETTERS,
    OCRMode,
    UPPERCASE_LETTERS,
} from './ocr.interface'
import { BuyMultiplier, Tab, type Upgrade } from './types'
import { uiConfig } from './ui-config'
import { colorDistance } from './util/color-distance'
import { fixOcrNumber } from './util/fix-ocr-number'
import { getPixels } from './util/get-pixels'
import { parseNumber } from './util/parse-number'
import {
    type ApplicationRegion,
    asApplicationRegion,
    type Region,
} from './util/region'

export class Extractor implements IExtractor {
    private readonly ocr: IOCR
    private readonly logger: ConsolaInstance

    public constructor({
        ocr,
        logger,
    }: {
        ocr: IOCR
        logger: ConsolaInstance
    }) {
        this.ocr = ocr
        this.logger = logger
    }

    public async isGameOver(screenshot: Sharp): Promise<boolean> {
        const text = await this.ocr.getText(screenshot, uiConfig.killedByText, {
            mode: OCRMode.SINGLE_LINE,
        })

        return text.startsWith('Killed By')
    }

    public async getUpgradeCost(
        screenshot: Sharp,
        upgrade: Upgrade,
    ): Promise<bigint | typeof UPGRADE_MAXED | null> {
        const title = await this.ocr.getText(
            screenshot,
            uiConfig.tabs.upgrades[upgrade].title,
        )

        if (title !== upgrade.toString()) {
            throw new Error(
                `Expected upgrade title '${upgrade}' but found '${title}'`,
            )
        }

        const cost = await this.ocr.getText(
            screenshot,
            uiConfig.tabs.upgrades[upgrade].cost,
            {
                mode: OCRMode.SINGLE_LINE,
            },
        )

        if (cost === 'Max') {
            return UPGRADE_MAXED
        }

        const matches = /^[5S$]\s*(.+)$/.exec(cost)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return matches ? parseNumber(matches[1]!) : null
    }

    public async getAdGemButtonRegion(
        screenshot: Sharp,
    ): Promise<ApplicationRegion | null> {
        const offset = uiConfig.adGem.claimTextOffset

        for (const candidate of uiConfig.adGem.regions) {
            const text = await this.ocr.getText(
                screenshot,
                {
                    left: candidate.left + offset.left,
                    top: candidate.top + offset.top,
                    height: offset.height,
                    width: offset.width,
                },
                {
                    mode: OCRMode.SINGLE_WORD,
                    characters: UPPERCASE_LETTERS,
                },
            )

            if (text === 'CLAIM') {
                return asApplicationRegion(candidate)
            }
        }

        return null
    }

    private async getNumber(
        screenshot: Sharp,
        region: Region,
    ): Promise<bigint | null> {
        const text = await this.ocr.getText(
            screenshot.clone().threshold(192),
            region,
            {
                mode: OCRMode.SINGLE_LINE,
                characters: '1234567890.KMBTqQsSOND',
            },
        )

        if (text.length === 0) {
            return null
        }

        const result = fixOcrNumber(text)

        if (result !== text) {
            this.logger.verbose(`Corrected '${text}' to '${result}'`)
        }

        return parseNumber(result)
    }

    public async getCash(screenshot: Sharp): Promise<bigint | null> {
        return this.getNumber(screenshot, uiConfig.stats.cash)
    }

    public async getCoins(screenshot: Sharp): Promise<bigint | null> {
        return this.getNumber(screenshot, uiConfig.stats.coins)
    }

    public async getBuyMultiplier(
        screenshot: Sharp,
    ): Promise<BuyMultiplier | null> {
        const text = await this.ocr.getText(
            screenshot.clone().threshold(192),
            uiConfig.tabs.buyMultiplier,
            {
                mode: OCRMode.SINGLE_WORD,
            },
        )

        if (Object.values<string>(BuyMultiplier).includes(text)) {
            return text as BuyMultiplier
        }

        return null
    }

    public async isNewPerkAvailable(screenshot: Sharp): Promise<boolean> {
        const text = await this.ocr.getText(
            screenshot.clone().grayscale(),
            uiConfig.stats.perkProgress,
            { mode: OCRMode.SINGLE_LINE, characters: LETTERS },
        )

        return text === 'New Perk'
    }

    public async isTabsOpen(screenshot: Sharp): Promise<boolean> {
        return (await this.getOpenTab(screenshot)) !== null
    }

    public async getOpenTab(screenshot: Sharp): Promise<Tab | null> {
        const pixels = await getPixels(screenshot, [
            { x: 90, y: 1370 },
            { x: uiConfig.window.width - 90, y: 1370 },
        ])

        for (const tab of [
            Tab.ATTACK_UPGRADES,
            Tab.DEFENSE_UPGRADES,
            Tab.UTILITY_UPGRADES,
            Tab.ULTIMATE_WEAPONS,
        ]) {
            const color = uiConfig.tabs.colors[tab]

            if (pixels.every(pixel => colorDistance(pixel, color) < 5)) {
                return tab
            }
        }

        return null
    }

    public async getGemCount(screenshot: Sharp): Promise<number | null> {
        const text = await this.ocr.getText(
            screenshot.clone().threshold(192),
            uiConfig.stats.gemCounter,
            { mode: OCRMode.SINGLE_WORD, characters: DIGITS },
        )

        if (/^\d+$/.test(text)) {
            return Number.parseInt(text)
        }

        return null
    }
}
