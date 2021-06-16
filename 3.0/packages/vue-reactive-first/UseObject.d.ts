import { Ref, UnwrapNestedRefs } from '@vue/reactivity/dist/reactivity'

declare module UseObject {
    type UpdateFunction<T, R extends any> = (params: T) => Promise<R>
    type ObjectOptions<O extends Object, UpdateFunctionReturn> = {
        update: UpdateFunction<Partial<O>, UpdateFunctionReturn>
    }
    type ObjectReturn<O extends Object, UpdateFunctionReturn> = {
        value: UnwrapNestedRefs<O>
        loading: Ref<boolean>
        update: UpdateFunction<Partial<O>, UpdateFunctionReturn>
    }
    type UseObjectFunction = <O extends Object, UpdateFunctionReturn>(value: O, options: ObjectOptions<O, UpdateFunctionReturn>) => ObjectReturn<O, UpdateFunctionReturn>
}
