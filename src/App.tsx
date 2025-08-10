import { DiceTray } from './view/DiceTray'
import { addBone } from './model/gameModel'
import './App.css'


const App = () => <>
      BONES
      <div style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}>
        <div style={{display: "flex", flexDirection: "column"}}>
          <button onClick={e => {addBone({})}}>Roll!</button>
        </div>
        <DiceTray/>
      </div>
    </>

export default App
