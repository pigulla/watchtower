import type { Action, Injections } from './action'
import type { Sharp } from 'sharp'

import {
    type ApplicationPosition,
    asApplicationPosition,
} from '../util/position'
import { uiConfig } from '../ui-config'

export interface CollectFloatingGem extends Action {}

// Returns a half-arc in counterclockwise direction. That should catch the gem fairly reliably.
export function getFloatingGemPath({
    isTabsOpen,
}: {
    isTabsOpen: boolean
}): ApplicationPosition[] {
    const segments = 10
    const radius = 183
    const towerLocation =
        uiConfig.tower.position[`withTabs${isTabsOpen ? 'Open' : 'Closed'}`]

    return Array.from({ length: segments + 1 })
        .map((_, i) => {
            const r = (i * Math.PI) / segments
            return asApplicationPosition({
                x: Math.floor(towerLocation.x + Math.cos(r) * radius),
                y: Math.floor(towerLocation.y + Math.sin(r) * radius),
            })
        })
        .reverse()
}

export function collectFloatingGemFactory({
    clickAt,
    isTabsOpen,
    logger,
}: Injections): CollectFloatingGem {
    return async function collectFloatingGem(
        screenshot: Sharp,
    ): Promise<Sharp> {
        logger.debug('Trying to collect floating gem')

        for (const position of getFloatingGemPath({
            isTabsOpen: await isTabsOpen(),
        })) {
            await clickAt(position)
        }

        return screenshot
    }
}
