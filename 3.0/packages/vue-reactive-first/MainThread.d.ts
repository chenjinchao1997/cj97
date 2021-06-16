declare module UseMainThread {
    type PromiseResolve = (value: any) => void
    type PromiseReject = (reason?: any) => void
    type WaitingFunction = (...args: any) => any
    type WaitingUnit = [WaitingFunction, PromiseResolve, PromiseReject]
}
  