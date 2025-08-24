import { LogMessage, logMessages } from "../model/log"
import * as colors from './colors'
import { withRefreshingProps } from "./common"

const _LogView = (p: {log: LogMessage[]}) => {
    return <div style={{
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
}

export const LogView = withRefreshingProps<{log: LogMessage[]}>(
    _LogView,
    () => ({log: logMessages()}),
    (p1, p2) => p1.log.length == p2.log.length,
)

