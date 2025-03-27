import { Option, InvalidOptionArgumentError } from '@commander-js/extra-typings'

import { Event } from '../../types'

enum NotifyOnOption {
    AD_GEM_AVAILABLE = 'ad-gem-available',
    NEW_PERK_AVAILABLE = 'new-perk-available',
}

export const notifyOn = new Option(
    '-n, --notify-on <events...>',
    'notify on the specified events',
)
    .choices(Object.values(NotifyOnOption))
    .default<Set<Event>>(new Set(), '<none>')
    .argParser<Set<Event>>((value, previous) => {
        switch (value as NotifyOnOption) {
            case NotifyOnOption.AD_GEM_AVAILABLE:
                return previous.add(Event.AD_GEM_AVAILABLE)
            case NotifyOnOption.NEW_PERK_AVAILABLE:
                return previous.add(Event.NEW_PERK_AVAILABLE)
            default:
                throw new InvalidOptionArgumentError(`Not a valid event name.`)
        }
    })
