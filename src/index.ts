import assert from 'node:assert/strict'
import { execa } from 'execa'
import { promisify } from 'node:util'

const WIDTH = 788
const HEIGHT = 1079

const adGemCenter = { left: 180, top: 525 }
const towerCenter = { left: 395, top: 333 }

const sleep = promisify(setTimeout)

async function click(
    position: {
        left: number
        top: number
    },
    jitter: number,
): Promise<void> {
    const left = Math.floor(position.left + Math.random() * jitter - jitter / 2)
    const top = Math.floor(position.top + Math.random() * jitter - jitter / 2)

    const params = [`c:${left},${top}`]
    await execa('/opt/homebrew/bin/cliclick', params)
}

async function activateApplication(): Promise<void> {
    const params = ['-e', `tell application "The Tower" to activate`]

    await execa('/usr/bin/osascript', params)
}

async function isGameOver(): Promise<boolean> {
    return false
}

async function clickFloatingGem(): Promise<void> {
    const radius = 75
    const steps = 10

    for (let i = steps; i >= 0; i--) {
        const x = (i * Math.PI) / steps
        const p = {
            left: Math.floor(towerCenter.left + Math.cos(x) * radius),
            top: Math.floor(towerCenter.top + Math.sin(x) * radius),
        }

        await click(p, 2)
        await sleep(333)
    }
}

async function clickAdGem(): Promise<void> {
    const coordinates = {
        left: adGemCenter.left,
        top: adGemCenter.top,
    }

    await click(coordinates, 5)
}

async function assertWindowPosition(): Promise<void> {
    const params = [
        '-e',
        `tell application "System Events" to tell process "The Tower" to tell window 1 to get its { position, size }`,
    ]

    const { stdout } = await execa('/usr/bin/osascript', params)
    const matches = /^(-?\d+), (-?\d+), (\d+), (\d+)$/.exec(stdout)

    if (matches === null) {
        throw new Error(`Failed to parse window position and size`)
    }

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const left = Number.parseInt(matches[1]!)
    const top = Number.parseInt(matches[2]!)
    const width = Number.parseInt(matches[3]!)
    const height = Number.parseInt(matches[4]!)
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    assert.ok(left === 0, `Expected window.left to be 0 (was: ${left})`)
    assert.ok(top === 39, `Expected window.top to be 39 (was: ${top})`)
    assert.ok(
        width === WIDTH,
        `Expected window.width to be ${WIDTH} (was: ${width})`,
    )
    assert.ok(
        height === HEIGHT,
        `Expected window.height to be ${HEIGHT} (was: ${height})`,
    )
}

async function main(): Promise<void> {
    await activateApplication()
    await assertWindowPosition()

    while (!(await isGameOver())) {
        await clickAdGem()
        await clickFloatingGem()

        await sleep(3 * 60 * 1000)
    }
}

main().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
})
