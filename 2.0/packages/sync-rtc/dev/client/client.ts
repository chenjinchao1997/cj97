import SyncRTC from '@cj97/sync-rtc/index'

console.log(SyncRTC)

let logger
window.addEventListener('load', () => {
    logger = (window as any).logger as { log: (text) => void }
    logger.log('logger loaded')
})
