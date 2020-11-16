import { ref } from 'vue';

export function useFetch<Data = unknown, Error = unknown>(adapter: (...args: any) => Promise<Data>) {
    const loading = ref(false);
    const error = ref<Error | undefined>(undefined);
    const data = ref<Data | undefined>(undefined);

    return {
        loading,
        error,
        data
    };
}
