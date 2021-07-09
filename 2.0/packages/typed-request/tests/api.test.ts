/* eslint-disable no-throw-literal */
import request from '../browser';
import fetchMock from 'jest-fetch-mock';
import { defineApis, defineApi, TRequestOptions } from '../index';

describe('typed-request 单元测试', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test('json', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify([{ name: 'naruto', average_score: 79 }]),
            { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } }
        );

        const apiDefs = defineApis({
            getData: defineApi(async (trq, options: { id: string }) => {
                const { id } = options;
                // TRequestOptions 第一个范型参数其实无用
                // 但是要定义第二个范型就不能省略第一个
                const resp = await trq<TRequestOptions, { id: string }[]>({
                    url: '/api/:id',
                    method: 'GET',
                    params: {
                        id
                    },
                    middlewares: [
                        async function (options, next) {
                            const resp = await next(options);
                            if (resp.status >= 400) {
                                throw {
                                    error: new Error(`Request ${resp.status}`),
                                    resp
                                };
                            }
                            return resp;
                        }
                    ]
                });
                return resp;
            })
        });

        const apis = apiDefs(request);

        const resp = await apis.getData({
            id: '1'
        });
        if (resp) {
            expect(resp.data).toEqual([{ name: 'naruto', average_score: 79 }]);
        }
    });

    test('json', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify([{ name: 'naruto', average_score: 79 }]),
            { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } }
        );

        const apiDefs = defineApis.raw({
            async getData (trq, options: { id: string }) {
                const { id } = options;
                const resp = await trq<TRequestOptions, { id: string }[]>({
                    url: '/api/:id',
                    method: 'GET',
                    params: { id }
                });
                return resp;
            }
        });

        const apis = apiDefs(request);

        const resp = await apis.getData({
            id: '1'
        });
        if (resp) {
            expect(resp.data).toEqual([{ name: 'naruto', average_score: 79 }]);
        }
    });
});
