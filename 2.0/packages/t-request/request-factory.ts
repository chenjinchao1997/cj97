import { createTRequest, TRequest, TRequestFactory, TRequestOption, TRequestResponseData } from './types';
import defaultTRequest from './default-t-request';

const tRequestFactory = (baseConfig: Parameters<TRequestFactory>[0]): createTRequest =>
    <T extends TRequestOption, R extends TRequestResponseData>(basicOptions: Partial<T>): TRequest<T, R> =>
        (options: Partial<T>): ReturnType<TRequest<T, R>> => {
            const { baseUrl, headers: baseHeaders, adapter } = baseConfig;
            const newOptions = {
                ...basicOptions,
                ...options
            };
            if (baseUrl) {
                newOptions.url = baseUrl + newOptions.url;
            }
            if (baseHeaders) {
                newOptions.headers = Object.assign(baseHeaders, newOptions.headers);
            }
            if (adapter) {
                return adapter(newOptions as T) as ReturnType<TRequest<T, R>>;
            } else {
                return defaultTRequest<T, R>(newOptions as T);
            }
        };

export const create = tRequestFactory({});

export default tRequestFactory;
