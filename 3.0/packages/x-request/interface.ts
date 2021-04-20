/* eslint-disable no-unused-vars */
export type RequestData = string | Record<string, any> | ArrayBuffer;

export type Method = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT';

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

export interface XRequestOptions {
    url: string;

    pathVariables?: Record<string, any>;

    params?: Record<string, any>;

    data?: RequestData;

    /**
     * 设置请求的 header，header 中不能设置 Referer。
     * `content-type` 默认为 `application/json`
     */
    headers?: Record<string, any>;

    /** HTTP 请求方法 */
    method: Method;

    /**
     * responseType
     */
    responseType?: ResponseType;
}

export interface XRequestResponse<Data extends any = any> {
    cookies?: string[];

    data: Data;

    /** 开发者服务器返回的 HTTP Response Header
     *
     */
    headers: Record<string, any>;

    /** 服务器返回的 HTTP 状态码 */
    status: number;
}

export interface XRequestError {
    response?: any;
    [x: string]: any;
    [x: number]: any;
}

export interface XRequestMiddleware {
    <T extends Partial<XRequestOptions>, R extends XRequestResponse['data']>(
        options: T,
        next: XRequestMiddleware
    ): Promise<XRequestResponse<R>>;
}

export interface XRequestApi<
    T extends Partial<XRequestOptions> = XRequestOptions,
    R extends XRequestResponse['data'] = XRequestResponse['data'],
    E extends XRequestError = XRequestError
> {
    <NT extends T, NR extends R>(options: NT): Promise<NR>;
    to<NT extends T, NR extends R, NE extends E>(
        options: NT
    ): Promise<[XRequestResponse<NR>, null] | [null, NE]>;
}

export interface XRequest {
    <
        T extends Partial<XRequestOptions> = XRequestOptions,
        R extends XRequestResponse['data'] = XRequestResponse['data']
    >(
        options: T
    ): Promise<XRequestResponse<R>>;
    to<
        T extends Partial<XRequestOptions> = XRequestOptions,
        R extends XRequestResponse['data'] = XRequestResponse['data'],
        E extends XRequestError = XRequestError
    >(
        options: T
    ): Promise<[XRequestResponse<R>, null] | [null, E]>;
    api<
        T extends Partial<XRequestOptions> = XRequestOptions,
        R extends XRequestResponse['data'] = XRequestResponse['data'],
        E extends XRequestError = XRequestError
    >(
        options: Partial<XRequestOptions>
    ): XRequestApi<T, XRequestResponse<R>, E>;
    create(middleware: XRequestMiddleware): XRequest;
}
