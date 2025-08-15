import { useState, useEffect } from 'react';

import { DiceTray, TRAY_HEIGHT_PX, TRAY_WIDTH_PX } from './diceTray'
import * as gameController from '../game/gameController';
import { getRoundOverlayParams, RoundOverlay, RoundOverlayParams } from './roundOverlay';

const UI_REFRESH_S = 0.01

interface UiState {
  rerollEnabled: boolean
  rerollsLeft: number
  endTurnEnabled: boolean
  roundOverlay: RoundOverlayParams
} 
 

function getUiState(): UiState {
  const roundController = gameController.currentRoundController()
  return {
    rerollEnabled: roundController.isRerollEnabled(),
    endTurnEnabled: roundController.isEndTurnEnabled(),
    rerollsLeft: roundController.turn.rerollsLeft,
    roundOverlay: getRoundOverlayParams(roundController)
  }
}

export const Game = () => {
  const [uiState, setUiState] = useState<UiState>(getUiState())

  useEffect(() => {
    const interval = setInterval(() => {
      setUiState(getUiState())
      gameController.update()
    }, UI_REFRESH_S )
    return () => {clearInterval(interval)}
  })
  return <>
      <div style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}>
        { /* buttons */ }
        <div style={{display: "flex", flexDirection: "column", width: 200,}}>
          <button
            disabled={!uiState.rerollEnabled} 
            onClick={e => {gameController.currentRoundController().onReroll()}}
            >Reroll ({uiState.rerollsLeft} left)</button>
          <button
            disabled={!uiState.endTurnEnabled} 
            onClick={e => {gameController.currentRoundController().onEndTurn()}}
            >End turn</button>
            <div style={{height: 100}}/>
          <button
            onClick={e => {gameController.currentRoundController().onResetTurn()}}
            >Reset</button>
        </div>

        { /* main container */ }
        <div style={{
            display: "flex", 
            flexDirection: "column",
            width: "100%",
            }}>
              <div id="container" style={{
                width: TRAY_WIDTH_PX,
                height: TRAY_HEIGHT_PX,
              }}>
                <DiceTray/>
                <RoundOverlay {...uiState.roundOverlay}/>
              </div>
        </div>
      </div>
    </>
}

