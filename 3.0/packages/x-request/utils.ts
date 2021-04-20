export function replacePathVariables(
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
