import { PropsWithChildren } from 'react';

let mouseX = 0
let mouseY = 0

export function getMouseX() {
  return mouseX
}

export function getMouseY() {
  return mouseY
}

export const MouseCatcher = (p: PropsWithChildren<{}>) => {
  return <div style={{height: "100%"}} onMouseMove={e => {
    mouseX = e.clientX
    mouseY = e.clientY
  }}>
    {p.children}
  </div>
}