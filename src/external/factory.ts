import { type ConsolaInstance } from 'consola'

import { Config } from '../config'

import { getWindowPositionFactory } from './get-window-position'
import { type TakeScreenshot, takeScreenshotFactory } from './take-screenshot'
import { type Click, clickFactory } from './click'
import { type MoveCursorTo, moveCursorToFactory } from './move-cursor-to'
import { type PlaySound, playSoundFactory } from './play-sound'
import { type GetText, getTextFactory } from './get-text'
import {
    type IsApplicationActive,
    isApplicationActiveFactory,
} from './is-application-active'
import { type GetNumber, getNumberFactory } from './get-number'
import { activateApplicationFactory } from './activate-application'
import { SendMail, sendMailFactory } from './send-mail'

export type Externals = {
    activateApplication: () => Promise<void>
    click: Click
    getNumber: GetNumber
    getText: GetText
    isApplicationActive: IsApplicationActive
    moveCursorTo: MoveCursorTo
    playSound: PlaySound
    stop: () => Promise<void>
    takeScreenshot: TakeScreenshot
    sendMail: SendMail
}

export function externalsFactory({
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
    const { getText, stop } = getTextFactory({ logger })
    const click = clickFactory({ config, getWindowPosition, logger })
    const moveCursorTo = moveCursorToFactory({
        config,
        getWindowPosition,
        logger,
    })

    return {
        takeScreenshot: takeScreenshotFactory({
            config,
            getWindowPosition,
            getText,
            logger,
        }),
        moveCursorTo,
        click,
        playSound: playSoundFactory({
            config,
            logger: logger,
        }),
        isApplicationActive: isApplicationActiveFactory({ config, logger }),
        getText,
        stop,
        getNumber: getNumberFactory({ getText, logger }),
        activateApplication: activateApplicationFactory({ config, logger }),
        sendMail: sendMailFactory({ config, logger }),
    }
}
