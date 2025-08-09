import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { addBone, animate } from './model/gameModel.tsx';

import './index.css'
import App from './App.tsx'


addBone({position: {x: 0, y: 0, z: 1}})
setInterval(() => {
  animate()
}, 0.01)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
