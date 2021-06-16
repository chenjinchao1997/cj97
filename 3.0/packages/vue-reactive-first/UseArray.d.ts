
import { Ref } from '@vue/reactivity/dist/reactivity'

declare module UseArray {
    type AddFirst<T, R> = (params: T) => R;
    type UpdateFirst<T, R> = (origin: R, params: T) => R
    // type RemoveFirst<T, R> = (origin: R, params?: T) => R
    type ArrayAddFunction<T, R> = (params: T) => Promise<R>
    type ArrayRetrieveFunction<T, R> = (params: T) => Promise<Array<R>>
    type ArrayUpdateFunction<T, R> = (origin: R, params: T) => Promise<R>
    type ArrayRemoveFunction<T, R> = (origin: R, params?: T) => Promise<void>

    type ArrayOptions<O, C, R, U, D> = {
        addFirst?: AddFirst<C, O>
        updateFirst?: UpdateFirst<U, O>
        // removeFirst?: RemoveFirst<D, O>
        removeFirst: boolean
        add: ArrayAddFunction<C, O>
        retrieve: ArrayRetrieveFunction<R, O>
        update: ArrayUpdateFunction<U, O>
        remove: ArrayRemoveFunction<D, O>
    }
    type ArrayReturn<O, C, R, U, D> = {
        data: Ref<Array<O>>
        loading: Ref<boolean>
        add: ArrayAddFunction<C, O>
        retrieve: ArrayRetrieveFunction<R, O>
        update: ArrayUpdateFunction<U, O>
        remove: ArrayRemoveFunction<D, O>
    }
    type UseArrayFunction = <O extends object, C, R, U, D>(options: ArrayOptions<O, C, R, U, D>) => ArrayReturn<O, C, R, U, D>
}
  