import { PluginFunction } from 'vue'
import { DirectiveFunction, DirectiveOptions } from 'vue/types/options'

function genDirectiveFunction (event: string): DirectiveFunction {
    return function (el, binding, vnode, oldVnode) {
        const { value } = binding
        if (value instanceof Function) {
            value(event, el, binding, vnode, oldVnode)
        }
        if (vnode.componentInstance) {
            vnode.componentInstance.$emit(`directive:${event}`, el, binding, vnode, oldVnode)
        }
    }
}

export type EmitDirectiveEvent = (name: keyof DirectiveOptions, ...others: Parameters<DirectiveFunction>) => void;

export const LifeCycle: DirectiveOptions = {
    bind: genDirectiveFunction('bind'),
    inserted: genDirectiveFunction('inserted'),
    update: genDirectiveFunction('update'),
    componentUpdated: genDirectiveFunction('componentUpdated'),
    unbind: genDirectiveFunction('unbind')
}

export default class VueObserveVisibilityPlugin {
    static install: PluginFunction<never> = function (vue) {
        vue.directive('life-cycle', LifeCycle)
    }
}
