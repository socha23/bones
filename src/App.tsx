import { DiceTray } from './view/diceTray'
import './App.css'
import * as gameController from './game/gameController';


const App = () => <>
      BONES
      <div style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}>
        <div style={{display: "flex", flexDirection: "column"}}>
          <button onClick={e => {gameController.currentTurnController().roll()}}>Roll'em bones!</button>
        </div>
        <DiceTray/>
      </div>
    </>

export default App
