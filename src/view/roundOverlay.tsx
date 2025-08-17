import { TRAY_HEIGHT_PX, TRAY_WIDTH_PX } from './diceTray'
import { useEffect, useState } from 'react';
import {gsap } from 'gsap'

export interface EffectParams {
    id?: string
    text?: string 
    iconPath?: string,
    left?: number,
    top?: number,
}

let idAutoinc = 1

export class Effect {
  id: string
  alive: boolean = true
  text?: string
  iconPath?: string
  left: number
  top: number
  
  constructor(p: EffectParams) {
    this.id = p.id || "effect" + idAutoinc++
    this.text = p.text || ""
    this.iconPath = p.iconPath
    this.left = p.left || 0
    this.top = p.top || 0
  }

  get selector() {
    return "#" + this.id
  }

  animate(vars: gsap.TweenVars, callback: () => void = () => {}) {
        gsap.timeline()
            .add(gsap.to(this.selector, vars))
            .call(callback)

  }

  animateAndRemove(vars: gsap.TweenVars, callback: () => void = () => {}) {
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

const ICON_SIZE = 64

const EffectView = (p: {effect: Effect}) => <div id={p.effect.id} style={{
  position: "absolute",
  left: p.effect.left,
  top: p.effect.top,

  display: "flex",
  alignItems: "center",
  gap: 10,
}}>
  <div style={{
    fontSize: 96
  }}>{p.effect.text}</div>
  {p.effect.iconPath != undefined && <div style={{
    width: ICON_SIZE,
    height: ICON_SIZE,
    backgroundImage: `url("${p.effect.iconPath}")`,
    backgroundSize: ICON_SIZE,
  }}/>}
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
        effects.map((e, i) => <EffectView key={i} effect={e}/>)
      }
    </div>
}