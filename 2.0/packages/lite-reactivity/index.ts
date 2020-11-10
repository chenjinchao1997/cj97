/* eslint-disable accessor-pairs */
/* eslint-disable no-redeclare */
/**
 * lite-reactive
 * 基于Vue2 轻量化的 vue 响应式数据系统
 * 参考Vue3 composition-api 提供以下基础api：
 * ref 接受一个参数值并返回一个响应式且可改变的 ref 对象。
 * reactive 接收一个普通对象然后返回该普通对象的响应式代理。等同于 2.x 的 Vue.observable()
 * watchEffect 立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。
 * watch 完全等效于 2.x this.$watch （以及 watch 中相应的选项）。watch 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行的，也就是说仅在侦听的源变更时才执行回调。
 * computed 传入一个 getter 函数，返回一个 ref 对象。或者传入一个拥有 get 和 set 函数的对象，创建一个可手动修改的计算状态。
 */

import Vue from 'vue';

const emptyVM = new Vue();

const _watch = emptyVM.$watch.bind(emptyVM);

export const reactive = Vue.observable;

type Ref<T> = {
    value: T
};

export function ref<T = any> (value: T): Ref<T> {
    if ((value as any).__v_isRef === true) return value as unknown as Ref<T>;
    const result = reactive({
        value
    });
    (result as any).__v_isRef = true;
    return result;
}

export const watch = _watch;

export function watchEffect (fn: Parameters<typeof _watch>[0]): ReturnType<typeof _watch> {
    return _watch(fn, () => undefined);
}

export type Getter<T = any> = () => T;
export type Setter<T = any> = (val: T) => void;
export type ComputedOptions<T> = {
    get: Getter<T>,
    set: Setter<T>,
};
const isComputedOptions = <T = any>(options: any): options is ComputedOptions<T> => {
    return typeof options === 'object' && options.get && options.set;
};

export function computed<T = any>(getter: Getter<T>): Readonly<Ref<Readonly<T>>>;
export function computed<T = any>(options: ComputedOptions<T>): Ref<T>;
export function computed<T = any> (options: ComputedOptions<T> | Getter<T>): Ref<T> | Readonly<Ref<Readonly<T>>> {
    let result: Ref<T>;
    if (typeof options === 'function') {
        result = ref<T>(options());
        _watch(options, (val: T) => {
            result.value = val;
        });

        const descriptor = Object.getOwnPropertyDescriptor(result, 'value');
        Object.defineProperty(result, 'value', {
            ...descriptor,
            set () {
                throw new Error('computed value is not assignable');
            }
        });
        return result;
    } else if (isComputedOptions(options)) {
        result = ref<T>(options.get());
        _watch(options.get, (val: T) => {
            result.value = val;
        });

        const descriptor = Object.getOwnPropertyDescriptor(result, 'value');
        Object.defineProperty(result, 'value', {
            ...descriptor,
            set (val: T) {
                options.set(val);
                descriptor && descriptor.set && descriptor.set(val);
            }
        });
        return result;
    }
    throw new Error('parameters not valid');
}
