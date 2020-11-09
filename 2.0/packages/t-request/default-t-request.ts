import { TRequestOption, TRequestResponseData, TRequest, TRequestResponse } from './types';
import utils from './utils';

export function replacePathVariables (
    url: string,
    variables: Record<string, number | string>
): string {
    const regex = /\/:(\w+)/;

    let newUrl = url;
    let tmpArr = regex.exec(newUrl);
    while (tmpArr !== null) {
        const key = tmpArr[1];
        if (variables[key] !== undefined && variables[key] !== null) {
            newUrl = newUrl.replace(`:${key}`, variables[key].toString());
        } else {
            throw new Error(`require path variable ${key}`);
        }
        tmpArr = regex.exec(newUrl);
    }

    return newUrl;
}

type RequestBody = string | ArrayBuffer | ArrayBufferView | Blob | FormData;

const tRequest = async <T extends TRequestOption, R extends TRequestResponseData>(options: T): ReturnType<TRequest<T, R>> => {
    const { url, params, pathVariables, data: requestData, headers: requestHeaders, method, responseType, contentType } = options;

    const contentTypeHeader = {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': undefined
    } as {[x: string]: string | undefined};
    let body: RequestBody | null | undefined;

    switch (contentType) {
    case 'form': contentTypeHeader['Content-Type'] = 'application/x-www-form-urlencoded'; break;
    // case 'form-data': contentTypeHeader['Content-Type'] = 'multipart/form-data'; break;
    case 'xml': contentTypeHeader['Content-Type'] = 'text/xml'; break;
    }
    if (utils.isFormData(requestData) ||
        utils.isArrayBuffer(requestData) ||
        utils.isBuffer(requestData) ||
        utils.isStream(requestData) ||
        utils.isFile(requestData) ||
        utils.isBlob(requestData)
    ) {
        body = requestData as FormData | ArrayBuffer | Buffer | File | Blob;
        if (utils.isFormData(requestData)) {
            delete contentTypeHeader['Content-Type']; // Let the browser set it
        }
    } else if (utils.isArrayBufferView(requestData)) {
        body = requestData.buffer;
    } else if (utils.isObject(requestData)) {
        contentTypeHeader['Content-Type'] = 'application/json;charset=utf-8';
        body = JSON.stringify(requestData);
    }

    const headers = {
        ...contentTypeHeader,
        ...requestHeaders
    };
    try {
        const query = params ? '?' + (new URLSearchParams(params)).toString() : '';
        const resp = await fetch(replacePathVariables(url, pathVariables || {}) + query, {
            method,
            headers,
            body,
            credentials: 'same-origin'
        });
        const { ok, status, headers: responseHeaders } = resp;

        if (!ok) {
            return [undefined, {
                ...resp,
                options
            }];
        }

        let data;
        if (responseType) {
            if (responseType === 'blob') {
                data = await resp.blob();
            } else if (responseType === 'arraybuffer') {
                data = await resp.arrayBuffer();
            } else if (responseType === 'text') {
                data = await resp.text();
            } else {
                data = await resp.json();
            }
        } else {
            data = resp.body;
        }

        const result: TRequestResponse<R> = {
            data,
            status,
            headers: responseHeaders,
            url
        };
        return [result, undefined];
    } catch (e) {
        return [undefined, {
            message: e.message,
            error: e,
            options
        }];
    }
};

export default tRequest;
