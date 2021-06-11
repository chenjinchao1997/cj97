let diff = 0

export async function snow (): Promise<number> {
    if (diff) {
        return Date.now() + diff
    }
    const xhr = new XMLHttpRequest()
    const start = Date.now()
    return new Promise<number>((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const serverDate = +new Date(
                    xhr.getResponseHeader('date') || Date.now()
                )
                const end = Date.now()
                diff = serverDate + (end - start) / 2 - end
                if (diff < 1000) diff = 0
                resolve(end + diff)
            }
        }
        xhr.open('HEAD', '', false)
        xhr.send(null)
    })
}

export function syncsnow (): number {
    if (diff) {
        return Date.now() + diff
    } else {
        console.warn('did not cache server time')
        snow()
        return Date.now()
    }
}
