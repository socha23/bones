import { PropsWithChildren } from "react"

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