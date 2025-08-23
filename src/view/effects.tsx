import { TRAY_HEIGHT_PX } from './diceTray'
import { ReactNode, useEffect, useState } from 'react';
import { gsap } from 'gsap'
import { Position } from './domElements';

export interface EffectParams {
  id?: string
  body: ReactNode
  left?: number,
  top?: number,
}

let idAutoinc = 1

export class Effect {
  id: string
  alive: boolean = true
  body: ReactNode
  left: number
  top: number

  constructor(p: EffectParams) {
    this.id = p.id || "effect" + idAutoinc++
    this.body = p.body
    this.left = p.left || 0
    this.top = p.top || 0
  }

  get selector() {
    return "#" + this.id
  }

  animate(vars: gsap.TweenVars, callback: () => void = () => { }) {
    gsap.timeline()
      .add(gsap.to(this, vars))
      .call(callback)
  }

  animateAndRemove(vars: gsap.TweenVars, callback: () => void = () => { }) {
    this.animate(vars, () => {
      this.alive = false
      callback()
    })
  }
}


let activeEffects: Effect[] = []

export function addEffect(p: EffectParams): Effect {
  const e = new Effect(p)
  activeEffects.push(e)
  return e
}

const EffectView = (p: { effect: Effect }) => <div id={p.effect.id} style={{
  position: "absolute",
  left: p.effect.left,
  top: p.effect.top,
}}>{p.effect.body}
</div>


export const TrayOverlay = () => {

  const REFRESH_INTERVAL_MS = 10

  const [effects, setEffects] = useState<Effect[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      activeEffects = activeEffects.filter(e => e.alive)
      setEffects(activeEffects)
    }, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  })

  return <div
    id="overlay"
    style={{
      position: "absolute",
      top: 0,
      width: "100%",
      height: TRAY_HEIGHT_PX,
      pointerEvents: "none",
      zIndex: 10,
    }}>
    {
      effects.map((e, i) => <EffectView key={i} effect={e} />)
    }
  </div>
}


export function spawnIncrease(position: Position, text: string) {
  const DISTANCE = 60
  const SPREAD = 1
  const body = <div style={{
    fontSize: 20,
    fontWeight: "bold",
    color: "#00ff00",
    WebkitTextStroke: "1px #888",
    textShadow: "0 0 5px #000",
  }}>{text}</div>

  const e = addEffect({ top: position.top, left: position.left, body: body })
  const toTop = e.top - DISTANCE
  const toLeft = e.left + (Math.random() * 2 - 1) * SPREAD * DISTANCE
  e.animateAndRemove({ top: toTop, left: toLeft , duration: 0.5})
}