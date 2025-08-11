import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as gameController from './game/gameController';

import './index.css'
import App from './App.tsx'

setInterval(() => {
  gameController.update()
}, 0.01)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
