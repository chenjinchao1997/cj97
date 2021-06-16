import { defineComponent, onMounted } from 'vue'
import { useObject } from '../index'

const wait = (number = 0) => new Promise((resolve, reject) => setTimeout(resolve, number))

export default defineComponent({
    name: 'App',
    setup() {
        const defaultUser = { id: 1, name: 'jack', age: 99 };
        const { value: user, loading, update } = useObject(
            defaultUser,
            {
                async update(params: { name?: string, age?: number }) {
                    await wait(1000);
                    return {
                        id: 1,
                        ...params
                    }
                }
            }
        );

        onMounted(() => {
            (window as any).tester = {
                user,
                loading,
                update,
                async test() {
                    update({ name: 'jack' })
                    update({ name: 'hu', age: 1 })
                }
            }
        })

        return {
            user,
            loading,
            update
        }
    },
    render() {
        const user = this.user;
        const { id, name, age } = user;
        return <div>id: {id} name: {name} age: {age}</div>
    }
})