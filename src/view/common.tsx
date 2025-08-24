import { PropsWithChildren, useEffect, useState } from "react"
import * as colors from './colors'
import { registerTickListener, unregisterTickListener } from "./tick"

export const Icon = (p: {size: number, path: string}) => <div style={{
    width: p.size,
    height: p.size,
    backgroundImage: `url("${p.path}")`,
    backgroundSize: p.size,
  }}/>

  let domIdAutoinc = 0
  
  export const Stat = (p: PropsWithChildren<{iconPath: string, domId?: string, size?: number}>) => {
    const domId = p.domId || "statValue" + domIdAutoinc++
    const size = p.size || 48
    return <div style={{
      display: "flex",
      alignItems: "center",
      gap: 4,
    }}>
      <Icon size={size * 0.75} path={p.iconPath}/>
      <div 
        id={domId}
        style={{
        fontSize: size,
      }}>{p.children}</div>
    </div>
    }

    export const HpBar = (p: {id: string, hp: number, maxHp: number, reverse: boolean}) => {
      const commonTextStyle = {
        fontSize: 12,
        width: 100,
        padding: 2,
      }

      const first = p.reverse ? p.maxHp : p.hp
      const second = p.reverse ? p.hp : p.maxHp

      return <div id={p.id} style={{
        width: "100%",
        height: 20,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.LIGHT_BORDERS,
        position: "relative",
      }}>
        <div style={{
          display: "flex",
          flexDirection: p.reverse ? "row-reverse" : "row"
        }}>
          <div style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            overflow: "hidden",
            verticalAlign: "center",
            color: colors.HP_BAR_TEXT_LOST,
            direction: p.reverse ? "rtl" : "ltr", 
          }}>
            <div style={commonTextStyle}>{first} / {second}</div>
            
          </div>
          <div style={{
            position: "absolute",
            height: "100%",
            width: (100 * p.hp / p.maxHp) + "%",
            backgroundColor: colors.HP_BAR,
            color: colors.HP_BAR_TEXT,
            overflow: "hidden",
            direction: p.reverse ? "rtl" : "ltr", 
          }}>
            <div style={commonTextStyle}>{first} / {second}</div>
          </div>
        </div>
      </div> 
    }


  export function withRefreshingProps<P extends {} >(
    Component: React.ComponentType<P>,
    propsProvider: () => P,
    propsEquals: (p1: P, p2: P) => boolean = (_1, _2) => false,
    ) {

    const WrappedComponent = () => {
        const [props, setProps] = useState<P>(propsProvider())

        useEffect(() => {
            const r = registerTickListener(() => {
                const newProps = propsProvider()
                if (!propsEquals(props, newProps)) {
                    setProps(newProps)
                }
            })
            return () => {unregisterTickListener(r)}
        })        
        return <Component {...props}/>
    }
    return WrappedComponent
}