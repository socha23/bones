import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { addBone, update } from './model/gameModel.tsx';

import './index.css'
import App from './App.tsx'


addBone({
  position: {x: 4, y: 4, z: 4},
  rotation: {
    x: Math.random() * 2 * Math.PI,
    y: Math.random() * 2 * Math.PI, 
    z: Math.random() * 2 * Math.PI,
  }
})

let lastUpdate = performance.now()
setInterval(() => {
  const now = performance.now()
  update(now - lastUpdate)
  lastUpdate = now
}, 0.01)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
