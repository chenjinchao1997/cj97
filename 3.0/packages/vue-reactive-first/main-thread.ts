import { ref } from 'vue'

export function useMainThread() {
    const waitings = ref([] as Array<UseMainThread.WaitingUnit>);
    let started = false;
    const tryStart = async () => {
        if (started) return;
        started = true;
        while (waitings.value.length > 0) {
            const [fn, resolve, reject] = waitings.value.shift()!
            try {
                const result = await fn()
                resolve(result)
            } catch (e) {
                // reject all
                const left = [...waitings.value]
                waitings.value = []
                left.forEach(([_, _2, eachReject]) => {
                    eachReject(e)
                })
                reject(e)
            }
        }
        started = false;
    }
    return {
        waitings,
        execute<T extends UseMainThread.WaitingFunction>(fn: T) {
            return new Promise<ReturnType<T>>((resolve, reject) => {
                waitings.value.push([fn, resolve, reject])
                tryStart()
            })
        }
    }
}