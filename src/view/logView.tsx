import { LogMessage } from "../model/log"
import * as colors from './colors'

export const LogView = (p: {log: LogMessage[]}) => <div style={{
    overflow: "scroll",
    height: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.LIGHT_BORDERS,
    borderRadius: 3,
    color: colors.LOG_TEXT,
}}>
    <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        fontSize: 10,
    }}>
        {p.log.map((message, idx) => <div key={"logMsg" + idx}> 
            <div id={message.id}>{message.text}</div>
        </div>)}
    </div>
</div>

