export enum DefenseUpgrade {
    HEALTH = 'Health',
    HEALTH_REGEN = 'Health Regen',
    DEFENSE_PERCENT = 'Defense %',
    DEFENSE_ABSOLUTE = 'Defense Absolute',
}

export enum AttackUpgrade {
    DAMAGE = 'Damage',
    ATTACK_SPEED = 'Attack Speed',
    CRITICAL_CHANCE = 'Critical Chance',
    CRITICAL_FACTOR = 'Critical Factor',
}

export enum Sound {
    GAME_OVER = 'game over',
    GEM_COLLECTED = 'gem collected',
    ERROR = 'error',
    START = 'start',
    PERK_AVAILABLE = 'perk available',
    AD_GEM_DETECTED = 'ad gem available',
}

export enum Event {
    NEW_PERK_AVAILABLE = 'perk-available',
    AD_GEM_AVAILABLE = 'ad-gem-available',
}

export type Upgrade = AttackUpgrade | DefenseUpgrade

export const UPGRADE_MAXED = Symbol('upgrade-maxed')

export function tabOf(upgrade: Upgrade): Tab {
    if (Object.values<string>(AttackUpgrade).includes(upgrade)) {
        return Tab.ATTACK_UPGRADES
    } else if (Object.values<string>(DefenseUpgrade).includes(upgrade)) {
        return Tab.DEFENSE_UPGRADES
    }

    throw new Error(`Unknown upgrade '${upgrade}'`)
}

export type RGB = readonly [number, number, number]

export enum Tab {
    ATTACK_UPGRADES = 'Attack Upgrades',
    DEFENSE_UPGRADES = 'Defense Upgrades',
    UTILITY_UPGRADES = 'Utility Upgrades',
    ULTIMATE_WEAPONS = 'Ultimate Weapons',
}

export enum BuyMultiplier {
    X1 = 'x1',
    X5 = 'x5',
    X10 = 'x10',
    X100 = 'x100',
    MAX = 'Max',
}
