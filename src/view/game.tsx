import { useState, useEffect } from 'react';

import { Bone } from '../model/gameModel';
import { DiceTray } from './diceTray'
import { DiceHand } from './diceHand'
import * as gameController from '../game/gameController';

const UI_REFRESH_S = 0.01

interface UiState {
  rollEnabled: boolean
    bonesHeld: Bone[],
    bonesKept: Bone[],
    onKeptClick: (b: Bone) => void,
}

function getUiState(): UiState {
  const turnController = gameController.currentTurnController()
  const turn = turnController.turn
  return {
    rollEnabled: turnController.isRollEnabled(),
    bonesHeld: turn.held,
    bonesKept: turn.keep,
    onKeptClick: (b) => {turnController.onBoneInKeptClick(b)},
  }
}

export const Game = () => {
  const [uiState, setUiState] = useState<UiState>({
    rollEnabled: false,
    bonesHeld: [],
    bonesKept: [],
    onKeptClick: (b) => {}
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
          <DiceHand 
            bonesHeld={uiState.bonesHeld} 
            bonesKept={uiState.bonesKept}
            onKeptClick={uiState.onKeptClick}/>

        </div>
      </div>
    </>
}

