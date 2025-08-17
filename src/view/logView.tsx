import { LogMessage } from "../model/log"

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