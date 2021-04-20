// example:
// type TestParams = {
//     params: {
//         abc: string
//     }
// }
// type TestRe = {
//     abc: number
// }
// type TestError = {
//     status: number
// }

// const fac = tRequestFactory({ baseUrl: 'http://test.com' });

// const testapi = fac<TestParams, TestRe, TestError>({
//     url: '/123',
//     method: 'GET'
// });

// testapi({ params: { abc: '123' } }).then((resp) => {
//     const [result, error] = resp;
//     if (result) {
//         const { abc } = result.data;
//         console.log(abc);
//     } else if (error) {
//         const { status } = error;
//         console.error(status);
//     }
// });

import { TRequest, TRequestError, TRequestFactory, TRequestOption, TRequestResponseData } from './types'
import defaultTRequest from './default-t-request'

const tRequestFactory = <BasicE extends TRequestError = TRequestError>(baseConfig: Parameters<TRequestFactory>[0]) =>
    <T extends Partial<TRequestOption>, R extends TRequestResponseData, E extends TRequestError = BasicE>(basicOptions: Partial<TRequestOption>): TRequest<T, R, E> =>
        (options: T): ReturnType<TRequest<T, R, E>> => {
            const { baseUrl, headers: baseHeaders, adapter: customAdapter } = baseConfig
            const newOptions = {
                ...basicOptions,
                ...options
            }
            if (baseUrl) {
                newOptions.url = baseUrl + newOptions.url
            }
            if (baseHeaders) {
                newOptions.headers = Object.assign(baseHeaders, newOptions.headers)
            }
            const adapter = customAdapter || defaultTRequest
            return adapter(newOptions as TRequestOption) as ReturnType<TRequest<T, R, E>>
        }

export const create = tRequestFactory({})

export default tRequestFactory
