import { DiceTray } from './diceTray'
import * as gameController from '../game/gameController';
import { EnemyView } from './enemyView';
import { LogView } from './logView';
import { TrayOverlay } from './effects';
import { PlayerView, } from './playerView';
import { EndTurnButton, RerollButton, ResetButton } from './buttons';
import { withRefreshingProps } from './common';
import { TooltipOverlay } from './tooltips';
import { MouseCatcher } from './mouseCatcher';
import { RoundChromeOverlay } from './roundChrome';

export const Game = () => 
  <div id="roundContainer"
    style={{
      position: "absolute",
      width: "100%",
    }}>
      <MouseCatcher>
        <GameDisplay />
        <TrayOverlay />
        <RoundChromeOverlay />
        <TooltipOverlay />

      </MouseCatcher>
  </div>


const GameDisplay = () => <div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  height: "100%",
  width: "100%",
  gap: 4,
}}>
  <TopBar />
  <div style={{
    display: "flex",
    gap: 10,
  }}>
    { /* left column */}
    <div style={{ width: 150 }}>
      <PlayerView />
    </div>

    { /* main container */}
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <DiceTray />
      <BottomBar />
    </div>

    { /* right column */}
    <div style={{ width: 150 }}>
      <EnemyView />
    </div>
  </div>
</div>

const BottomBar = () =>
  <div style={{
    width: "100%",
    height: 40,
    display: "flex",
    gap: 4,
  }}>
    <div>
      <ResetButton />
    </div>
    < div style={{
      flexGrow: 1,
    }}>
      <LogView />
    </div>
    <RerollButton />
    <EndTurnButton />
  </div>

const _TopBar = (p: { text: string }) =>
  <div style={{
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
  }}>
    {p.text}
  </div>

const TopBar = withRefreshingProps(
  _TopBar,
  () => ({ text: gameController.currentRoundController().getTopBarText() }),
  (p1, p2) => p1.text == p2.text
)

