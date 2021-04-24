/* eslint-disable no-undef */
const EXEC_ENV = typeof window === 'undefined' ? 'node' : 'browser'

let coreNum = 1
function getCoreNum () {
    if (EXEC_ENV === 'browser') {
        return window.navigator.hardwareConcurrency
    } else {
        const os = require('os')
        return os.cpus().length
    }
}

function onconnect (e) {
    const port = e.ports[0]
    port.onmessage = (event) => {
        const args = event.data
        if (typeof args === 'string') {
            const asyncFunctionCode = args
            eval(asyncFunctionCode)
        } else if (typeof args === 'number') {
            delete $fns[args]
            port.postMessage(args)
        } else {
            const functionId = args[0]
            const taskId = args[1]
            Promise.resolve(args[2]).then(
                v => {
                    if (!$fns[functionId]) throw new Error(`method ${functionId} has been unregistered`)
                    return $fns[functionId].apply($fns[functionId], v)
                }
            ).then(
                // success handler
                // if `d` is transferable transfer zero-copy
                d => {
                    /**
                     * data[0] method id
                     * data[1] taskId
                     * data[2] result
                     */
                    port.postMessage([functionId, taskId, d, true], [d].filter(x => (
                        (x instanceof ArrayBuffer) ||
                        (x instanceof MessagePort) ||
                        (self.ImageBitmap && x instanceof ImageBitmap)
                    )))
                },
                er => {
                    port.postMessage([functionId, taskId, er, false])
                }
            )
        }
    }
}

const code = 'var $fns={};onconnect=' + onconnect + ';'
const scriptURL = URL.createObjectURL(new Blob([code]))

const registerPromises = {}
const promises = {}
let workers = []
function createWorkers (coreNum) {
    return new Array(coreNum).fill(0).map((_, index) => {
        const worker = new SharedWorker(scriptURL, {
            name: 'joroutine_shared_number' + index,
            type: 'classic',
            credentials: 'same-origin'
        })

        worker.port.onmessage = (e) => {
            const data = e.data
            if (data.length === 1) {
                registerPromises[index][data[0]](data[0])
                delete registerPromises[index][data[0]]
            } else {
                const pm = promises[data[1]]
                if (pm) {
                    if (data[3]) {
                        pm.resolve && pm.resolve(data[2])
                    } else {
                        pm.reject && pm.reject(data[2])
                    }
                    delete promises[data[1]]
                }
            }
        }

        worker.port.start()
        return worker
    })
}

let registerPromise = Promise.resolve()
function register (asyncFunctionCode, functionId) {
    // ensure chain-(un)registering of new function code
    registerPromise = registerPromise.then(
        () => Promise.all(
            workers.map(
                (worker, index) => new Promise(resolve => {
                    registerPromises[index][functionId] = resolve
                    worker.port.postMessage(asyncFunctionCode)
                })
            )
        )
    )
}

function unregister (functionId) {
    // ensure chain-registering of new function code
    registerPromise = registerPromise.then(
        () => Promise.all(
            workers.map(
                (worker, index) => new Promise(resolve => {
                    registerPromises[index][functionId] = resolve
                    worker.port.postMessage(functionId)
                })
            )
        )
    )
}

function dispatch (functionId, taskId, args) {
    return new Promise((resolve, reject) => {
        const chosen = workers[taskId % coreNum]
        promises[taskId] = {
            resolve, reject
        }
        chosen.port.postMessage([functionId, taskId, args], args.filter(x => (
            (x instanceof ArrayBuffer) ||
            (x instanceof MessagePort) ||
            (self.ImageBitmap && x instanceof ImageBitmap)
        )))
    })
}

let currentId = 0
let taskId = 0

function init () {
    coreNum = getCoreNum()
    workers = createWorkers(coreNum)
    for (let i = 0; i < coreNum; i++) {
        registerPromises[i] = {}
    }
}

init()
export default function joroutine (asyncFunction) {
    const functionId = currentId
    const asyncFunctionCode = `$fns[${functionId}]=${asyncFunction};port.postMessage([${functionId}])`
    register(asyncFunctionCode, functionId)

    const newFn = function (...args) {
        taskId += 1

        args = [].slice.call(arguments)
        return dispatch(functionId, taskId, args)
    }
    newFn.unregister = function () {
        unregister(functionId)
    }
    currentId += 1
    return newFn
}
