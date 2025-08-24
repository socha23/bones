import { TRAY_HEIGHT_PX } from './diceTray'
import { ReactNode, useEffect, useState } from 'react';
import { gsap } from 'gsap'
import { Position } from './domElements';
import { Icon } from './common';
import { SWORD_PATH } from './textures';

export interface EffectParams {
  id?: string
  body: ReactNode
  left?: number,
  top?: number,
}

let idAutoinc = 1

export class Effect {
  id: string
  display: boolean
  alive: boolean = true
  body: ReactNode
  left: number
  top: number

  constructor(p: EffectParams) {
    this.id = p.id || "effect" + idAutoinc++
    this.body = p.body
    this.left = p.left || 0
    this.top = p.top || 0
    this.display = false
  }

  show() {
    this.display = true
  }

  get selector() {
    return "#" + this.id
  }

  animateAndRemove(tl: gsap.core.Timeline, vars: gsap.TweenVars) {
    tl
      .call(() => this.show())
      .add(gsap.to(this, vars))
      .call(() => {
        this.alive = false
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
      effects.filter(e => e.display).map((e, i) => <EffectView key={i} effect={e} />)
    }
  </div>
}

export function spawnIncrease(position: Position, text: string): gsap.core.Timeline {
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
  const tl = gsap.timeline()
  e.animateAndRemove(tl, {top: toTop, left: toLeft , duration: 0.5})
  return tl
}

export function spawnDecrease(position: Position, text: string): gsap.core.Timeline {
  const DISTANCE = 60
  const SPREAD = 1
  const body = <div style={{
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff0000",
    WebkitTextStroke: "1px #888",
    textShadow: "0 0 5px #000",
  }}>{text}</div>

  const e = addEffect({ top: position.top, left: position.left, body: body })
  const toTop = e.top + DISTANCE
  const toLeft = e.left + (Math.random() * 2 - 1) * SPREAD * DISTANCE
  const tl = gsap.timeline()
  e.animateAndRemove(tl, {top: toTop, left: toLeft , duration: 0.5})
  return tl
}


export function animateAttackEffect(position: Position, target: Position): gsap.core.Timeline {
    const body = <Icon size={48} path={SWORD_PATH}/>
    const effect = addEffect({  top: position.top, left: position.left, body: body })
    const tl = gsap.timeline()
    effect.animateAndRemove(tl, { top: target.top, left: target.left , duration: 0.5})
    return tl
}