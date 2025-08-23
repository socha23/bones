export interface LogMessage {
    text: string
    id: string
}

const _logMessages: LogMessage[] = []

let autoinc = 0

export function resetLog() {
    _logMessages.length = 0
}

export function log(text: string) {
    const id = "logMsg" + autoinc++
    _logMessages.push({text, id: id})
    setTimeout(() => {
        document.getElementById(id)?.scrollIntoView()
    }, 50)
}

export function logMessages(): LogMessage[]  {
    return _logMessages
}