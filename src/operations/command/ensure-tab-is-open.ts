import type { Sharp } from 'sharp'

import type { Injections } from '../injections'
import { Tab } from '../../types'
import { uiConfig } from '../../ui-config'
import { centerOf } from '../../util/center-of'
import { Queries } from '../query/queries'

import type { Command } from './command'

export type EnsureTabIsOpen = Command<[Tab]>

export function ensureTabIsOpenFactory(
    { clickAt, takeScreenshot, logger }: Injections,
    { getOpenTab }: Queries,
): EnsureTabIsOpen {
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
