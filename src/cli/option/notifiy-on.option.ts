import { Option, InvalidOptionArgumentError } from '@commander-js/extra-typings'

import { Event } from '../../types'

export const notifyOn = new Option(
    '-n, --notify-on <events...>',
    'notify on the specified events',
)
    .choices(['ad-gem-available', 'perk-available'])
    .default(new Set(), '<none>')
    .argParser<Set<Event>>((value, previous) => {
        switch (value) {
            case 'ad-gem-available':
                return previous.add(Event.AD_GEM_AVAILABLE)
            case 'perk-available':
                return previous.add(Event.PERK_AVAILABLE)
            default:
                throw new InvalidOptionArgumentError(`Not a valid event name.`)
        }
    })
