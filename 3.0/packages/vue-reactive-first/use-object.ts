import { reactive, ref, toRaw, watch } from 'vue'
import { useMainThread } from './main-thread'
import { UseObject } from './UseObject'

export const useObject: UseObject.UseObjectFunction = 
function<O extends Object, UR> (
    value: O,
    options: UseObject.ObjectOptions<O, UR>
): UseObject.ObjectReturn<O, UR> {
    const _value = reactive(value)
    const loading = ref(false)
    const { update: u } = options

    const { waitings, execute } = useMainThread()

    // 当 waitings 内有待执行函数时 loading = true
    watch(waitings, (v) => {
        loading.value = v.length > 0
    })

    const update: UseObject.UpdateFunction<Partial<O>, UR> = async function(params: Partial<O>): Promise<UR> {
        const backup = Object.assign({}, toRaw(_value))
        const mod = Object.assign({}, backup, params)
        Object.assign(_value, mod)
        const recover: () => void = () => {
            Object.assign(_value, backup)
        }
        return execute(async () => {
            try {
                const result = await u(params)
                return result
            } catch (e) {
                recover()
                throw e
            }
        })
    }
    return {
        value: _value,
        loading,
        update
    }
}
