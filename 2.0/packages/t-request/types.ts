export type TRequestRequestData = string | Record<string, any> | ArrayBuffer | Blob | FormData;

export type TRequestResponseData = string | Record<string, any> | ArrayBuffer | Blob | FormData | ReadableStream<Uint8Array>;

export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT';

export type contentType =
    | 'json'
    | 'xml'
    | 'form-data'
    | 'form';

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

export type TRequestOption = {
    url: string;

    pathVariables?: Record<string, number | string>;

    params?: Record<string, string | number>;

    data?: TRequestRequestData;

    headers?: Record<string, string>;

    method: Method;

    responseType?: ResponseType;

    contentType?: contentType;
}

export type TRequestResponse<D extends TRequestResponseData> = {
    readonly data: D,
    readonly headers: Headers;
    readonly status: number;
    // readonly ok: boolean;
    // readonly redirected: boolean;
    // readonly statusText: string;
    // readonly trailer: Promise<Headers>;
    // readonly type: ResponseType;
    readonly url: string;
};

export type TRequestError = {
    options?: TRequestOption,
    errMsg?: string,
    status?: number,
    [x: string]: any,
    [x: number]: any
};

export interface TRequest<T extends TRequestOption = TRequestOption, R extends TRequestResponseData = TRequestResponseData> {
    (options: T): Promise<[TRequestResponse<R>, undefined] | [undefined, TRequestError]>;
}

export interface createTRequest<T extends TRequestOption = TRequestOption, R extends TRequestResponseData = TRequestResponseData> {
    (basicOptions: Partial<T>): TRequest<T, R>;
}

export interface TRequestFactory {
    (options: {
        baseUrl?: string,
        headers?: Record<string, string>,
        adapter?: TRequest,
        // onUploadProgress?: (event: ProgressEvent) => void,
        // onDownloadProgress?: (event: ProgressEvent) => void
    }): createTRequest;
}
