import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as trayController from './game/trayController';

import './index.css'
import App from './App.tsx'

setInterval(() => {
  trayController.update()
}, 0.01)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
