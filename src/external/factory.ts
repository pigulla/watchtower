import {
    ClickAt,
    MoveCursorTo,
    PlaySound,
    TakeScreenshot,
} from '../operations/injections'
import { Position } from '../util/position'

import { getWindowPositionFactory } from './get-window-position'
import { Config } from './config'
import { ConsolaInstance } from 'consola'
import { takeScreenshotFactory } from './take-screenshot'
import { clickFactory } from './click'
import { moveCursorToFactory } from './move-cursor-to'
import { playSoundFactory } from './play-sound'
import { GetText, getTextFactory } from './get-text'
import {
    IsApplicationActive,
    isApplicationActiveFactory,
} from './is-application-active'
import { GetNumber, getNumberFactory } from './get-number'

export type Externals = {
    clickAt: ClickAt
    getNumber: GetNumber
    getText: GetText
    isApplicationActive: IsApplicationActive
    moveCursorTo: MoveCursorTo
    playSound: PlaySound
    takeScreenshot: TakeScreenshot
    stop: () => Promise<void>
}

export function factory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): Externals {
    const getWindowPosition = getWindowPositionFactory({
        config,
        logger,
    })
    const click = clickFactory({ config, logger })
    const { getText, stop } = getTextFactory({ logger })
    const moveCursorTo = moveCursorToFactory({
        config,
        getWindowPosition,
        logger,
    })

    return {
        takeScreenshot: takeScreenshotFactory({
            config,
            getWindowPosition,
            logger,
        }),
        moveCursorTo,
        async clickAt(position: Position): Promise<void> {
            await moveCursorTo(position)
            await click()
        },
        playSound: playSoundFactory({
            config,
            logger: logger,
        }),
        isApplicationActive: isApplicationActiveFactory({ config, logger }),
        getText,
        stop,
        getNumber: getNumberFactory({ getText, logger }),
    }
}
