import { uiConfig } from '../ui-config'

import { type ApplicationPosition, asApplicationPosition } from './position'

// Returns a half-arc in counterclockwise direction. That should catch the gem fairly reliably.
export function getFloatingGemPath({
    isTabsOpen,
}: {
    isTabsOpen: boolean
}): ApplicationPosition[] {
    const segments = 10
    const radius = 183
    const towerLocation =
        uiConfig.tower.position[isTabsOpen ? 'withTabsOpen' : 'withTabsClosed']

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
