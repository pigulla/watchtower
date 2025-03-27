import type { Sharp } from 'sharp'

import type { Injections } from '../injections'
import {
    type ApplicationPosition,
    asApplicationPosition,
} from '../../util/position'
import { uiConfig } from '../../ui-config'

import type { Command } from './command'
import { Queries } from '../query/queries'

export type CollectFloatingGem = Command

// Returns a half-arc in counterclockwise direction. That should catch the gem fairly reliably.
export function getFloatingGemPath({
    isTabsOpen,
}: {
    isTabsOpen: boolean
}): ApplicationPosition[] {
    const segments = 10
    const radius = 215
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

export function collectFloatingGemFactory(
    { click, logger }: Injections,
    { getOpenTab }: Queries,
): CollectFloatingGem {
    return async function collectFloatingGem(
        screenshot: Sharp,
    ): Promise<Sharp> {
        logger.debug('Trying to collect floating gem')

        for (const position of getFloatingGemPath({
            isTabsOpen: (await getOpenTab(screenshot)) !== null,
        })) {
            await click(position)
        }

        return screenshot
    }
}
