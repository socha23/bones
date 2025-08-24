import { currentRoundController } from '../game/gameController'
import { withRefreshingProps } from './common'

const _RerollButton = (p: { enabled: boolean, rerollsLeft: number }) => <button
  disabled={!p.enabled}
  onClick={() => { currentRoundController().onReroll() }}
>
  Reroll ({p.rerollsLeft} left)
</button>

export const RerollButton = withRefreshingProps(
  _RerollButton,
  () => ({
    enabled: currentRoundController().isRerollEnabled(),
    rerollsLeft: currentRoundController().turn.rerollsLeft,
  }),
  (p1, p2) => p1.enabled == p2.enabled && p1.rerollsLeft == p2.rerollsLeft,
)

const _EndTurnButton = (p: { enabled: boolean }) => <button
  disabled={!p.enabled}
  onClick={() => { currentRoundController().onEndTurn() }}
>End turn</button>

export const EndTurnButton = withRefreshingProps(
  _EndTurnButton,
  () => ({
    enabled: currentRoundController().isEndTurnEnabled(),
  }),
  (p1, p2) => p1.enabled == p2.enabled,
)

export const ResetButton = () => <button
  onClick={() => { currentRoundController().onResetTurn() }}
>Reset</button>

