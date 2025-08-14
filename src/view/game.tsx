import { useState, useEffect } from 'react';

import { DiceTray } from './diceTray'
import * as gameController from '../game/gameController';

const UI_REFRESH_S = 0.01

interface UiState {
  rollEnabled: boolean
}

function getUiState(): UiState {
  const turnController = gameController.currentTurnController()
  return {
    rollEnabled: turnController.isRollEnabled(),
  }
}

export const Game = () => {
  const [uiState, setUiState] = useState<UiState>({
    rollEnabled: false,
  })

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
        <div style={{display: "flex", flexDirection: "column"}}>
          <button
            disabled={!uiState.rollEnabled} 
            onClick={e => {gameController.currentTurnController().roll()}}
            >Roll'em bones!</button>
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

