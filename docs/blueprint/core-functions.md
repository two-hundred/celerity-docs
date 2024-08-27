---
sidebar_position: 3
toc_max_heading_level: 4
---

# Spec Core Functions

**v2023-04-20**

This document contains the definitions of the core `${..}` substitution utility functions that should be supported by all implementations of the spec.

## `fromjson`

The `fromjson` function is used to extract values from a serialised json string.
Implementations should use [json pointer notation](https://datatracker.ietf.org/doc/rfc6901/) to allow for the extraction of values from complex serialised structures.
**This only works for extracting values when the root of the json string is an object.**

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding the json string to extract values from.
2. `string` - A valid [json pointer](https://datatracker.ietf.org/doc/rfc6901/) expression to extract the value from the json string.

**Returns:**

`any`

The value extracted from the json string.
This could be a primitive value, an array, or a mapping.

**Examples:**

With a reference:
```
${fromjson(variables.cacheClusterConfig, "/host")}
```

With a function call:
```
${fromjson(trim(variables.cacheClusterConfig), "/host")}
```

With a string literal:

```
${fromjson("{\"host\":\"localhost\"}", "/host")}
```

<br/>

## `fromjson_g`

The `fromjson_g` is a composable version of the `fromjson` function that takes a json pointer expression as a static argument and returns a function that takes the json string to extract values from.
Like with `fromjson`, implementations should use [json pointer notation](https://datatracker.ietf.org/doc/rfc6901/) to allow for the extraction of values from complex serialised structures.

**Parameters:**

1. `string` - A valid [json pointer](https://datatracker.ietf.org/doc/rfc6901/) expression to extract the value from the json string.

**Returns:**

`func (string) -> any`

A function that takes a json string and extracts a value from it using the pre-configured json pointer expression.

**Examples:**

```
${map(values.cacheClusterConfigDefs, fromjson_g("/host"))}
```

<br/>

## `jsondecode`

The `jsondecode` function is used to decode a serialised json string into a primitive value, array or mapping.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding the json string to decode.

**Returns:**

`any`

The decoded json string.
This could be a primitive value, an array, or a mapping.

**Example:**

```
${jsondecode(values.cacheClusterConfig)}
```


<br/>

## `len`

The `len` function is used to get the length of a string, array, or mapping.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string, array, or mapping to get the length of.

**Returns:**

`integer`

The length of the string, array, or mapping.
For a string, the length is the number of characters.
For a mapping, the length is the number of key value pairs.

**Example:**

```
${len(values.cacheClusterConfig.endpoints)}
```

<br/>

## `substr`

The `substr` function is used to get a substring from a string.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to get the substring from.
2. `integer` - The index of the first character to include in the substring.
3. `integer` _(optional)_ - The index of the last character to include in the substring. If not provided the substring will include all characters from the start index to the end of the string.

**Returns:**

`string`

The substring from the string.

**Example:**

```
${substr(values.cacheClusterConfig.host, 0, 3)}
```

<br/>

## `substr_g`

`substr_g` is a composable version of the `substr` function that takes the start and end indexes as static arguments and returns a function that takes the string to get the substring from.

**Parameters:**

1. `integer` - The index of the first character to include in the substring.
2. `integer` _(optional)_ - The index of the last character to include in the substring. If not provided the substring will include all characters from the start index to the end of the string.

**Returns:**

`func (string) -> string`

A function that takes a string and returns the substring from the string using the pre-configured start and end positions.

**Example:**

```
${map(values.cacheClusterConfig.hosts, substr_g(0, 3))}
```

<br/>

## `replace`

The `replace` function is used to replace all occurrences of a substring in a string with another substring.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing an input string that contains a substring that needs replacing.
2. `string` - The "search" substring to replace.
3. `string` - The substring to replace the "search" substring with.

**Returns:**

`string`

The input string with all occurrences of the "search" substring replaced with the "replace" substring.

**Example:**

```
${replace(values.cacheClusterConfig.host, "http://", "https://")}
```

<br/>

## `replace_g`

`replace_g` is a composable version of the `replace` function that takes the search and replace substrings as static arguments and returns a function that takes the string to replace the substrings in.

**Parameters:**

1. `string` - The "search" substring to replace.
2. `string` - The substring to replace the "search" substring with.

**Returns:**

`func (string) -> string`

The input string with all occurrences of the "search" substring replaced with the "replace" substring.

**Example:**

```
${map(values.cacheClusterConfig.hosts, replace_g("http://", "https://"))}
```

<br/>

## `trim`

The `trim` function is used to remove all leading and trailing whitespace from a string.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to trim.

**Returns:**

The input string with all leading and trailing whitespace removed.

**Example:**

```
${trim(values.cacheClusterConfig.host)}
```

<br/>

## `trimprefix`

The `trimprefix` function is used to remove a prefix from a string.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to remove the prefix from.
2. `string` - The prefix to remove from the string.

**Returns:**

The input string with the prefix removed.

**Example:**

```
${trimprefix(values.cacheClusterConfig.host, "http://")}
```

<br/>

## `trimprefix_g`

`trimprefix_g` is a composable version of the `trimprefix` function that takes the prefix as a static argument and returns a function that takes the string to remove the prefix from.

**Parameters:**

1. `string` - The prefix to remove from the string.

**Returns:**

`func (string) -> string`

A function that takes a string and returns the input string with the prefix removed.

**Example:**

```
${map(variables,cacheClusterConfig.hosts, trimprefix_g("http://"))}
```

<br/>

## `trimsuffix`

The `trimsuffix` function is used to remove a suffix from a string.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to remove the suffix from.
2. `string` - The suffix to remove from the string.

**Returns:**

The input string with the suffix removed.

**Example:**

```
${trimsuffix(values.cacheClusterConfig.host, ":3000")}
```
<br/>

## `trimsuffix_g`

`trimsuffix_g` is a composable version of the `trimsuffix` function that takes the suffix as a static argument and returns a function that takes the string to remove the suffix from.

**Parameters:**

1. `string` - The suffix to remove from the string.

**Returns:**

`func (string) -> string`

A function that takes a string and returns the input string with the suffix removed.

**Example:**

```
${map(values.cacheClusterConfig.hosts, trimsuffix_g("/config"))}
```
<br/>

## `split`

The `split` function is used to split a string into an array of substrings based on a delimiter.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to split.
2. `string` - The delimiter to split the string by.

**Returns:**

`array`

An array of substrings that have been split by the delimiter.

**Example:**

```
${split(values.cacheClusterConfig.hosts, ",")}
```

<br/>

## `split_g`

`split_g` is a function that takes the delimiter as a static argument and returns a function that takes the string to split.

**Parameters:**

1. `string` - The delimiter to split the string by.

**Returns:**

`func (string) -> array`

A function that takes a string and returns an array of substrings that have been split by the delimiter.

**Example:**

```
${flatmap(values.cacheClusterConfig.multiClusterHosts, split_g(","))}
```

<br/>

## `join`

The `join` function is used to join an array of strings into a single string using a delimiter.

**Parameters:**

1. `array` - A reference or function call yielding a return value representing an array of strings to join together.
2. `string` - The delimiter to join the strings with.

**Returns:**

`string`

A single string that is the result of joining the array of strings with the delimiter.

**Example:**

```
${join(values.cacheClusterConfig.hosts, ",")}
```

<br/>

## `index`

The `index` function is used to get the first index of a substring in a given string.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to search for the substring in.
2. `string` - The substring to search for in the string.

**Returns:**

`integer`

The index of the first occurrence of the substring in the string.
This will be -1 if the substring is not found in the string.

**Example:**

```
${index(values.cacheClusterConfig.host, ":3000")}
```

<br/>

## `last_index`

The `last_index` function is used to get the last index of a substring in a given string.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to search for the substring in.
2. `string` - The substring to search for in the string.

**Returns:**

`integer`

The index of the last occurrence of the substring in the string.
This will be -1 if the substring is not found in the string.

**Example:**

```
${last_index(values.cacheClusterConfig.host, ":3000")}
```

<br/>

## `to_upper`

The `to_upper` function converts all characters of a string to upper case.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to convert to upper case.

**Returns:**

`string`

The input string with all characters converted to upper case.

**Example:**

```
${to_upper(values.cacheClusterConfig.hostName)}
```
<br/>

## `to_lower`

The `to_lower` function converts all characters of a string to lower case.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to convert to lower case.

**Returns:**

`string`

The input string with all characters converted to lower case.

**Example:**

```
${to_lower(values.cacheClusterConfig.hostId)}
```
<br/>

## `has_prefix`

The `has_prefix` function is used to check if a string starts with a given substring.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to check.
2. `string` - The prefix to check for at the start of the string.

**Returns:**

`bool`

True, if the string starts with the prefix, false otherwise.

**Example:**

```
${has_prefix(values.cacheClusterConfig.host, "http://")}
```

<br/>

## `has_prefix_g`

`has_prefix_g` is a composable version of the `has_prefix` function that takes the prefix as a static argument and returns a function that takes the string to check.

**Parameters:**

1. `string` - The prefix to check for at the start of the string.

**Returns:**

`func (string) -> bool`

A function that takes a string and returns true if the string starts with the prefix, false otherwise.

**Example:**

```
${filter(
  values.cacheClusterConfig.hosts,
  has_prefix_g("http://")
)}
```

<br/>

## `has_suffix`

The `has_suffix` function is used to check if a string ends with a given substring.

**Parameters:**

1. `string` - A valid string literal, reference or function call yielding a return value representing the string to check.
2. `string` - The suffix to check for at the end of the string.

**Returns:**

`bool`

True, if the string ends with the suffix, false otherwise.

**Example:**

```
${has_suffix(values.cacheClusterConfig.host, "/config")}
```

<br/>

## `has_suffix_g`

`has_suffix_g` is a composable version of the `has_suffix` function that takes the suffix as a static argument and returns a function that takes the string to check.

**Parameters:**

1. `string` - The suffix to check for at the end of the string.

**Returns:**

`func (string) -> bool`

A function that takes a string and returns true if the string ends with the suffix, false otherwise.

**Example:**

```
${filter(
  values.cacheClusterConfig.hosts,
  has_suffix_g("/config")
)}
```

<br/>

## `contains`

The `contains` function is used to check if a string contains a given substring or if an array contains a given value.

**Parameters:**

1. `string | array` - A valid string literal, reference or function call yielding a return value representing a string or array to search.
2. `string | ArrayElem` - The substring or value to search for in the string or array.

**Returns:**

`bool`

True, if the substring or value is found in the string or array, false otherwise.

**Example:**

```
${contains(values.cacheClusterConfig.host, "celerityframework.com")}
```

<br/>

## `contains_g`

`contains_g` is a composable version of the `contains` function that takes the substring or value as a static argument and returns a function that takes the string or array to check.

**Parameters:**

1. `string | ArrayElem` - The substring or value to search for in the string or array.

**Returns:**

`func (string | array) -> bool`

A function that takes a string or array and returns true if the substring or value is found in the string or array, false otherwise.

**Example:**

```
${filter(
  values.cacheClusterConfig.hosts,
  contains_g("celerityframework.com")
)}
```

<br/>

## `list`

Creates a list of values from arguments of the same type.

**Parameters:**

N arguments of the same type that will be used to create a list.

**Returns:**

`array`

An array of values that have been passed as arguments.

**Example:**

```
${list(
  "item1",
  "item2",
  "item3",
  "item4"
)}
```

<br/>

## `object`

Creates an object from named arguments.

**Parameters:**

N named arguments that will be used to create an object/mapping.
When no arguments are passed, an empty object should be returned.

:::caution
Named function arguments are a special case that are only used in the `object` function.
It is not syntactically invalid to use named arguments in other functions but the names will be
ignored and the values passed in will be treated as positional arguments.
:::

**Returns:**

`object`

An object containing attributes that have been passed as named arguments.

**Example:**

```
${object(
  id = "subnet-1234",
  label = "Subnet 1234"
)}
```

<br/>

## `keys`

Produces an array of keys from a mapping or attribute names from an object.

**Parameters:**

1. `mapping` - A mapping to extract keys from. (This can also be an object with known attributes, the two are interchangeable up to the point of validating parameters and return values)

**Returns:**

`array`

An array of keys or attributes from the mapping or object.

**Example:**

```
${keys(datasources.network.subnets)}
```

<br/>

## `vals`

Produces an array of values from a mapping or object with known attributes.

_This function is named `vals` to avoid conflicting with the `values` keyword used for blueprint values._

**Parameters:**

1. `mapping` - A mapping or object to extract values from.

**Returns:**

`array`

An array of values extracted from the provided mapping or object.

**Example:**

```
${vals(datasources.network.subnets)}
```

<br/>

## `map`

Maps a list of values to a new list of values using a function.

**Parameters:**

1. `array` - An array of items where all items are of the same type to map.
2. `func<Item, NewItem>(Item, integer?) -> NewItem` - A function that will be applied to each item in the array, the function must match the type of the items in the array. A runtime error should be returned if the function does not match this type. This function can optionally take an index as a second argument.

**Returns:**

`array`

An array of values that have been transformed by the function.

**Example:**

```
${map(
  datasources.network.subnets,
  compose(to_upper, getattr("id"))
)}
```

<br/>

## `filter`

Filters a list of values based on a predicate function.

**Parameters:**

1. `array` - An array of items where all items are of the same type to filter.
2. `func<Item>(Item) -> bool` - A function that will be applied to each item in the array, the function must return a boolean value.

**Returns:**

`array`

An array of filtered values based on the predicate function.

**Example:**

```
${filter(
  datasources.network.subnets,
  hasprefix_g("subnet-402948-")
)}
```

<br/>

## `reduce`

Reduces a list of values to a single value using a function.
There are no core functions that have the signature of a reducer function,
the `reduce` function is in the core spec to provide the tools for implementations and end users
to be able to apply more complex transformations of data in blueprints.

**Parameters:**

1. `array` - An array of items where all items are of the same type to reduce over.
2. `func<Item, Accum>(Accum, Item, integer?) -> Accum` - A function that will be applied to each item in the array, accumulating a single value. This function can optionally take an index as a third argument.
3. `Accum` - The initial value to start the accumulation with.

**Returns:**

`any`

The accumulated value as a result of applying the reducer function to each item in the array.

**Example:**

```
${reduce(
  datasources.network.subnets,
  extract_crucial_network_info,
  object()
)}
```

<br/>

## `sort`

Sorts a list of values based on a comparison function.
There are no core functions that have the signature of a comparison function,
the `sort` function is in the core spec to provide the tools for implementations and end users
to sort arrays of values based on a custom comparison function.

**Parameters:**

1. `array` - An array of items where all items are of the same type to sort.
2. `func<Item>(Item, Item) -> integer` - The comparison function that is expected to return a negative integer if the first item should come before the second item, a positive integer if the first item should come after the second item, and zero if the items are equal.

**Returns:**

`array`

An array of sorted values based on the comparison function.

**Example:**

```
${sort(
  datasources.network.subnets,
  compare_cidr_ranges,
)}
```

<br/>

## `flatmap`

Maps a list of values to a new list of values using a function and flattens the result.

One example where this is useful would be where you have a list of strings where each string is a comma separated list of values and you want to split each string into a list of values and then flatten the result into a single output list.

To illustrate this, for input:

```
values.hosts = ["host1,example.com:3049", "host2,example.com:4095"]
```

Applying the flat map function like so:
```
${flatmap(
  values.hosts,
  split_g(",")
)}
```

Would result in the following output:
```
["host1", "example.com:3049", "host2", "example.com:4095"]
```

**Parameters:**

1. `array` - An array of items where all items are of the same type to map.
2. `func<Item, NewItem extends array>(Item, integer?) -> NewItem` - A function that will be applied to each item in the array, the function must match the type of the items in the array. A runtime error should be returned if the function does not match this type. This function can optionally take an index as a second argument.

**Returns:**

`array`

An array of values that have been transformed by the function
and flattened into a one-dimensional array.

**Example:**

```
${flatmap(
  values.cacheClusterConfig.hosts,
  split_g(",")
)}
```

<br/>

## `compose`

`compose` is a higher-order function that combines N functions into a single function,
where the output of one function is passed in as the input to the previous function.
The call order of the functions is from right to left.

**Parameters:**

N functions that will be composed together from right to left.
The return type of each function must match the input type of the function to the left.

**Returns:**

`func (any) -> any`

A function that takes the input value of the right-most function and returns the output value of the left-most function.

**Example:**

```
${map(
  datasources.network.subnets,
  compose(to_upper, getattr("id"))
)}
```

<br/>

## `pipe`

`pipe` is a higher-order function that combines N functions into a single function,
where the output of one function is passed in as the input to the next function.
The call order of the functions is from left to right, which is generally seen as more intuitive than the right to left order of `compose`.

**Parameters:**

N functions that will be piped together from left to right.
The return type of each function must match the input type of the function to the right.

**Returns:**

`func (any) -> any`

A function that takes the input value of the left-most function and returns the output value of the right-most function.

**Example:**

```
${map(
  datasources.network.subnets,
  pipe(getattr("id"), to_upper)
)}
```

<br/>

## `getattr`

A higher-order function that returns a function that extracts a named attribute from an object or a mapping. This is useful in situations where you want to map an array of objects to an array of values of a specific attribute such as IDs.

It can also be used to extract values from an object or mapping but the `.` or `[]` notation is more appropriate for this use case. 
```
datasources.network.subnets[].id
```
is more concise and readable than:
```
getattr("id")(datasources.network.subnets[])
```

**Parameters:**

1. `string` - The name of the attribute to extract from the object or mapping.

**Returns:**

`func (object | mapping) -> any`

A function that takes an object or mapping and returns the value of the named attribute.

**Example:**

```
${map(
  datasources.network.subnets,
  compose(getattr("id"), getattr("definition"))
)}
```

This example would take a list of subnets that would be of the following form:

```json
[{
  "definition": {
    "id": "subnet-1234"
  }
}, {
  "definition": {
    "id": "subnet-5678"
  }
}]
```

And return a list of ids:

```json
["subnet-1234", "subnet-5678"]
```

<br/>

## `getelem`

A higher-order function that returns a function that extracts an element from an array. This is useful in situations where you want to map a two-dimensional array to an array of values of a specific element.

It can also be used to extract values from an array but the `[]` notation is more appropriate for this use case. 
```
datasources.network.subnets[2]
```
is more concise and readable than:
```
getelem(2)(datasources.network.subnets)
```

**Parameters:**

1. `integer` - The position of the element to extract from the array.

**Returns:**

`func (array) -> any`

A function that takes an array and returns the value at the provided position.

**Example:**

```
${map(
  datasources.network.subnets,
  compose(get_attr("id"), getelem(0))
)}
```

This example would take a list of subnets that would be of the following form:

```json
[[
  {
    "id": "subnet-1234",
    "label": "Subnet 1234"
  },
  "10.0.0.0/16"
], [
  {
    "id": "subnet-5678",
    "label": "Subnet 5678"
  },
  "172.31.0.0/16"
]]
```

And return a list of ids:

```json
["subnet-1234", "subnet-5678"]
```

<br/>

## `link`

A function to retrieve the state of a link between two resources.

**Parameters:**

1. `string | ResourceRef` - Resource A in the relationship, can be a string literal of the resource name or a reference to a resource.
2. `string | ResourceRef` - Resource B in the relationship, can be a string literal of the resource name or a reference to a resource.

**Returns:**

`object`

An object containing all the information about the link between the two resources made available by the provider that powers the link.

**Example:**

Using resource references:
```
${link(resources.orderApi, resources.createOrderFunction)}
```

Using implict resource references (identifiers without a namespace are either resources or functions):
```
${link(orderApi, listOrdersFunction)}
```

Using string literals:

```
${link("orderApi", "deleteOrderFunction")}
```

<br/>

## `and`

A function that acts as a logical AND operator on two boolean values.

**Parameters:**

1. `boolean` - The result of boolean expression A the left-hand side of the AND operation.
2. `boolean` - The result of boolean expression B the right-hand side of the AND operation.

**Returns:**

`boolean`

The result of the logical AND operation on the two boolean values.

**Example:**

```
${and(resources.orderApi.state.isProd, eq(variables.environment, "prod"))}
```

<br/>

## `or`

A function that acts as a logical OR operator on two boolean values.

**Parameters:**

1. `boolean` - The result of boolean expression A the left-hand side of the OR operation.
2. `boolean` - The result of boolean expression B the right-hand side of the OR operation.

**Returns:**

`boolean`

The result of the logical OR operation on the two boolean values.

**Example:**

```
${or(resources.orderApi.state.isDev, eq(variables.environment, "dev"))}
```

<br/>

## `not`

A function that negates a given boolean value.

**Parameters:**

1. `boolean` - The result of a boolean expression to negate.

**Returns:**

`boolean`

The result of negating the provided boolean value.

**Example:**

```
${not(eq(variables.environment, "prod"))}
```

<br/>

## `eq`

A function that determines whether two values of the same type are equal.

**Parameters:**

1. `any` - The left-hand side of the equality comparison.
2. `any` - The right-hand side of the equality comparison.

**Returns:**

`boolean`

True, if the two values are equal, false otherwise.

**Example:**

```
${eq(variables.environment, "prod")}
```

<br/>

## `gt`

A function that determines whether a number is greater than another number.

**Parameters:**

1. `integer | float` - "a" in the expression "a > b".
2. `integer | float` - "b" in the expression "a > b".

**Returns:**

`boolean`

True, if the first number is greater than the second number, false otherwise.

**Example:**

```
${gt(len(datasources.network.subnets), 10)}
```

<br/>

## `ge`

A function that determines whether a number is greater than or equal to another number.

**Parameters:**

1. `integer | float` - "a" in the expression `a >= b`.
2. `integer | float` - "b" in the expression `a >= b`.

**Returns:**

`boolean`

True, if the first number is greater than or equal to the second number, false otherwise.

**Example:**

```
${ge(len(datasources.network.subnets), 10)}
```

<br/>

## `lt`

A function that determines whether a number is less than another number.

**Parameters:**

1. `integer | float` - "a" in the expression `a < b`.
2. `integer | float` - "b" in the expression `a < b`.

**Returns:**

`boolean`

True, if the first number is less than the second number, false otherwise.

**Example:**

```
${lt(len(datasources.network.subnets), 10)}
```


<br/>

## `le`

A function that determines whether a number is less than or equal to another number.

**Parameters:**

1. `integer | float` - "a" in the expression `a <= b`.
2. `integer | float` - "b" in the expression `a <= b`.

**Returns:**

`boolean`

True, if the first number is less than or equal to the second number, false otherwise.

**Example:**

```
${le(len(datasources.network.subnets), 10)}
```

<br/>

## Clarification on `_g` functions

A lot of the core functions have two definitions in the spec, one for direct function calls and one for function composition. The `_g`[^1] suffix is used to denote a function to be used for composition that takes static arguments and produces a function that takes the dynamic value to be transformed.

A direct usage example would be:

```
${trimprefix(values.cacheClusterConfig.host, "http://")}
```

A composition usage example would be:

```
${map(values.cacheClusterConfig.hosts, trimprefix_g("http://"))}
```

Only some of the core string manipulation functions have a composable version, this is because they are the most likely to be used in a composition context. Implementations are free to add composable versions of other functions as they see fit. A plugin system for functions could also be useful in allowing users of a tool implementing the spec to add their own functions.


[^1]: The reasoning for the `_g` suffix for these functions is that `g` is commonly used in mathematics to denote a function in composition.
