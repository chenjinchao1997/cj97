import { ResponseType, RequestBody, TRequest, TRequestApi, TRequestError, TRequestMiddleware, TRequestOptions, TRequestResponse } from './interface'
import { buildUrl, isObject } from './utils'
export * from './interface'

function transfromData<D extends any> (data: D, headers: Headers) {
    if (
        data instanceof FormData ||
        data instanceof ArrayBuffer ||
        data instanceof Buffer ||
        data instanceof Blob ||
        data instanceof ReadableStream
    ) {
        return data
    }
    if (data instanceof URLSearchParams) {
        headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
        return data
    }
    if (isObject(data) || headers.get('Content-Type')?.includes('application/json')) {
        headers.set('Content-Type', 'application/json;charset=utf-8')
        return JSON.stringify(data)
    }
    return data as BodyInit
}

function factory (middles: TRequestMiddleware[]): TRequest {
    const basic = async function <
        T extends RequestBody = RequestBody,
        R extends TRequestResponse['data'] = TRequestResponse['data']
    > (
        options: TRequestOptions<T>
    ): Promise<TRequestResponse<R>> {
        type Options = Omit<TRequestOptions, 'init'> & { init: RequestInit }
        const { url, data, params, pathVariables, method, headers, init, responseType } = options as Options

        const _url = buildUrl(url, params || {}, pathVariables || {})

        const _headers = new Headers({
            Accept: 'application/json, text/plain, */*',
            ...(['POST', 'PUT', 'PATCH'].includes(method)
                ? {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                : {}),
            ...headers
        })
        const body = data ? transfromData<T['data']>(data, _headers) : undefined

        const request = new Request(_url, {
            credentials: 'same-origin', // include, same-origin, *omit
            method, // *GET, POST, PUT, DELETE, etc.
            mode: 'same-origin', // no-cors, cors, *same-origin
            headers: _headers,
            body,
            ...init
        })

        const response = await fetch(request)

        // get headers
        const respHeaders: Record<string, string> = {}
        Array.from(response.headers.entries()).forEach((cur) => { respHeaders[cur[0]] = cur[1] })

        // transform responseType
        let _responseType: ResponseType
        if (responseType) {
            _responseType = responseType
        } else {
            _responseType = 'stream'
            const contentType = response.headers.get('Content-Type')
            if (contentType?.includes('application/json')) {
                _responseType = 'json'
            } else if (contentType?.includes('text')) {
                _responseType = 'text'
            }
        }

        // get data
        let respData: R
        switch (_responseType) {
        case 'json':
            respData = await response.json() as R; break
        case 'text':
            respData = await response.text() as R; break
        case 'arraybuffer':
            respData = await response.arrayBuffer() as R; break
        case 'blob':
            respData = await response.blob() as R; break
        case 'stream':
        default:
            respData = (response.body || response) as R
        }

        const resp: TRequestResponse<R> = {
            headers: respHeaders,
            data: respData,
            status: response.status,
            cookies: document?.cookie.split(';').map(each => each.trim())
        } as TRequestResponse<R>
        return resp
    }

    const request: TRequest = async function <
        T extends RequestBody = RequestBody,
        R extends TRequestResponse['data'] = TRequestResponse['data']
    > (
        options: TRequestOptions<T>
    ): Promise<TRequestResponse<R>> {
        function dispatch (i: number): (options: TRequestOptions<T>) => Promise<TRequestResponse<R>> {
            const mid = middles[i]

            if (i === middles.length) {
                return (options) => basic(options)
            } else {
                return (options) => mid(options, dispatch(i + 1))
            }
        }
        const resp = await dispatch(0)(options)
        return resp as TRequestResponse<R>
    }

    const to: TRequest['to'] = async function <
        T extends RequestBody = RequestBody,
        R extends TRequestResponse['data'] = TRequestResponse['data'],
        E extends Record<string | number | symbol, any> = {}
    > (
        options: TRequestOptions<T>
    ) {
        try {
            const data = await request<T, R>(options)
            return [data, null]
        } catch (e) {
            const error: TRequestError<E> = {
                error: e
            } as TRequestError<E>
            return [null, error]
        }
    }
    request.to = to

    request.api = function <
        T extends RequestBody = RequestBody,
        R extends TRequestResponse['data'] = TRequestResponse['data'],
        E extends Record<string | number | symbol, any> = {}
    > (
        common: Partial<TRequestOptions<T>>
    ): TRequestApi<T, R, E> {
        const api: TRequestApi<T, R, E> = async function <NT extends T, NR extends R> (options: Partial<TRequestOptions<NT>>) {
            const data = await request<NT, NR>({
                ...common,
                ...options
            } as TRequestOptions<NT>)
            return data
        }
        const to: TRequestApi<T, R, E>['to'] = async function <NT extends T, NR extends R, NE extends E> (
            options: Partial<TRequestOptions<NT>>
        ) {
            try {
                const data = await api<NT, NR>({
                    ...common,
                    ...options
                } as Partial<TRequestOptions<NT>>)
                return [data, null]
            } catch (e) {
                const error: TRequestError<NE> = {
                    error: e
                } as TRequestError<NE>
                return [null, error]
            }
        }
        api.to = to
        return api
    }

    request.create = function (
        middlewares: TRequestMiddleware | TRequestMiddleware[]
    ): TRequest {
        return factory([...middles].concat(middlewares))
    }

    return request
}

export default factory([])
