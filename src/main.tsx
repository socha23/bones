import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as gameController from './game/gameController';
import {Game} from './view/game.tsx'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Game />
  </StrictMode>,
)
