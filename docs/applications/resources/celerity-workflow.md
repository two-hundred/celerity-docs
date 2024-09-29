---
sidebar_position: 7
---

# `celerity/workflow`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/workflow` resource type is used to define a workflow that orchestrates the execution of multiple handlers in a blueprint as a series of steps.

Workflows can be deployed to different target environments. Serverless environments will use the cloud provider's workflow service, such as AWS Step Functions, Google Cloud Workflows, or Azure Logic Apps. Containerised and custom server environments will use the Celerity workflow runtime to execute the workflow steps.

Workflows can be used to define complex logic that requires multiple steps to be executed in a specific order. Handlers can be used for states which have the type `executeStep`. Workflows can also be used to define error handling and retries for each step to create robust and fault-tolerant applications.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/workflow` resource followed by examples of different configurations for the resource type, a section outlining the behaviour in supported target environments along with additional documentation.

The specification for a workflow is influenced by the concept of a workflow as a state machine emphasised by Amazon's States Language created for AWS Step Functions.

### states (required)

A mapping of state names to state configurations that make up the state machine of the workflow.
A state configuration resembles a state in a state machine which describes decisions, transitions or the step to be executed when the state is entered.

**type**

mapping[string, [state](#state)]

## Annotations

## Outputs

## Data Types

### state

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>type (required)</strong></p>

The type of state for the workflow.

- `executeStep` is for a state that executes a handler.
- `pass` is for a state that passes the input to the output without doing anything, a pass step can inject extra data into the output.
- `parallel` is for a state that executes multiple steps in parallel. Depending on the target environment, parallel execution may be limited by available compute resources. Read more about the [limitations](#️-limitations) of parallel execution in the Celerity workflow runtime.
- `wait` is for a state that waits for a specific amount of time before transitioning to the next state.
- `decision` is for a state that makes a decision on the next state based on the output of a previous state.
- `failure` is for a state that indicates a specific failure state in the workflow, this is a terminal state.
- `success` is for a state that indicates the end of the workflow, this is a terminal state.

**field type**

string

**allowed values**

`executeStep` | `pass` | `parallel` | `wait` | `decision` | `failure` | `success`

___

<p style={{fontSize: '1.2em'}}><strong>description</strong></p>

A human-readable description for the state.

**field type**

string

___

<p style={{fontSize: '1.2em'}}><strong>inputPath</strong></p>

The input path to use as the root input for the state.
This is useful for extracting a subset of the input object to use in the current state.
The supported path syntax is described in the [Path Syntax](#path-syntax) section.

When not set, the input to the state is the entire input object from the previous state's output or from the initial input for the workflow.

Input path is only supported for `executeStep`, `pass`, `wait`, `decision`, `success` and `parallel` state types.

**field type**

string

**examples**

`$.metadata`

___

<p style={{fontSize: '1.2em'}}><strong>resultPath</strong></p>

The result path determines the location in the output object where the result of the state will be placed.
This is useful for merging results into the input object instead of replacing it.
The supported path syntax is described in the [Path Syntax](#path-syntax) section.

For example, for an input object:

```json
{
  "value": 10
}
```

A resultPath of `$.result` would result in the following output object:

```json
{
  "value": 10,
  "result": "some result"
}
```

When not set, the output of the state will be the entire output object passed into the next state.
This field should not be set if the `outputPath` field is set.

Result path is only supported for `executeStep`, `pass` and `parallel` state types.

**field type**

string

**examples**

`$.sum`

`$.result`

___

<p style={{fontSize: '1.2em'}}><strong>outputPath</strong></p>

The output path determines the location of a value of the result to be passed to the next state.
This is useful for extracting a subset of the result object to pass to the next state.
The supported path syntax is described in the [Path Syntax](#path-syntax) section.

For example, for an input object:

```json
{
  "id": "82612fc2-dc3f-4fee-a65b-a8721aec71b1",
  "metadata": {
    "value": 10
  }
}
```

An outputPath of `$.metadata` would result in the following output object:

```json
{
  "value": 10
}
```

When not set, the output of the state will be the entire result object passed into the next state.
This field should not be set if the `resultPath` field is set.

Output path is only supported for `executeStep`, `pass`, `wait`, `decision`, `success` and `parallel` state types.

**field type**

string

**examples**

`$.sum`

`$.result`

___

<p style={{fontSize: '1.2em'}}><strong>payloadTemplate</strong></p>

A template for the payload to be passed into the handler configured to be executed for the current state.

When not set, the entire input object from the previous state's output or from the initial input for the workflow will be passed as the payload to the handler.

A payload template is a mapping structure that can be used to construct a payload.
The payload template can contain literal values, nested mappings, arrays, paths to values in the input object and functions applied to input values.

See the [Payload Template](#payload-template) section for more information on how to construct a payload template.

This field is only supported for `executeStep`, `pass`, and `parallel` state types.

**field type**

mapping[string, any]

___

<p style={{fontSize: '1.2em'}}><strong>next (conditionally required)</strong></p>

The next state to transition to after the current state is executed.

This field is required for `executeStep`, `pass`, `parallel` and `wait` state types if `end` is not set to `true`.
This field can not be used for `failure`, `decision` or `success` states.

**field type**

string

___

<p style={{fontSize: '1.2em'}}><strong>decisions (conditionally required)</strong></p>

A list of decision rules that determine the next state to transition to based on the output of a previous state.

Each decision rule will be evaluated in order until a rule is found where the output from the previous state matches the rule's condition.

This field is required for the `decision` state type.
The field can not be used for `failure`, `decision` or `success` states.

**field type**

array[[decisionRule](#decisionrule)]

___

<p style={{fontSize: '1.2em'}}><strong>result</strong></p>

Result, when provided, is treated as the output as the result of the state,
as if it was the result from a handler execution.
When `result` is not set, the output is the input to the pass state that is subject to modification by the `resultPath` field.

This field is optional for the `pass` state type.
The field can not be used with any other state types.

**field type**

any

___

<p style={{fontSize: '1.2em'}}><strong>timeout</strong></p>

The maximum amount of time in seconds that the state is allowed to complete execution of a handler.

If the state runs for longer than the timeout, the state will fail with the `Timeout` error name.

This field is optional for the `executeStep` state type.
The field can not be used with any other state types.

**field type**

integer

**default value**

`60`

___

<p style={{fontSize: '1.2em'}}><strong>waitConfig (conditionally required)</strong></p>

State configuration specific to the `wait` state type.

This field is required for the `wait` state type, it can not be used with any other state types.

**field type**

[waitConfiguration](#waitconfiguration)

___

<p style={{fontSize: '1.2em'}}><strong>failureConfig (conditionally required)</strong></p>

State configuration specific to the `failure` state type.

This field is required for the `failure` state type, it can not be used with any other state types.

**field type**

[failureConfiguration](#failureconfiguration)

___

<p style={{fontSize: '1.2em'}}><strong>parallelBranches (conditionally required)</strong></p>

A list of branches to be executed in parallel. 

The actual execution model will vary based on the target environment, see the [limitations](#️-limitations) section for more information on how parallel execution is accomplished in the Celerity workflow runtime.

This field is required for the `parallel` state type, it can not be used for any other state types.

The output of each branch will be merged into an array with a single element for each branch.
The order of the results in the output array will match the order of the branches defined in this field.

**field type**

array[[parallelBranch](#parallelbranch)]

___

<p style={{fontSize: '1.2em'}}><strong>retry</strong></p>

Retry configuration for the state when the handler execution fails.

This field is only supported for `executeStep` and `parallel` state types.

**field type**

array[[retryConfiguration](#retryconfiguration)]

___

<p style={{fontSize: '1.2em'}}><strong>catch</strong></p>

Configuration to provide fallback states for specific error types.

This field is only supported for `executeStep` and `parallel` state types.

**field type**

array[[catchConfiguration](#catchconfiguration)]

___

### decisionRule

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>and (conditionally required)</strong></p>

A boolean expression consisting of an array of conditions where all must be true to advance to the state specified in the `next` field.

This field is required if the `or`, `not`, and `condition` fields are not set.

**field type**

array[[condition](#condition)]

___

<p style={{fontSize: '1.2em'}}><strong>or (conditionally required)</strong></p>

A boolean expression consisting of an array of conditions where only one has to be true to advance to the state specified in the `next` field.

This field is required if the `and`, `not`, and `condition` fields are not set.

**field type**

array[[condition](#condition)]

___

<p style={{fontSize: '1.2em'}}><strong>not (conditionally required)</strong></p>

A boolean expression consisting of a single condition for which the negation of the condition must be true to advance to the state specified in the `next` field.

This field is required if the `and`, `or`, and `condition` fields are not set.

**field type**

[condition](#condition)

___

<p style={{fontSize: '1.2em'}}><strong>condition (conditionally required)</strong></p>

A single condition that must be true to advance to the state specified in the `next` field.

This field is required if the `and`, `or`, and `not` fields are not set.

**field type**

[condition](#condition)

___

<p style={{fontSize: '1.2em'}}><strong>next (required)</strong></p>

The next state to transition to if the condition is met.

**field type**

string

___

### condition

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>inputs (required)</strong></p>

A list of one or more inputs to be evaluated for the condition, the number of inputs provided will depend on the number of arguments expected by the `function` field.

An input can be a path or a literal value.

See the [Path Syntax](#path-syntax) section for more information on how to specify paths.

:::warning Complex types as inputs
In this version of the workflow resource type, complex types such as arrays and objects are not supported as inputs to conditions. Only strings, integers, floats, booleans, and null are supported.
:::

**field type**

array[string | integer | float | boolean | null]

**examples**

```yaml
["$.value", 20]
```

```yaml
["$.result.id", "someConstant"]
```

```yaml
[594.34, false, null]
```

___

<p style={{fontSize: '1.2em'}}><strong>function (required)</strong></p>

The function to be used to evaluate the condition.

Functions can take one or more input arguments and always return a boolean value.

The list of available functions for this version of the workflow resource type can be found in the [Condition Functions](#condition-functions) section.

**field type**

string

**examples**

`is_present`

`eq`

___

### parallelBranch

#### FIELDS
___

<p style={{fontSize: '1.2em'}}><strong>startAt (required)</strong></p>

The name of the state used to begin execution of the branch.

**field type**

string

___

<p style={{fontSize: '1.2em'}}><strong>states (required)</strong></p>

A mapping of state names to state configurations that make up a branch of the parallel state.
A state configuration resembles a state in a state machine which describes decisions, transitions or the step to be executed when the state is entered.

States in a branch must only have a `next` field that points to a state within the same branch.
States outside of a branch can not transition to a state within a branch.

When there is a failure in any branch, due  to an unhandled error or by transitioning to a failure state, the entire parallel state will fail.

When a branch transitions to a success state, only that branch will terminate as a result. A success state will pass its input through to the output that may be modified by the `inputPath` and `outputPath` fields.

:::warning State names
State names must be unique within the entire workflow definition so that handlers can be wired up to the correct states via [workflow to handler link annotations](/docs/applications/resources/celerity-handler#celerityworkflow--celerityhandler).
:::

**type**

mapping[string, [state](#state)]

### waitConfiguration

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>seconds (conditionally required)</strong></p>

Number of seconds to wait before transitioning to the next state.

This does not need to be hardcoded, it can be a path to a value in the input object.

This is required if the `timestamp` field is not set.

**field type**

integer

**examples**

`10`

`$.waitTime`

___


<p style={{fontSize: '1.2em'}}><strong>timestamp (conditionally required)</strong></p>

The timestamp to wait until before transitioning to the next state.
The timestamp must be in the format of the [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339) profile for the ISO 8601 standard.

The timestamp does not need to be hardcoded, it can be a path to a value in the input object.

This is required if the `seconds` field is not set.

**field type**

string

**examples**

`2024-07-22T12:00:00Z`

`2024-07-22T12:00:00.123Z`

`$.expires`

___

### failureConfiguration

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>error</strong></p>

The error name to be used for the failure state.
This can be a path or a literal value.

**field type**

string

**examples**

`ResourceNotFound`

`$.error`

___


<p style={{fontSize: '1.2em'}}><strong>cause</strong></p>

A description of the cause of the failure.
This can be a path or a literal value.

**field type**

string

**examples**

`Order not found in the system`

`$.cause`

___


<p style={{fontSize: '1.2em'}}><strong>timestamp (conditionally required)</strong></p>

The timestamp to wait until before transitioning to the next state.
The timestamp must be in the format of the [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339) profile for the ISO 8601 standard.

The timestamp does not need to be hardcoded, it can be a path to a value in the input object.

This is required if the `seconds` field is not set.

**field type**

string

**examples**

`2024-07-22T12:00:00Z`

`2024-07-22T12:00:00.123Z`

`$.expires`

___

### retryConfiguration

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>matchErrors (required)</strong></p>

A list of error names that should be matched in order to trigger a retry.

See the [errors](#errors) section for a list of built-in errors that can be matched against.

Custom error names may also be used to match specific errors thrown by handlers.

**field type**

array[string]

**examples**

```yaml
["Timeout", "ResourceNotFound"]
```

```yaml
["*"] # Retry on all errors
```
___

<p style={{fontSize: '1.2em'}}><strong>intervalSeconds</strong></p>

A positive integer value representing the number of seconds to wait before the first attempt to retry
a failed state.

**field type**

integer

**default value**

`3`
___

<p style={{fontSize: '1.2em'}}><strong>maxAttempts</strong></p>

A positive integer value representing the maximum number of attempts to retry a failed state.

A value of `0` is valid for this field; this indicates that the state should not be retried on a specific error.

**field type**

integer

**default value**

`5`
___

<p style={{fontSize: '1.2em'}}><strong>maxDelay</strong></p>

A positive integer value representing the maximum internval in seconds to wait between retries.

**field type**

integer
___

<p style={{fontSize: '1.2em'}}><strong>jitter</strong></p>

A boolean value that determines whether to apply jitter to the retry interval.
This AWS blog post from 2015 provides a good insight into how works:
https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/

The implementation of jitter varies across target environments.

**field type**

boolean

**default value**

`false`
___

<p style={{fontSize: '1.2em'}}><strong>backoffRate</strong></p>

A floating point value representing a multiplier that increases the retry interval on each attempt.
This AWS blog post from 2015 provides a good insight into how exponential backoff works:
https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/

**field type**

float

**default value**

`2.0`
___

### catchConfiguration

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>matchErrors (required)</strong></p>

A list of error names that should be matched in order to trigger a retry.

See the [errors](#errors) section for a list of built-in errors that can be matched against.

Custom error names may also be used to match specific errors thrown by handlers.

**field type**

array[string]

**examples**

```yaml
["Timeout", "ResourceNotFound"]
```

```yaml
["*"] # Retry on all errors
```
___

<p style={{fontSize: '1.2em'}}><strong>next (required)</strong></p>

The name of the next state to transition to if the error matches any of the errors in the `matchErrors` field.

**field type**

string
___

<p style={{fontSize: '1.2em'}}><strong>resultPath</strong></p>

The path to the output field to inject the error information into the input object passed to the state defined
in the `next` field.

For example, for an input object:

```json
{
  "value": 10
}
```

A resultPath of `$.errorInfo` would result in the following output object:

```json
{
  "value": 10,
  "errorInfo": {
    "error": "Some error message",
    "cause": "Some cause"
  }
}
```

When not set, the error information will not be injected into the input object passed to the next state.

**field type**

string

**examples**

`$.errorInfo`

___

## Linked From

## Links To

## Examples

## Path Syntax

Paths are used to access values in the input object to the current state in the workflow.

When evaluating a path as an input for a condition, a string beginning with `$.` is interpreted as a path, otherwise, the value is treated as a string literal.

The path to the input field from the previous state's output that the condition will be evaluated against.

The syntax for the path is `$.*`. `$` represents the root input object and `*` represents any key in the object.

For example, `$.value` would match the value of the key `value` in the input object.
Nested keys can also be accessed using the dot notation, for example, `$.result.id` would match the value of the `id` key in the nested `result` object.

The [JSONPath](https://goessner.net/articles/JsonPath/) syntax which is implemented for paths in Celerity workflows.

## Errors

There are a built-in set of errors that can be matched against in the retry and catch configuration for a state.

Built-in errors include the following:

- `*` - Matches all errors.
- `Timeout` - The handler execution timed out.
- `HandlerFailed` - The handler execution failed.
- `InvalidResultPath` - The result path specified in the state configuration is invalid.
- `InvalidOutputPath` - The output path specified in the state configuration is invalid.
- `InvalidPayloadTemplate` - The payload template specified in the state configuration is invalid.
- `PayloadTemplateFailure` - An error occurred while constructing the payload using the payload template, often an issue with a template function call.
- `BranchFailed` - A branch of a parallel state failed.
- `NoDecisionMatched` - No decision rule matched in a decision state.

These errors will map to the closest corresponding built-in error type in the target environment.

##  Payload Template

The payload template is a mapping structure that can be used to construct a payload to be passed into the handler configured to be executed for the current state.

If a field value starts with `$.`, the value is treated as a path to a value in the input object to the current state in the workflow.

If a field value starts with `func:`, the value is treated as a template function that can take literals or JSON path expressions as arguments. See the [Template Functions](#template-functions) section for more information on the available template functions.

If neither of the above conditions are met, the value is treated as a literal value.

For example, given an input object:

```json
{
  "values": [10, 405, 304, 20, 304, 20],
  "flag1": true
}
```

A payload template of:

```yaml
payloadTemplate:
    value1: "$.values[0]"
    restOfValues: "func:remove_duplicates($.values[-5:])"
    nestedStructure:
        key1: "some value"
        key2: 20
        flag: "$.flag1"
