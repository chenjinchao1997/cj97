export default function parallel(cores: number) {
    const waitingFns: [Function, any, (value: any) => void, (reason?: any) => void][] = [];

    const start = async () => {
        while (waitingFns.length > 0 && cores > 0) {
            cores--;
            const [fn, args, resolve, reject] = waitingFns.shift()!;
            try {
                const result = await fn(...args);
                resolve(result);
            } catch (e) {
                reject(e);
            }
            cores++;
        }
    };

    return <T extends (...args: any) => any = (...args: any) => any>(fn: T) => (...args: Parameters<T>) => {
        return new Promise<ReturnType<T>>((resolve, reject) => {
            waitingFns.push([fn, args, resolve, reject]);
            start();
        });
    };
}
