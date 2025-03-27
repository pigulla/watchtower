import { Option, InvalidOptionArgumentError } from '@commander-js/extra-typings'

import { Strategy } from '../../operations/command/purchase-upgrades'

enum StrategyKey {
    SEQUENTIAL = 'sequential',
    ROUND_ROBIN = 'round-robin',
    CHEAPEST_FIRST = 'cheapest-first',
    RANDOM = 'random',
}

export const strategy = new Option(
    '-s, --strategy <strategy>',
    'purchase strategy to use',
)
    .default(Strategy.SEQUENTIAL, StrategyKey.SEQUENTIAL)
    .argParser<Strategy>((value, _) => {
        switch (value as StrategyKey) {
            case StrategyKey.SEQUENTIAL:
                return Strategy.SEQUENTIAL
            case StrategyKey.ROUND_ROBIN:
                return Strategy.ROUND_ROBIN
            case StrategyKey.CHEAPEST_FIRST:
                return Strategy.CHEAPEST_FIRST
            case StrategyKey.RANDOM:
                return Strategy.RANDOM
            default:
                throw new InvalidOptionArgumentError(`Not a valid strategy.`)
        }
    })
