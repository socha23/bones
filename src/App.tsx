import { DiceTray } from './view/diceTray'
import { addBone, onRoll } from './model/gameModel'
import './App.css'


const App = () => <>
      BONES
      <div style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}>
        <div style={{display: "flex", flexDirection: "column"}}>
          <button onClick={e => {addBone({})}}>Add bone</button>
          <button onClick={e => {onRoll()}}>Roll'em bones!</button>
        </div>
        <DiceTray/>
      </div>
    </>

export default App
