import type { Sharp } from 'sharp'

import { Tab } from '../../types'
import { getPixels } from '../../util/get-pixels'
import { uiConfig } from '../../ui-config'
import { colorDistance } from '../../util/color-distance'
import { Injections } from '../injections'

import { Query } from './query'

export type GetOpenTab = Query<Tab | null>

export function getOpenTabFactory(_injections: Injections): GetOpenTab {
    return async function getOpenTab(screenshot: Sharp): Promise<Tab | null> {
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
}
