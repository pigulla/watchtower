import { Duration } from 'dayjs/plugin/duration'
import { Option, InvalidOptionArgumentError } from '@commander-js/extra-typings'

import dayjs from 'dayjs'

export const interval = new Option(
    '-i, --interval <seconds>',
    'interval between iterations',
)
    .default(180)
    .argParser<Duration>((input, _) => {
        if (!/^[-+]?\d+$/.test(input)) {
            throw new InvalidOptionArgumentError('Integer expected.')
        }

        const value = Number.parseInt(input)

        if (value < 1 || value > 3600) {
            throw new InvalidOptionArgumentError(
                'Value must be in interval [1; 3600].',
            )
        }

        return dayjs.duration(value, 'seconds')
    })