```

Will produce a payload object of:

```json
{
  "value1": 10,
  "restOfValues": [405, 304, 20],
  "nestedStructure": {
    "key1": "some value",
    "key2": 20,
    "flag": true
  }
}
```

### Template Function Syntax

The syntax for template functions can be simplified to `func:<functionName>(<arg1>, <arg2>, ..., <argN>)` in a concise form.

`<functionName>` must consist of only alphanumeric characters and underscores.

`<arg1>, <arg2>, ..., <argN>` can consist of literal values, [JSON paths](https://goessner.net/articles/JsonPath/) to values in the input object, or other function calls.

## Template Functions

The following section describes the functions that can be used in payload templates, the parameters they accept and the return types.

### `format`

This function formats a string using the provided arguments.
The use of `{}` in the format string will be replaced with the arguments in order.

**Parameters:**

`string` - The format string.
N variadic arguments - The values to replace `{}` in the format string.

**Returns:**

`string` - The formatted string.

**Examples:**

```
func:format("Hello, {}!", $.name)
```


### `jsondecode`

This function decodes a JSON string into an object, array or scalar value.

**Parameters:**

1. `string` - The JSON string to decode.

**Returns:**

`string | integer | float | boolean | object | array` - The decoded JSON value.

**Examples:**

```
func:jsondecode("{\"key\": \"value\"}")
```

### `jsonencode`

This function encodes a value as a JSON string.

**Parameters:**

1. `string | integer | float | boolean | object | array` - The value to encode as a JSON string.

**Returns:**

`string` - The JSON encoded string.

**Examples:**

```
func:jsonencode($.config)
```

### `jsonmerge`

This function merges 2 json objects together.
Any duplicate keys in the second object will overwrite the keys in the first object.

**Parameters:**

1. `object` - The first object to merge.
2. `object` - The second object to merge.

**Returns:**

`object` - The merged object.

**Examples:**

```
func:jsonmerge($.object1, $.object2)
```

### `b64encode`

This function base64 encodes a string.

**Parameters:**

1. `string` - The string to encode.

**Returns:**

`string` - The base64 encoded string.

**Examples:**

```
func:b64encode($.value)
```


### `b64decode`

This function decodes a base64 encoded string.

**Parameters:**

1. `string` - The base64 encoded string to decode.

**Returns:**

`string` - The decoded human-readable string.

**Examples:**

```
func:b64decode($.encodedValue)
```

### `hash`

This function hashes some input data using a specified algorithm.

The available hash algorithms are:
- MD5
- SHA1
- SHA256
- SHA384
- SHA512

**Parameters:**

1. `string` - The input data to hash.
2. `string` - The hash algorithm to use.

**Returns:**

`string` - The hashed data.

**Examples:**

```
func:hash($.value, "SHA256")
```

### `list`

This function creates a list from a set of positional arguments.

**Parameters:**

N positional arguments - The values to create a list from.

**Returns:**

`array` - A list of values.

**Examples:**

```
func:list(10, $.values[0], 30, $.otherValue, "Some string")
```

### `chunk_list`

This function splits a list into chunks of a specified size.

**Parameters:**

1. `array` - The list to split into chunks.
2. `integer` - The size of each chunk.

**Returns:**

`array` - A 2-dimensional array of chunks.

**Examples:**

```
func:chunk_list($.values, 5)
```

### `list_elem`

This function returns an element from a list at a specific index.

**Parameters:**

1. `array` - The list to extract the element from.

2. `integer` - The index of the element to extract.

**Returns:**

`string | integer | float | boolean | object | array | null` - The element at the specified index.

**Examples:**

```
func:list_elem($.values, 2)
```

### `remove_duplicates`

This function removes duplicates from an array of values.
The function will carry out deep equality checks for objects and arrays,
performance may be significantly impacted when working with large and complex structures.

**Parameters:**

1. `array` - The array of values to remove duplicates from.

**Returns:**

`array` - An array of unique values.

**Examples:**

```
func:remove_duplicates($.values)
```

### `contains`

This function checks if a value is present in a list or a substring is present in a string.
This will carry out deep equality checks for objects and arrays.

**Parameters:**

1. `string | array` - The list or string to check for the value or substring.

2. `string | integer | float | boolean | object | array` - The value or substring to check for.

**Returns:**

`boolean` - `true` if the value or substring is present, `false` otherwise.

**Examples:**

```
func:contains($.numbers, 10)
```

### `split`

This function splits a string into an array of substrings based on a delimiter.

**Parameters:**

1. `string` - The string to split.
2. `string` - The delimiter to split the string by.

**Returns:**

`array` - An array of substrings.

**Examples:**

```
func:split($.value, ",")
```

### `math_rand`

This function generates a random number between a minimum and maximum value.
The random number generated is an integer and the provided parameters must be integers.

:::warning
This will not generate a cryptographically secure random number,
`math_rand` should not be used in security-sensitive contexts.
:::

**Parameters:**

1. `integer` - The minimum value for the random number. (inclusive)
2. `integer` - The maximum value for the random number. (exclusive)

**Returns:**

`integer` - A random number between the minimum and maximum values.

**Examples:**

```
func:math_rand(0, 100)
```

### `math_add`

This function will add 2 numbers together.

**Parameters:**

1. `integer | float` - The first number to add.
2. `integer | float` - The second number to add.

**Returns:**

`float` - The result of the addition as a floating point number.

**Examples:**

```
func:math_add(10, 20)
```

### `math_sub`

This function will subtract the second number from the first.

**Parameters:**

1. `integer | float` - The first number to subtract from.
2. `integer | float` - The second number to subtract.

**Returns:**

`float` - The result of the subtraction as a floating point number.

**Examples:**

```
func:math_sub(20, 10)
```

### `math_mult`

This function will multiply 2 numbers together.

**Parameters:**

1. `integer | float` - The first number to multiply.
2. `integer | float` - The second number to multiply.

**Returns:**

`float` - The result of the multiplication as a floating point number.

**Examples:**

```
func:math_mult(10, 20)
```

### `math_div`

This function will divide a number by another.

**Parameters:**

1. `integer | float` - The first number to divide.
2. `integer | float` - The second number to divide by.

**Returns:**

`float` - The result of the division as a floating point number.

**Examples:**

```
func:math_div($.result[0].total, 10)
```

### `len`

This function will return the length of a string or an array.

**Parameters:**

1. `string | array` - The string or array to get the length of.

**Returns:**

`integer` - The length of the string or array.

**Examples:**

```
func:len($.values)
```

### `uuid`

This function generates a random UUID as per the [UUID version 4 specification](https://datatracker.ietf.org/doc/html/rfc9562#name-uuid-version-4).

**Parameters:**

The `uuid` function does not take any parameters.

**Returns:**

`string` - An ID in the UUID version 4 format.

**Examples:**

```
func:uuid()
```

### `nanoid`

This function provides a way to generate an ID that is shorter than a UUID while maintaining guarantees of uniqueness.

See the [nanoid](https://github.com/ai/nanoid) project repo for more information on how the IDs are generated.

:::warning
The `nanoid` function is not supported in all target environments.
:::

**Parameters:**

The `nanoid` function does not take any parameters.

**Returns:**

`string` - A unique ID in the nanoid format.

**Examples:**

```
func:nanoid()
```

## Condition Functions

The following section describes the functions that can be used in conditions for decision states and the parameters they accept.
All functions return a boolean value.

### `is_present`

This function checks if the input is present in the input object to the current state in the workflow.

**Parameters:**

1. `string` - The path to the input field to carry out a presence check. This must be a valid path of the `$.*` form laid out in the [Path Syntax](#path-syntax) section.

### `is_null`

This function checks if the input is `null`.

**Parameters:**

1. `any` - The value to check if it is `null`. This can be a path or a literal value.

### `is_numeric`

This function checks if the input is a numeric value.
A numeric value can be an integer or a floating-point number.

**Parameters:**

1. `any` - The value to check if it is numeric. This can be a path or a literal value.

### `is_string`

This function checks if the input is a string.

**Parameters:**

1. `any` - The value to check if it is a string. This can be a path or a literal value.

### `is_boolean`

This function checks if the input is a boolean value.

**Parameters:**

1. `any` - The value to check if it is a boolean. This can be a path or a literal value.

### `is_timestamp`

This function checks if the input is a timestamp.
Timestamps are strings that must conform to the [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) profile of the ISO 8601 standard.

**Parameters:**

1. `any` - The value to check if it is a timestamp. This can be a path or a literal value.

### `eq`

This function checks if two values are equal.
If the values are not of the same type, the function will always return `false`.
For example, `1` is not considered equal to `"1"`.

**Parameters:**

1. `string | integer | float | boolean | null` - The first value to compare, can be a path or a literal value.
2. `string | integer | float | boolean | null` - The second value to compare, can be a path or a literal value.

### `lt`

This function checks if the first value is less than the second value.
The values must be numeric, either integers or floating-point numbers.

**Parameters:**

1. `integer | float` - The first value to compare, can be a path or a literal value.
2. `integer | float` - The second value to compare, can be a path or a literal value.

### `gt`

This function checks if the first value is greater than the second value.
The values must be numeric, either integers or floating-point numbers.

**Parameters:**

1. `integer | float` - The first value to compare, can be a path or a literal value.
2. `integer | float` - The second value to compare, can be a path or a literal value.

### `lte`

This function checks if the first value is less than or equal to the second value.
The values must be numeric, either integers or floating-point numbers.

**Parameters:**

1. `integer | float` - The first value to compare, can be a path or a literal value.
2. `integer | float` - The second value to compare, can be a path or a literal value.

### `gte`

This function checks if the first value is greater than or equal to the second value.
The values must be numeric, either integers or floating-point numbers.

**Parameters:**

1. `integer | float` - The first value to compare, can be a path or a literal value.
2. `integer | float` - The second value to compare, can be a path or a literal value.

### `timestamp_eq`

This function checks if two timestamps are equal.

Timestamps are strings that must conform to the [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) profile of the ISO 8601 standard.

**Parameters:**

1. `string` - The first timestamp to compare, can be a path or a literal value.
2. `string` - The second timestamp to compare, can be a path or a literal value.

### `timestamp_lt`

This function checks if the first timestamp is less than the second timestamp.

Timestamps are strings that must conform to the [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) profile of the ISO 8601 standard.

**Parameters:**

1. `string` - The first timestamp to compare, can be a path or a literal value.
2. `string` - The second timestamp to compare, can be a path or a literal value.

### `timestamp_gt`

This function checks if the first timestamp is greater than the second timestamp.

Timestamps are strings that must conform to the [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) profile of the ISO 8601 standard.

**Parameters:**

1. `string` - The first timestamp to compare, can be a path or a literal value.
2. `string` - The second timestamp to compare, can be a path or a literal value.

### `timestamp_lte`

This function checks if the first timestamp is less than or equal to the second timestamp.

Timestamps are strings that must conform to the [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) profile of the ISO 8601 standard.

**Parameters:**

1. `string` - The first timestamp to compare, can be a path or a literal value.
2. `string` - The second timestamp to compare, can be a path or a literal value.

### `timestamp_gte`

This function checks if the first timestamp is greater than or equal to the second timestamp.

Timestamps are strings that must conform to the [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) profile of the ISO 8601 standard.

**Parameters:**

1. `string` - The first timestamp to compare, can be a path or a literal value.
2. `string` - The second timestamp to compare, can be a path or a literal value.

### `regex_match`

This function checks if a string matches a regular expression pattern.

**Parameters:**

1. `string` - The string to match against the regular expression pattern, can be a path or a literal value.
2. `string` - The regular expression pattern to match against.

:::warning
Regex matching is not supported in all target environments.

The following environments support regex matching:
- Celerity Workflow Runtime
- Azure Logic Apps (Via inline expressions)
- Google Cloud Workflows (Via [text.match_regex](https://cloud.google.com/workflows/docs/reference/stdlib/text/match_regex))

Regular expression syntax across different environments may vary, when switching target environments, you will need to ensure that the regular expression syntax is compatible with the new target environment.
:::

### `string_match`

This function checks if a string matches a template using `*` as a wildcard character.

The `*` wildcard character can match zero or more characters and can be used multiple times in a template.

Examples of valid templates would be:

- `*` - Matches any string.
- `prefix.*` - Matches any string that starts with `prefix.`.
- `*.log` - Matches any string that ends with `.log`.
- `prefix*.log` - Matches any string that starts with `prefix` and ends with `.log`.

Only the `*` character has special meaning in the template, all other characters are treated literally.

If the character `*` is required to be matched literally, it must be escaped with a backslash `\*`.

If the character `\` is required to be matched literally, it must be escaped with another backslash `\\`.

If the workflow definition is a part of a blueprint defined in a JSON file, the escaped string `\\*` represents `*` and `\\\\` represents `\`.

**Parameters:**

1. `string` - The string to match against the template, can be a path or a literal value.
2. `string` - The template to match against.

:::warning
String matching is not supported in all target environments.

The following environments support string matching:
- Celerity Workflow Runtime
- AWS Step Functions
- Azure Logic Apps (Via inline expressions)
:::

## Target Environments

### Celerity::1

### AWS

### AWS Serverless

### Google Cloud

### Google Cloud Serverless

### Azure

### Azure Serverless

## ⚠️ Limitations

Celerity Workflows do not support the full set of features that each cloud provider's workflow service provides. The Celerity runtime will provide a subset of features that are common across all cloud providers and are compatible with the Celerity workflow runtime.

- Parallel execution of steps is supported; however, parallel execution is limited by available compute resources when opting to deploy to an environment that runs the Celerity workflow runtime to execute workflows. In the Celerity workflow runtime, parallel execution is achieved by running multiple handlers concurrently using the [tokio runtime](https://tokio.rs/), tokio is configured to make use of multiple threads but is primarily an asynchronous runtime that uses a concurrency model optimised for efficiently using a single core to carry out I/O bound tasks. Using parallel execution for CPU-bound tasks may not have the desired effect when using the Celerity workflow runtime.
- Only handlers can be executed as steps in a workflow, not containers or third-party services, a workflow needs to be able to run end-to-end within the Celerity Workflow runtime process when deployed to a containerised or custom server environment.
- Nested workflows are not supported. A workflow can only contain handlers as steps, to get around this, you can trigger another workflow from a handler used for one of the steps and wait for the result.
- Mapping or iterating over a list of items as a part of a previous state's output is not supported in the Celerity workflow runtime. You will have to operate in the list of items within the application code of a handler that is executed as a step in the workflow.
