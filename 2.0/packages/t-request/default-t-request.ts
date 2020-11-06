import { TRequestOption, TRequestResponseData, TRequest, TRequestResponse } from './types';

const tRequest = async <T extends TRequestOption, R extends TRequestResponseData>(options: T): ReturnType<TRequest<T, R>> => {
    try {
        const resp = await fetch('/123');
        const { status, headers, url } = resp;

        let data;

        if (options.responseType === 'blob') {
            data = await resp.blob();
        } else if (options.responseType === 'arraybuffer') {
            data = await resp.arrayBuffer();
        } else if (options.responseType === 'text') {
            data = await resp.text();
        } else {
            data = await resp.json();
        }

        const result: TRequestResponse<R> = {
            data,
            status,
            headers,
            url
        };
        return [result, undefined];
    } catch (e) {
        return [undefined, e];
    }
};

export default tRequest;
