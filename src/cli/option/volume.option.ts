import { InvalidOptionArgumentError, Option } from '@commander-js/extra-typings'

export const volume = new Option('--volume <volume>', 'set sound output volume')
    .default<number>(1.0)
    .argParser<number>((input, _) => {
        if (!/^[-+]?\d+|\d+\.\d+|\.\d+$/.test(input)) {
            throw new InvalidOptionArgumentError('Number expected.')
        }

        const value = parseFloat(input)

        if (value < 0 || value > 1) {
            throw new InvalidOptionArgumentError(
                'Value must be in interval [0; 1].',
            )
        }

        return value
    })
    .conflicts('silent')
