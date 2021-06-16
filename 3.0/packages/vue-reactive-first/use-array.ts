import { ref, watch } from 'vue'
import { useMainThread } from './main-thread'
import { UseArray } from './UseArray'
import { Ref } from '@vue/reactivity/dist/reactivity'

export const useArray: UseArray.UseArrayFunction = 
function<O extends object, C, R, U, D> (
    options: UseArray.ArrayOptions<O, C, R, U, D>
): UseArray.ArrayReturn<O, C, R, U, D> {
    const { add: c, retrieve: r, update: u, remove: d, addFirst: cf, updateFirst: uf, removeFirst: df } = options

    const data = ref([]) as Ref<Array<O>>
    const loading = ref(false)
    const { waitings, execute } = useMainThread()

    // 当 waitings 内有待执行函数时 loading = true
    watch(waitings, (v) => {
        loading.value = v.length > 0
    })

    const add: UseArray.ArrayAddFunction<C, O> = async function(params: C): Promise<O> {
        let recover: () => void
        let tmp: O | undefined = undefined
        if (cf) {
            tmp = cf(params)
            data.value.push(tmp)
            tmp = data.value[data.value.length - 1]
            recover = () => {
                const i = data.value.findIndex(v => v === tmp)
                data.value.splice(i, 1)
            }
        }
        return execute(async () => {
            try {
                const result = await c(params)
                if (tmp) {
                    const i = data.value.findIndex(v => v === tmp)
                    data.value.splice(i, 1, result)
                } else {
                    data.value.push(result)
                }
                return result
            } catch (e) {
                recover && recover()
                throw e
            }
        })
    }

    const retrieve: UseArray.ArrayRetrieveFunction<R, O> = async function(params: R): Promise<Array<O>> {
        return execute(async () => {
            const result = await r(params)
            data.value = result
            return result
        })
    }

    const update: UseArray.ArrayUpdateFunction<U, O> = async function(origin: O, params: U): Promise<O> {
        let recover: () => void
        let mod: O | undefined
        if (uf) {
            mod = uf(origin, params)
            const i = data.value.findIndex(v => v === origin)
            if (i < 0) throw new Error('can not find')
            data.value.splice(i, 1, mod)
            // proxy 转化后对象已经不一致
            mod = data.value[i]
            recover = () => {
                const j = data.value.findIndex(v => v === mod)
                if (j < 0) throw new Error('can not find')
                data.value.splice(j, 1, origin)
            }
        }
        return execute(async () => {
            try {
                const result = await u(origin, params)
                if (mod) {
                    const i = data.value.findIndex(v => v === mod)
                    if (i < 0) throw new Error('can not find')
                    data.value.splice(i, 1, result)
                } else {
                    const i = data.value.findIndex(v => v === origin)
                    if (i < 0) throw new Error('can not find')
                    data.value.splice(i, 1, result)
                }
                return result
            } catch (e) {
                recover && recover()
                throw e
            }
        })
    }

    const remove: UseArray.ArrayRemoveFunction<D, O> = async function(origin: O, params?: D): Promise<void> {
        let backup: O | undefined
        let i: number = 0
        if (df) {
            // const backup = df(origin, params)
            const backup = origin
            i = data.value.findIndex(v => v === backup)
            data.value.splice(i, 1)
        }
        return execute(async () => {
            try {
                await d(origin, params)
            } catch (e) {
                if (df && backup) {
                    data.value.splice(i, 0, backup)
                }
                throw e
            }
        })
    }

    return {
        data,
        loading,
        add,
        retrieve,
        update,
        remove
    }
}
