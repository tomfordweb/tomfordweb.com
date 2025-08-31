---
title: Using recursion in Typescript types
date: 2025-08-15
---

The following technique allows the developer to define recursive types with typescript. While I would not suggest important data conforming to this type, I feel like using a data structure we are all familiar with such as JSON makes it easy to explain the idea.


Given the folowing example. You can see that the key value interface allows us to define a generic type for the objects values. The object can be any size of keys.

```typescript
export interface KeyValueInterface<T> { [key: string]: T }
```

The interface lets us define simple flat objects with one (or multiple if you pipe them) type.

```typescript
const OopsAllBooleans:KeyValueInterface<bool> = {
    foo: true,
    bar: true,
    baz: false
}
const AllStrings:KeyValueInterface<string> = {
    foo: "foo",
}
```

While this generic type is powerful for simpler objects, what if you need a nested object in your JSON? How often does json actually contain the same value for every key?

At first, you may think that you can just make it `KeyValueInterface<any>` or perhaps event worse..`KeyValueInterface<unknown>` and while this works. It is bad code, any decent linter will reject it, and your code reviewer is going to ask you why you are even writing Typescript.

<hr />

So what values can an JSON object contain? They have scalar values (numbers, booleans, strings, etc), and we can nest more json objects as well. So in addition to the scalar value, it could also be itself or some completely different object. 

## The scalars

Lets start by representing the basic scalar values. 

```typescript
type ScalarKeyValueValue = string | number | boolean | null | undefined;
```

With the above type, we can actually use this for a slightly better `KeyValueInterface`..

```typescript
const KitchenSink:KeyValueInterface<ScalarKeyValueValue> = {
    undefinedVal: undefined,
    null: null,
    string: "foo",
    number: 1,
    bool: false
}
```

## Nested objects

We could even nest the scalar example from above.

```typescript
const BadIdea:KeyValueInterface<ScalarKeyValueValue | KeyValueInterface<ScalarKeyValueValue>> = {
    nested: {
        undefinedVal: undefined,
        null: null,
        string: "foo",
        number: 1,
        bool: false
    },
    undefinedVal: undefined,
    null: null,
    string: "foo",
    number: 1,
    bool: false

}

```

However, lets make an intermediary type to help with reading.

```typescript 
type ReturnValueType = ScalarKeyValueValue | KeyValueInterface<ScalarKeyValueValue>;

const KitchenSink:KeyValueInterface<ReturnValueType> = {
    nested: {
        undefinedVal: undefined,
        null: null,
        string: "foo",
        number: 1,
        bool: false
    },
    undefinedVal: undefined,
    null: null,
    string: "foo",
    number: 1,
    bool: false
}

```

`ReturnValueType` says each key of KeyValueInterface will either be the basic scalar value we defined above, or it could also be another key value interface containing the scalar value.

But what if the `nested` property contained another object inside of it? In its current shape `KeyValueInterface<ReturnValueType>` can't supported a third nesting level in the data. This is where the recursive typing comes in.

Make a new interface, call it `RecursiveKeyValueInterface`

```typescript
export type RecursiveKeyValueInterface = KeyValueInterface<ReturnValueType>;
```

And then for `ReturnValueType`, all you need to do is reference the `RecursiveKeyValueInterface` as a possible return value.

```typescript
type ReturnValueType = ScalarKeyValueValue | KeyValueInterface<ScalarKeyValueValue> | RecursiveKeyValueInterface;
```

Referencing the parent type in the child type lets us nest objects.


```typescript
const KitchenSink: RecursiveKeyValueInterface = {
    nested: {
        undefinedVal: undefined,
        null: null,
        string: "foo",
        number: 1,
        bool: false
        nested: {
            undefinedVal: undefined,
            null: null,
            string: "foo",
            number: 1,
            bool: false
            nested: {
                undefinedVal: undefined,
                null: null,
                string: "foo",
                number: 1,
                bool: false
            },
            nested: {
                hello: "world"
            },
        },
    },
    undefinedVal: undefined,
    null: null,
    string: "foo",
    number: 1,
    bool: false

}
```


