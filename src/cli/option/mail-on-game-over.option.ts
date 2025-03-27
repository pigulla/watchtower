import { Option } from '@commander-js/extra-typings'

export const mailOnGameOver = new Option(
    '-m, --mail-on-game-over',
    'send notification email when the game is over',
).default(false)
