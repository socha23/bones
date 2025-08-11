import { DiceTray } from './view/diceTray'
import './App.css'
import { addBone, roll } from './game/trayController'

const App = () => <>
      BONES
      <div style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}>
        <div style={{display: "flex", flexDirection: "column"}}>
          <button onClick={e => {addBone({})}}>Add bone</button>
          <button onClick={e => {roll()}}>Roll'em bones!</button>
        </div>
        <DiceTray/>
      </div>
    </>

export default App
