// 将形如 { a: 1 } & { b: 2 } 的 Intersection Type 转换为 { a: 1, b: 2 }
// change Intersection Type like { a: 1 } & { b: 2 } into Record like { a: 1, b: 2 }
type IntersectionToRecord<T> = { [K in keyof T]: T[K] };
/**
 * 定义一个 Discriminated unions 的 type
 * define a Discriminated unions type with tag
 */
export type Type<T extends string = string, Others extends {} = {}> = IntersectionToRecord<{
    __type: T
} & Others>

// 仿照UnionToIntersection 将形如 Foo | Bar 这样的类型转化为 { Foo: Foo, Bar: Bar }
type TypeUnionToRecordIntersection<U> = (
    U extends Type ? (arg: { [x in U['__type']]: U }) => 0 : never
) extends (arg: infer I) => 0 ? I : never
type TypeUnionToRecord<T> = IntersectionToRecord<TypeUnionToRecordIntersection<T>>

// 基本类型
type BasicType = string | number | undefined | boolean | symbol;
// 将形如 number | boolean 这样的类型转化为 { number: number, boolean: boolean }
type BasicTypeUnionToRecord<T> =
    IntersectionToRecord<
        (boolean extends T ? { boolean: boolean } : {}) &
        (string extends T ? { string: string } : {}) &
        (number extends T ? { number: number } : {}) &
        (undefined extends T ? { undefined: undefined } : {}) &
        (symbol extends T ? { symbol: symbol } : {})>;

// match 函数的第二个入参
// 范型参数为 BasicTypeUnionToRecord 或 TypeUnionToRecord
type Choices<T extends { [x in string]: any }> = { [ K in keyof T ]: (cases: T[K]) => any };

/**
 * 判断是否为基础类型
 */
function _nonBasicType (x: unknown) {
    return ['undefined', 'boolean', 'number', 'string', 'symbol'].includes(typeof x);
}

/**
 * match 函数，科里化执行 match(value)({ Foo: foo => foo.foo, Bar: bar => bar.bar })
 * @param value 入参
 * @param choices 模式匹配对象
 * @returns choices 所有可能的返回值
 * usage:
type Foo = Type<'Foo', {
    foo: string
}>;

type Bar = Type<'Bar', {
    bar: number
}>;

function test (x: Foo | Bar | undefined | boolean) {
    // const result: string | number | boolean | undefined
    // 自动推断 result 类型
    const result = match(x)({
        // 此处会提示补全所有匹配
        Foo: foo => foo.foo,
        Bar: bar => bar.bar,
        undefined: () => undefined,
        boolean: v => !v
    });
    return result;
}
test({ __type: 'Foo', foo: 'hello' }); // hello
 */
export default function match<T extends Type | BasicType > (value: T):
<Cs extends Choices<TypeUnionToRecord<T>> & Choices<BasicTypeUnionToRecord<T>>>(choices: Cs) => ReturnType<Cs[keyof Cs]> {
    return (choices) => {
        if (_nonBasicType(value)) {
            const key = typeof value;
            return (choices as any)[key](value);
        } else {
            const __value = value as Type;
            return (choices as any)[__value.__type](value);
        }
    };
}
