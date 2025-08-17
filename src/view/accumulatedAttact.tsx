import { useEffect, useState } from "react"
import { LogMessage } from "../model/log"
import { currentRoundController } from "../game/gameController"
import { SWORD_PATH } from "./textures"

export interface LogViewParams {
    log: LogMessage[]
}

export const LogView = (p: LogViewParams) => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 5,
    fontSize: 10,
}}>
    {p.log.map((message, idx) => <div key={"logMsg" + idx}> 
        <div>{message.text}</div>
    </div>)}
</div>

const REFRESH_MS = 20

export const Icon = (p: {path: string, size: number}) => <div style={{
    backgroundImage: `url("${p.path}")`,
    width: p.size,
    height: p.size,
    backgroundSize: p.size,
}}/>

export const AccumulatedAttack = () => {
    const [val, setVal] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setVal(currentRoundController().round.player.attack)
        }, REFRESH_MS)
        return () => {clearInterval(interval)}
    })
    return <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
    }}>
        <Icon path={SWORD_PATH} size={64}/>
        <div style={{fontSize: 60}}>{val}</div>
    </div>


}