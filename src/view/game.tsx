import { useState, useEffect } from 'react';

import { DiceTray, TRAY_HEIGHT_PX, TRAY_WIDTH_PX } from './diceTray'
import * as gameController from '../game/gameController';
import { EnemyView, EnemyViewParams, getEnemyViewParams } from './enemyView';
import { LogMessage, logMessages } from '../model/log';
import { LogView } from './logView';
import { TrayOverlay } from './roundOverlay';
import { getPlayerParams, PlayerView, PlayerViewParams } from './playerView';

const UI_REFRESH_S = 0.01

interface UiState {
  rerollEnabled: boolean
  rerollsLeft: number
  endTurnEnabled: boolean
  enemyView: EnemyViewParams
  playerView: PlayerViewParams
  log: LogMessage[]
}


function getUiState(): UiState {
  const roundController = gameController.currentRoundController()
  return {
    rerollEnabled: roundController.isRerollEnabled(),
    endTurnEnabled: roundController.isEndTurnEnabled(),
    rerollsLeft: roundController.turn.rerollsLeft,
    enemyView: getEnemyViewParams(roundController),
    playerView: getPlayerParams(roundController),
    log: logMessages(),
  }
}

export const Game = () => {
  const [uiState, setUiState] = useState<UiState>(getUiState())

  useEffect(() => {
    const interval = setInterval(() => {
      setUiState(getUiState())
      gameController.update()
    }, UI_REFRESH_S)
    return () => { clearInterval(interval) }
  })
  return <div id="roundContainer" style={{
    position: "absolute",
  }}>
    <div style={{
      display: "flex",
      position: "relative",
      height: "100%",
      width: "100%",
    }}>
      { /* buttons */}
      <div style={{ display: "flex", flexDirection: "column", width: 200, }}>
        <PlayerView {...uiState.playerView}/>        
        <button
          disabled={!uiState.rerollEnabled}
          onClick={e => { gameController.currentRoundController().onReroll() }}
        >Reroll ({uiState.rerollsLeft} left)</button>
        <button
          disabled={!uiState.endTurnEnabled}
          onClick={e => { gameController.currentRoundController().onEndTurn() }}
        >End turn</button>
        <div style={{ height: 100 }} />
        <button
          onClick={e => { gameController.currentRoundController().onResetTurn() }}
        >Reset</button>
        <LogView log={uiState.log} />
      </div>

      { /* main container */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: TRAY_WIDTH_PX,
      }}>
        <div id="container" style={{
          width: TRAY_WIDTH_PX,
          height: TRAY_HEIGHT_PX,
        }}>
          <DiceTray />
        </div>
      </div>

      <EnemyView {...uiState.enemyView} />
    </div>


    <TrayOverlay />

  </div>
}

