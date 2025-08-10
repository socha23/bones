import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { update } from './model/gameModel.tsx';

import './index.css'
import App from './App.tsx'


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
