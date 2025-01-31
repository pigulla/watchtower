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
    GAME_OVER = 'game-over.wav',
    GEM_COLLECTED = 'gem-collected.wav',
    START = 'start.mp3',
    PERK_AVAILABLE = 'perk-available.mp3',
}

export type Upgrade = AttackUpgrade | DefenseUpgrade

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
