import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createConsola, LogLevels } from 'consola'

import { Application } from './application.js'
import { Extractor } from './extractor.js'
import { type IExtractor } from './extractor.interface.js'
import { GameState } from './game-state.js'
import { OCR } from './ocr.js'
import { Tab, BuyMultiplier, DefenseUpgrade, Sound } from './types.js'
import { uiConfig } from './ui-config.js'
import { centerOf } from './util/center-of.js'
import { getFloatingGemPath } from './util/get-floating-gem-path.js'
import { asApplicationPosition } from './util/position.js'
import { sleep } from './util/sleep.js'

import { sep as SEPARATOR } from 'node:path'

import { z } from 'zod'

const pathSchema = z.string().startsWith(SEPARATOR)

const configSchema = z
    .object({
        logLevel: z.union([
            z.literal('silent'),
            z.literal('fatal'),
            z.literal('error'),
            z.literal('warn'),
            z.literal('log'),
            z.literal('info'),
            z.literal('success'),
            z.literal('fail'),
            z.literal('ready'),
            z.literal('start'),
            z.literal('box'),
            z.literal('debug'),
            z.literal('trace'),
            z.literal('verbose'),
        ]),
        delayInSeconds: z.number().int().positive(),
        theTowerApplication: z
            .object({
                titleBarHeight: z.number().int().min(1),
                name: z.string().min(1),
                title: z.string().min(1),
            })
            .strict(),
        binaries: z
            .object({
                afplay: pathSchema,
                cliclick: pathSchema,
                osascript: pathSchema,
                pngpaste: pathSchema,
                screencapture: pathSchema,
            })
            .strict(),
    })
    .strict()

const cfg = configSchema.parse({
    logLevel: 'debug',
    delayInSeconds: 180,
    theTowerApplication: {
        titleBarHeight: 33,
        name: 'TheTower',
        title: 'The Tower',
    },
    binaries: {
        afplay: '/usr/bin/afplay',
        cliclick: '/opt/homebrew/bin/cliclick',
        osascript: '/usr/bin/osascript',
        pngpaste: '/opt/homebrew/bin/pngpaste',
        screencapture: '/usr/sbin/screencapture',
    },
})
const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
const logger = createConsola({ level: LogLevels[cfg.logLevel] })

const ocr = await new OCR({ logger }).start()
const extractor: IExtractor = new Extractor({ ocr, logger })
const gameState = new GameState({ extractor, logger })
const application = new Application({
    logger,
    binaries: cfg.binaries,
    theTowerApplication: cfg.theTowerApplication,
    soundDirectory: join(ROOT_DIR, 'sounds'),
})

logger.start('WatchTower started')
await application.playSound(Sound.START, 1)
await application.activateApplication()

let screenshot = await application.getScreenshot()
const { width, height } = await screenshot.metadata()

if (width !== uiConfig.window.width || height !== uiConfig.window.height) {
    logger.error(
        `Expected application window of size ${uiConfig.window.width}x${uiConfig.window.height} but got ${width}x${height}`,
    )

    await ocr.stop()
    process.exit(1)
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
gameState.on('gameOver', async () => {
    logger.info('Game is over, terminating')

    await ocr.stop()
    await application.playSound(Sound.GAME_OVER, 1)

    process.exit()
})

gameState.on('gemCount', gems => {
    logger.info(`Gem count is now ${gems}`)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
gameState.on('newPerkAvailable', async () => {
    logger.info('New perk available')

    await application.playSound(Sound.PERK_AVAILABLE, 1)
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
gameState.on('adGemAvailable', async region => {
    logger.success('Ad gem detected')

    await application.playSound(Sound.GEM_COLLECTED, 1)
    const position = centerOf(region)
    await application.clickAt(asApplicationPosition(position))

    screenshot = await application.getScreenshot()
})

async function purchaseUpgrades(): Promise<void> {
    for (const upgrade of [
        DefenseUpgrade.HEALTH,
        DefenseUpgrade.DEFENSE_ABSOLUTE,
        DefenseUpgrade.HEALTH_REGEN,
    ]) {
        const cost = await extractor.getUpgradeCost(screenshot, upgrade)

        if (typeof cost === 'bigint') {
            logger.info(`Purchasing upgrade '${upgrade}'`)

            const position = centerOf(uiConfig.tabs.upgrades[upgrade].cost)
            await application.clickAt(asApplicationPosition(position))
            screenshot = await application.getScreenshot()

            break
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
while (true) {
    await application.activateApplication()
    screenshot = await application.getScreenshot()

    if ((await extractor.getOpenTab(screenshot)) !== Tab.DEFENSE_UPGRADES) {
        logger.debug(`Opening 'Defense Upgrade' tab`)
        const position = centerOf(uiConfig.tabs.buttons[Tab.DEFENSE_UPGRADES])
        await application.clickAt(asApplicationPosition(position))
        screenshot = await application.getScreenshot()
    }

    const buyMultiplier = await extractor.getBuyMultiplier(screenshot)
    if (buyMultiplier !== BuyMultiplier.MAX) {
        logger.warn(
            `Buy multiplier is set to '${buyMultiplier}', recommended is '${BuyMultiplier.MAX}'`,
        )
    }

    await purchaseUpgrades()
    await gameState.update(screenshot)

    logger.debug('Trying to collect floating gem')
    for (const position of getFloatingGemPath({ isTabsOpen: true })) {
        await application.clickAt(position)
    }

    logger.debug(`Waiting for ${cfg.delayInSeconds} seconds`)
    await application.moveCursorTo(
        asApplicationPosition(uiConfig.tower.position.withTabsOpen),
    )
    await sleep(cfg.delayInSeconds * 1000)
}
