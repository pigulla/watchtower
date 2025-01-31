import type { Action, Injections } from './action'
import type { Sharp } from 'sharp'

import { Tab } from '../types'
import { getPixels } from '../util/get-pixels'
import { uiConfig } from '../ui-config'
import { colorDistance } from '../util/color-distance'
import { centerOf } from '../util/center-of'

export interface EnsureTabIsOpen extends Action<[Tab]> {}

export function ensureTabIsOpenFactory({
    clickAt,
    takeScreenshot,
    logger,
}: Injections): EnsureTabIsOpen {
    async function getOpenTab(screenshot: Sharp): Promise<Tab | null> {
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

    return async function ensureTabIsOpen(
        screenshot: Sharp,
        tab: Tab,
    ): Promise<Sharp> {
        logger.verbose(`Ensuring tab '${tab}' is open`)
        const openTab = await getOpenTab(screenshot)

        if (openTab === tab) {
            logger.verbose(`Tab '${tab}' is already open`)
            return screenshot
        }

        await clickAt(centerOf(uiConfig.tabs.buttons[tab]))
        screenshot = await takeScreenshot()

        if ((await getOpenTab(screenshot)) !== tab) {
            throw new Error(`Failed to open tab '${tab}'`)
        }

        return screenshot
    }
}
