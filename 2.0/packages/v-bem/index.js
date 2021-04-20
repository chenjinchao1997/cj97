const bem = (scope) => {
    return (el, binding, vnode, oldVnode) => {
        const { modifiers, arg, value } = binding
    }
}

export default function install (vue, prefix) {
    vue.directive('bem', bem(prefix))
}
