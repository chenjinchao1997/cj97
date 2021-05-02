
abstract class SynchronicBase<T> {
    protected _value: T
    protected version = 0
    constructor (value: T, options?: { version: number }) {
        this._value = value
        if (options) {
            const { version } = options
            this.version = version
        }
    }

    abstract value(): Promise<T>
    abstract set<T extends unknown>(paths: string[], value: T): Promise<void>
}

export class SynchronicObject<T> extends SynchronicBase<T> {
    value (): Promise<T> {
        throw new Error('Method not implemented.')
    }

    set<T extends unknown> (paths: string[], value: T): Promise<void> {
        throw new Error('Method not implemented.')
    }
}

export class SynchronicArray<T> extends SynchronicBase<T[]> {
    value (): Promise<T[]> {
        throw new Error('Method not implemented.')
    }

    set<T extends unknown> (paths: string[], value: T): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
