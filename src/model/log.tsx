export interface LogMessage {
    text: string
}

const _logMessages: LogMessage[] = []

export function log(text: string) {
    _logMessages.push({text})
}

export function logMessages(): LogMessage[]  {
    return _logMessages
}