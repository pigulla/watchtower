import type { Sharp } from 'sharp'

import type { Injections } from '../injections'
import { uiConfig } from '../../ui-config'

import type { Command } from './command'
import { Queries } from '../query/queries'

export type MoveCursorToIdlePosition = Command

export function moveCursorToIdlePositionFactory(
    { moveCursorTo, logger }: Injections,
    { getOpenTab }: Queries,
): MoveCursorToIdlePosition {
    return async function moveCursorToIdlePosition(
        screenshot: Sharp,
    ): Promise<Sharp> {
        logger.debug('Moving cursor to idle position')

        const isTabOpen = (await getOpenTab(screenshot)) !== null

        await moveCursorTo(
            uiConfig.tower.position[
                isTabOpen ? 'withTabsOpen' : 'withTabsClosed'
            ],
        )

        return screenshot
    }
}
