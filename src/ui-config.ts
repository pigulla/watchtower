import { AttackUpgrade, DefenseUpgrade, Tab } from './types'

const {
    ATTACK_UPGRADES,
    DEFENSE_UPGRADES,
    ULTIMATE_WEAPONS,
    UTILITY_UPGRADES,
} = Tab
const { DAMAGE, ATTACK_SPEED, CRITICAL_FACTOR, CRITICAL_CHANCE } = AttackUpgrade
const { DEFENSE_ABSOLUTE, DEFENSE_PERCENT, HEALTH_REGEN, HEALTH } =
    DefenseUpgrade

export const uiConfig = {
    window: { width: 1576, height: 2158 },
    tower: {
        position: {
            withTabsOpen: {
                x: 789,
                y: 544,
            },
            withTabsClosed: {
                x: 789,
                y: 753,
            },
        },
    },
    killedByText: [
        {
            left: 420,
            top: 915,
            width: 750,
            height: 120,
        },
        {
            left: 420,
            top: 960,
            width: 750,
            height: 120,
        },
    ],
    stats: {
        cash: {
            left: 68,
            top: 91,
            width: 240,
            height: 70,
        },
        coins: {
            left: 90,
            top: 175,
            width: 240,
            height: 70,
        },
        gemCounter: {
            left: 100,
            top: 270,
            width: 135,
            height: 53,
        },
        perkProgress: {
            left: 586,
            top: 90,
            width: 429,
            height: 67,
        },
        wave: {
            regions: [
                {
                    left: 810,
                    top: 1187,
                    width: 287,
                    height: 61,
                },
                {
                    left: 810,
                    top: 1931,
                    width: 287,
                    height: 61,
                },
            ],
        },
    },
    adGem: {
        claimTextOffset: {
            left: 35,
            top: 60,
            width: 183,
            height: 64,
        },
        regions: [
            {
                left: 230,
                top: 830,
                width: 250,
                height: 140,
            },
            {
                left: 230,
                top: 957,
                width: 250,
                height: 140,
            },
            {
                left: 230,
                top: 1574,
                width: 250,
                height: 140,
            },
            {
                left: 230,
                top: 1701,
                width: 250,
                height: 140,
            },
            {
                left: 230,
                top: 1504,
                width: 250,
                height: 140,
            },
            {
                left: 230,
                top: 760,
                width: 250,
                height: 140,
            },
            {
                left: 230,
                top: 887,
                width: 250,
                height: 140,
            },
            {
                left: 230,
                top: 1631,
                width: 250,
                height: 140,
            },
        ],
    },
    tabs: {
        title: {
            left: 210,
            top: 1338,
            width: 900,
            height: 64,
        },
        buyMultiplier: {
            left: 1205,
            top: 1346,
            width: 125,
            height: 48,
        },
        colors: {
            [ATTACK_UPGRADES]: [25, 158, 201] as const,
            [DEFENSE_UPGRADES]: [207, 63, 90] as const,
            [UTILITY_UPGRADES]: [221, 184, 19] as const,
            [ULTIMATE_WEAPONS]: [96, 214, 76] as const,
        },
        buttons: {
            [ATTACK_UPGRADES]: { left: 20, top: 2059, width: 356, height: 87 },
            [DEFENSE_UPGRADES]: {
                left: 413,
                top: 2059,
                width: 356,
                height: 87,
            },
            [UTILITY_UPGRADES]: {
                left: 807,
                top: 2059,
                width: 356,
                height: 87,
            },
            [ULTIMATE_WEAPONS]: {
                left: 1201,
                top: 2059,
                width: 356,
                height: 87,
            },
        },
        upgrades: {
            [DAMAGE]: {
                title: {
                    left: 252,
                    top: 1459,
                    width: 245,
                    height: 162,
                },
                cost: {
                    left: 526,
                    top: 1555,
                    width: 222,
                    height: 65,
                },
            },
            [CRITICAL_CHANCE]: {
                title: {
                    left: 252,
                    top: 1688,
                    width: 245,
                    height: 162,
                },
                cost: {
                    left: 526,
                    top: 1788,
                    width: 222,
                    height: 56,
                },
            },
            [ATTACK_SPEED]: {
                title: {
                    left: 818,
                    top: 1459,
                    width: 245,
                    height: 162,
                },
                cost: {
                    left: 1090,
                    top: 1572,
                    width: 222,
                    height: 41,
                },
            },
            [CRITICAL_FACTOR]: {
                title: {
                    left: 818,
                    top: 1688,
                    width: 245,
                    height: 162,
                },
                cost: {
                    left: 1090,
                    top: 1802,
                    width: 222,
                    height: 41,
                },
            },
            [HEALTH]: {
                title: {
                    left: 252,
                    top: 1459,
                    width: 245,
                    height: 162,
                },
                cost: {
                    left: 526,
                    top: 1555,
                    width: 222,
                    height: 65,
                },
            },
            [DEFENSE_PERCENT]: {
                title: {
                    left: 252,
                    top: 1688,
                    width: 245,
                    height: 162,
                },
                cost: {
                    left: 526,
                    top: 1788,
                    width: 222,
                    height: 56,
                },
            },
            [HEALTH_REGEN]: {
                title: {
                    left: 818,
                    top: 1459,
                    width: 245,
                    height: 162,
                },
                cost: {
                    left: 1090,
                    top: 1572,
                    width: 222,
                    height: 41,
                },
            },

            [DEFENSE_ABSOLUTE]: {
                title: {
                    left: 818,
                    top: 1688,
                    width: 245,
                    height: 162,
                },
                cost: {
                    left: 1090,
                    top: 1802,
                    width: 222,
                    height: 41,
                },
            },
        },
    },
}
