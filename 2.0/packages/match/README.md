# match typescript 模式匹配

## 使用

```typescript
import match, { Type } from '@cj97/match';

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
```

## 注意

`match` 参数不允许类型为 `null` 因为考虑到 `undefined` 与 `null` 在开发期间基本一致，而实现方式导致入参联合类型及匹配必须意义对应，同时 `typeof undefined === 'undefined'` 而 `typeof null === 'object'`，所以选择只允许 `undefined`。
