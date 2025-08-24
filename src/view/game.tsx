import { useState, useEffect } from 'react';

import { DiceTray } from './diceTray'
import * as gameController from '../game/gameController';
import { EnemyView } from './enemyView';
import { LogMessage, logMessages } from '../model/log';
import { LogView } from './logView';
import { TrayOverlay } from './effects';
import { getPlayerParams, PlayerView, PlayerViewParams } from './playerView';
import { Enemy } from '../model/enemyModel';

const UI_REFRESH_MS = 10

interface UiState {
  rerollEnabled: boolean
  rerollsLeft: number
  endTurnEnabled: boolean
  enemy: Enemy
  playerView: PlayerViewParams
  log: LogMessage[]
  topBarText: string
}


function getUiState(): UiState {
  const roundController = gameController.currentRoundController()
  return {
    rerollEnabled: roundController.isRerollEnabled(),
    endTurnEnabled: roundController.isEndTurnEnabled(),
    rerollsLeft: roundController.turn.rerollsLeft,
    enemy: roundController.round.enemy,
    playerView: getPlayerParams(roundController),
    log: logMessages(),
    topBarText: roundController.getTopBarText(),
  }
}

export const Game = () => {
  const [uiState, setUiState] = useState<UiState>(getUiState())

  useEffect(() => {
    const interval = setInterval(() => {
      setUiState(getUiState())
      gameController.update()
    }, UI_REFRESH_MS)
    return () => { clearInterval(interval) }
  })
  return <div id="roundContainer" style={{
    position: "absolute",
    width: "100%",
  }}>

    <GameDisplay uiState={uiState}/>
    <TrayOverlay />

  </div>
}

const GameDisplay = (p: {uiState: UiState}) => <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      height: "100%",
      width: "100%",
      gap: 4,
    }}>
      <TopBar uiState={p.uiState}/>
      <div style={{
        display: "flex",
        gap: 10,
      }}>
        { /* left column */}
        <div style={{width: 150}}>
          <PlayerView {...p.uiState.playerView}/>                  
        </div>

        { /* main container */}
        <div style={{display: "flex", flexDirection: "column", gap: 4}}>
          <DiceTray/>
          <BottomBar uiState={p.uiState}/>
        </div>

        { /* right column */}
        <div style={{width: 150}}>
          <EnemyView enemy={p.uiState.enemy} />
        </div>
      </div>
    </div>

const BottomBar = (p: {uiState: UiState}) =>       
      <div style={{ 
        width: "100%",
        height: 40,
        display: "flex", 
        gap: 4,
      }}>
        <div>
          <button
            onClick={() => { gameController.currentRoundController().onResetTurn() }}
          >Reset</button>
        </div>
        < div style={{
          flexGrow: 1,
        }}>
          <LogView log={p.uiState.log} />
        </div>
        <button
          disabled={!p.uiState.rerollEnabled}
          onClick={() => { gameController.currentRoundController().onReroll() }}
        >Reroll ({p.uiState.rerollsLeft} left)</button>
        <button
          disabled={!p.uiState.endTurnEnabled}
          onClick={() => { gameController.currentRoundController().onEndTurn() }}
        >End turn</button>
      </div>

const TopBar = (p: {uiState: UiState}) =>       
      <div style={{ 
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        fontSize: 16,
        fontWeight: "bold",
        padding: 8,
      }}>
        {p.uiState.topBarText}
      </div>
