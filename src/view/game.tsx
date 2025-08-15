import { useState, useEffect } from 'react';

import { DiceTray } from './diceTray'
import * as gameController from '../game/gameController';

const UI_REFRESH_S = 0.01

interface UiState {
  rerollEnabled: boolean
  rerollsLeft: number,
}

function getUiState(): UiState {
  const turnController = gameController.currentTurnController()
  return {
    rerollEnabled: turnController.isRerollEnabled(),
    rerollsLeft: turnController.turn.rerollsLeft,
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
      BONES
      <div style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}>
        <div style={{display: "flex", flexDirection: "column", width: 200,}}>
          <button
            disabled={!uiState.rerollEnabled} 
            onClick={e => {gameController.currentTurnController().onReroll()}}
            >Reroll ({uiState.rerollsLeft} left)</button>
        </div>
        <div style={{
            display: "flex", 
            flexDirection: "column",
            width: "100%",
            }}>
          <DiceTray/>
        </div>
      </div>
    </>
}

