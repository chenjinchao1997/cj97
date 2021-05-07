export function replacePathVariables (
    url: string,
    variables: Record<string, number | string>
): string {
    const regex = /\/:(\w+)/

    let newUrl = url
    let tmpArr = regex.exec(newUrl)
    while (tmpArr !== null) {
        const key = tmpArr[1]
        if (variables[key] !== undefined && variables[key] !== null) {
            newUrl = newUrl.replace(`:${key}`, variables[key].toString())
        } else {
            throw new Error(`require path variable ${key}`)
        }
        tmpArr = regex.exec(newUrl)
    }

    return newUrl
}

export function appendParams (
    url: string,
    params: Record<string, number | string>
): string {
    const query = Object.entries(params).map(([k, v]) => {
        return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    }).join('&')
    return query ? url.includes('?') ? url + query : url + '?' + query : url
}

export function buildUrl (
    url: string,
    params: Record<string, number | string>,
    variables: Record<string, number | string>
): string {
    return appendParams(replacePathVariables(url, variables), params)
}

export function isObject (val: unknown): val is Object {
    return val !== null && typeof val === 'object'
}
