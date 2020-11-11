import Request from '@cj97/t-request';
import { ref } from '@vue/reactivity';

const Adapter = ref(Request.tRequest);

export function setAdapter (val: any): void {
    Adapter.value = val;
}
