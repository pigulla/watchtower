import { Option, InvalidOptionArgumentError } from '@commander-js/extra-typings'

import { Upgrade, DefenseUpgrade } from '../../types'

enum UpgradeKey {
    HEALTH = 'H',
    HEALTH_REGEN = 'HR',
    DEFENSE_PERCENT = 'DP',
    DEFENSE_ABSOLUTE = 'DA',
}

export const purchase = new Option(
    '-p, --purchase <upgrades...>',
    'purchase specified upgrades',
)
    .choices(Object.values(UpgradeKey))
    .default<Upgrade[]>([] as Upgrade[], '<none>')
    .argParser<Upgrade[]>((value, previous) => {
        switch (value as UpgradeKey) {
            case UpgradeKey.HEALTH:
                return [...previous, DefenseUpgrade.HEALTH]
            case UpgradeKey.HEALTH_REGEN:
                return [...previous, DefenseUpgrade.HEALTH_REGEN]
            case UpgradeKey.DEFENSE_PERCENT:
                return [...previous, DefenseUpgrade.DEFENSE_PERCENT]
            case UpgradeKey.DEFENSE_ABSOLUTE:
                return [...previous, DefenseUpgrade.DEFENSE_ABSOLUTE]
            default:
                throw new InvalidOptionArgumentError(`Not a valid upgrade.`)
        }
    })
