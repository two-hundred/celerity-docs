---
sidebar_position: 7
---

# `celerity/workflow`

**v2025-04-01 (draft)**

**blueprint transform:** `celerity-2025-04-01`

The `celerity/workflow` resource type is used to define a workflow that orchestrates the execution of multiple handlers in a blueprint as a series of steps.

Workflows can be deployed to different target environments. Serverless environments will use the cloud provider's workflow service, such as AWS Step Functions, Google Cloud Workflows, or Azure Logic Apps. Containerised and custom server environments will use the Celerity workflow runtime to execute the workflow steps.

Workflows can be used to define complex logic that requires multiple steps to be executed in a specific order. Handlers can be used for states which have the type `executeStep`. Workflows can also be used to define error handling and retries for each step to create robust and fault-tolerant applications.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/workflow` resource followed by examples of different configurations for the resource type, a section outlining the behaviour in supported target environments along with additional documentation.

The specification for a workflow is influenced by the concept of a workflow as a state machine emphasised by Amazon's States Language created for AWS Step Functions.

### startAt (required)

The name of the state used to begin execution of the workflow.

**type**

string

### states (required)

A mapping of state names to state configurations that make up the state machine of the workflow.
A state configuration resembles a state in a state machine which describes decisions, transitions or the step to be executed when the state is entered.

**type**

mapping[string, [state](#state)]

## Annotations

Annotations define additional metadata that can determine the behaviour of the resource in relation to other resources in the blueprint or to add behaviour to a resource that is not in its spec.

### `celerity/vpc` 🔗 `celerity/workflow`

The following are a set of annotations that determine the behaviour of a workflow in relation to a VPC.
Appropriate security groups are managed by the VPC to workflow link.

When a VPC is not defined for the container-backed AWS, Google Cloud and Azure target environments, the default VPC for the account will be used.

VPC annotations and links do not have any effect for serverless environments.
Serverless workflows are managed by cloud provider services and do not support customer-defined VPC configurations.

:::warning
When a VPC is not defined for container-backed cloud environments, annotations in the `celerity/workflow` will apply to the default VPC for the account.
:::

<p style={{fontSize: '1.2em'}}><strong>celerity.workflow.vpc.subnetType</strong></p>

The kind of subnet that the workflow should be deployed to.

**type**

string

**allowed values**

`public` | `private`

**default value**

`public` - When a VPC links to a workflow, the workflow will be deployed to a public subnet.

___

<p style={{fontSize: '1.2em'}}><strong>celerity.workflow.vpc.lbSubnetType</strong></p>

The kind of subnet that the load balancer for the workflow should be deployed to.
This is only relevant when the workflow is deployed to an environment that requires load balancers to interact with workflows via the API.

**type**

string

**allowed values**

`public` | `private`

**default value**

`public` - When a VPC links to a workflow, the load balancer for the workflow will be deployed to a public subnet.

## Outputs

### id

The ID of the created workflow in the target environment.

**type**

string

**examples**

`arn:aws:states:us-east-1:123456789012:stateMachine:Example-StateMachine` (AWS Step Functions)

`projects/123456789012/locations/us-central1/workflows/example-workflow` (Google Cloud Workflows)

`691802b3-351e-4599-8785-2353ce970613` (Celerity Workflow Runtime)

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

The [JSON Path Injections](#json-path-injections) section provides more information as to how JSON paths behave in this context.

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

<p style={{fontSize: '1.2em'}}><strong>end</strong></p>

Marks the state as the end of a workflow or parallel branch.
This is equivalent to adding a `success` or `failure` terminal state to a workflow or parallel branch.

The field can be used for any state type **_except for_** the `failure`, `decision` or `success` states.

**field type**

string

___

<p style={{fontSize: '1.2em'}}><strong>decisions (conditionally required)</strong></p>

A list of decision rules that determine the next state to transition to based on the output of a previous state.

Each decision rule will be evaluated in order until a rule is found where the output from the previous state matches the rule's condition.

This field is required for the `decision` state type.
The field can not be used for any other state types.

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

**field type**

array[string | integer | float | boolean | array | object | null]

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

```yaml
- "someConstant"
- 20
- mapping:
    key1: "value1"
    key2: "value2"
- ["$.value", 20]
- [1, 3, 5, 10, 12, 15, 20]
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

State types that are allowed in a parallel branch are `executeStep`, `pass`, `wait`, `decision`, `failure`, and `success`. Nested parallel states are **not** supported.

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

string

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

<p style={{fontSize: '1.2em'}}><strong>interval</strong></p>

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

A positive integer value representing the maximum interval in seconds to wait between retries.

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

The [JSON Path Injections](#json-path-injections) section provides more information as to how JSON paths behave in this context.

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

When not set, the error information will be the entire output object passed into the next state.

**field type**

string

**examples**

`$.errorInfo`

___

## Linked From

#### [`celerity/vpc`](/docs/applications/resources/celerity-vpc)

Depending on the target environment, the workflow may be deployed to a VPC for private access.
When deploying to serverless environments such as AWS API Step Functions, Google Cloud Workflows, or Azure Logic Apps, the workflow will be managed by the cloud provider and will not be deployed to a VPC.

#### [`celerity/handler`](/docs/applications/resources/celerity-handler)

When a handler links out to a workflow, it will be configured with permissions and environment variables that enable the handler to trigger the workflow. If a secret store is associated with the handler or the application that it is a part of, the workflow configuration will be added to the secret store instead of environment variables. You can use guides and templates to get an intuition for how to source the configuration and trigger the workflow using the handlers SDK.

## Links To

#### [`celerity/handler`](/docs/applications/resources/celerity-handler)

Handlers are used to execute steps in a workflow. In the context of a workflow, a step is the state of the `executeStep` type. The handler is configured with [annotations](/docs/applications/resources/celerity-handler#celerityworkflow--celerityhandler) that determine the state in the workflow that will trigger the handler.

#### [`celerity/secrets`](/docs/applications/resources/celerity-secrets)

Secrets can be used to store configuration and sensitive information such as API keys, database passwords, and other credentials that are used by the application.
A workflow can link to a secret store to access secrets at runtime, linking an application to a secret store will automatically make secrets accessible to all handlers in the application without having to link each handler to the secret store.

## Examples

### Simple Workflow

```yaml
version: 2025-02-01
transform: celerity-2025-04-01
resources:
    videoIngestWorkflow:
        type: "celerity/workflow"
        linkSelector:
            byLabel:
                application: "videoIngest"
        spec:
            startAt: "downloadVideo"
            states:
                downloadVideo:
                    type: "executeStep"
                    description: "Download the video from the source URL provided in the input metadata."
                    inputPath: "$.metadata"
                    payloadTemplate:
                        videoUrl: "$.videoUrl"
                    next: "scanVideo"
                scanVideo:
                    type: "executeStep"
                    description: "Scans the video for any malicious content."
                    resultPath: "$.scanResult"
                    next: "processVideo"
                processVideo:
                    type: "executeStep"
                    description: "Process the video to create a thumbnail and extract metadata."
                    inputPath: "$.media"
                    payloadTemplate:
                        videoFilePath: "$.downloaded.path"
                    next: "success"
                success:
                    type: "success"
                    description: "The video has been successfully processed."
    
    downloadVideoHandler:
        type: "celerity/handler"
        metadata:
            displayName: "Download Video Handler"
            annotations:
                celerity.handler.workflow.state: "downloadVideo"
            labels:
                application: "videoIngest"
        spec:
            handlerName: DownloadVideoHandler-v1
            codeLocation: "handlers/video-ingest"
            handler: "downloadVideoHandler"
            runtime: "nodejs20.x"
            memory: 1024
            timeout: 60
            tracingEnabled: true

   scanVideoHandler:
        type: "celerity/handler"
        metadata:
            displayName: "Scan Video Handler"
            annotations:
                celerity.handler.workflow.state: "scanVideo"
            labels:
                application: "videoIngest"
        spec:
            handlerName: ScanVideoHandler-v1
            codeLocation: "handlers/video-ingest"
            handler: "scanVideoHandler"
            runtime: "nodejs20.x"
            memory: 2048
            timeout: 120
            tracingEnabled: true

   processVideoHandler:
        type: "celerity/handler"
        metadata:
            displayName: "Process Video Handler"
            annotations:
                celerity.handler.workflow.state: "processVideo"
            labels:
                application: "videoIngest"
        spec:
            handlerName: ProcessVideoHandler-v1
            codeLocation: "handlers/video-ingest"
            handler: "processVideoHandler"
            runtime: "nodejs20.x"
            memory: 1024
            timeout: 60
            tracingEnabled: true
```

### Complex Workflow

```yaml
version: 2025-02-01
transform: celerity-2025-04-01
resources:
    docProcessingWorkflow:
        type: "celerity/workflow"
        linkSelector:
            byLabel:
                application: "docProcessor"
        spec:
            startAt: "fetchDocument"
            states:
                fetchDocument:
                    type: "executeStep"
                    description: "Fetch the document provided in the input data."
                    inputPath: "$.document"
                    payloadTemplate:
                        url: "$.url"
                    resultPath: "$.downloaded"
                    retry:
                        - matchErrors: ["Timeout"]
                          interval: 5
                          maxAttempts: 3
                          jitter: true
                          backoffRate: 1.5
                    catch:
                        - matchErrors: ["*"]
                          next: "handleError"
                          resultPath: "$.errorInfo"
                    next: "scanDocument"

                scanDocument:
                    type: "executeStep"
                    description: "Scans the document for any malicious content."
                    resultPath: "$.scanResult"
                    retry:
                        - matchErrors: ["Timeout"]
                          interval: 5
                          maxAttempts: 3
                          jitter: true
                          backoffRate: 1.5
                    catch:
                        - matchErrors: ["*"]
                          next: "handleError"
                          resultPath: "$.errorInfo"
                    next: "scanResultDecision"

                scanResultDecision:
                    type: "decision"
                    description: "Decide the next state based on the scan result."
                    decisions:
                        - condition:
                            function: "eq"
                            inputs: ["$.scanResult", "Clean"]
                          next: "documentProcessingDecision"
                        - condition:
                            function: "eq"
                            inputs: ["$.scanResult", "Malicious"]
                          next: "maliciousContentFound"

                documentProcessingDecision:
                    type: "decision"
                    description: "Decide which document processing step to execute based on the document type."
                    inputPath: "$.downloaded"
                    decisions:
                        - condition:
                            function: "string_match"
                            inputs: ["$.path", "*.pdf"]
                          next: "processPDF"
                        - condition:
                            function: "string_match"
                            inputs: ["$.path", "*.docx"]
                          next: "processDOCX"

                processPDF:
                    type: "executeStep"
                    description: "Process the PDF document to extract text and metadata."
                    inputPath: "$.downloaded"
                    payloadTemplate:
                        filePath: "$.path"
                    resultPath: "$.extractedDataFile"
                    retry:
                        - matchErrors: ["Timeout"]
                          interval: 5
                          maxAttempts: 3
                          jitter: true
                          backoffRate: 1.5
                    catch:
                        - matchErrors: ["*"]
                          next: "handleError"
                          resultPath: "$.errorInfo"
                    next: "waitForProcessing"

                processDOCX:
                    type: "executeStep"
                    description: "Process the word document to extract text and metadata."
                    inputPath: "$.downloaded"
                    payloadTemplate:
                        filePath: "$.path"
                    resultPath: "$.extractedDataFile"
                    retry:
                        - matchErrors: ["Timeout"]
                          interval: 5
                          maxAttempts: 3
                          jitter: true
                          backoffRate: 1.5
                    catch:
                        - matchErrors: ["*"]
                          next: "handleError"
                          resultPath: "$.errorInfo"
                    next: "waitForProcessing"

                waitForProcessing:
                  type: "wait"
                  waitConfig:
                    seconds: "120"
                  next: "uploadToSystem"

                uploadToSystem:
                    type: "executeStep"
                    description: "Upload the extracted data to the system."
                    retry:
                        - matchErrors: ["Timeout"]
                          interval: 5
                          maxAttempts: 3
                          jitter: true
                          backoffRate: 1.5
                    catch:
                        - matchErrors: ["*"]
                          next: "handleError"
                          resultPath: "$.errorInfo"
                    next: "success"

                handleError:
                    type: "executeStep"
                    description: "Handle any error that occurred during the workflow, persisting status and error information to the domain-specific database."
                    inputPath: "$.errorInfo"
                    next: "failureDecision"

                failureDecision:
                    type: "decision"
                    description: "Choose the failure state to transition to based on the error type."
                    inputPath: "$.errorInfo"
                    decisions:
                        - condition:
                            function: "eq"
                            inputs: ["$.error", "DocumentFetchError"]
                          next: "fetchFailure"
                        - condition:
                            function: "eq"
                            inputs: ["$.error", "DocumentScanError"]
                          next: "scanFailure"
                        - or:
                            - function: "eq"
                              inputs: ["$.error", "ExtractPDFError"]
                            - function: "eq"
                              inputs: ["$.error", "PDFLoadError"]
                          next: "processPDFFailure"
                        - or:
                            - function: "eq"
                              inputs: ["$.error", "ExtractDOCXError"]
                            - function: "eq"
                              inputs: ["$.error", "DOCXLoadError"]
                          next: "processDOCXFailure"
                        - condition:
                            function: "eq"
                            inputs: ["$.error", "UploadToSystemError"]
                          next: "uploadToSystemFailure"

                success:
                    type: "success"
                    description: "The document has been successfully processed."

                fetchFailure:
                    type: "failure"
                    description: "The document could not be fetched."
                    failureConfig:
                      error: "DocumentFetchError"
                      cause: "The document could not be fetched from the provided URL."

                scanFailure:
                    type: "failure"
                    description: "An error occurred while scanning the document."
                    failureConfig:
                      error: "DocumentScanError"
                      cause: "An error occurred while scanning the document."

                maliciousContentFound:
                    type: "failure"
                    description: "Malicious content was found in the document."
                    failureConfig:
                      error: "MaliciousContentFound"
                      cause: "Malicious content was found in the document."

                processPDFFailure:
                    type: "failure"
                    description: "An error occurred while processing the PDF document."
                    failureConfig:
                      error: "PDFProcessingError"
                      cause: "An error occurred while processing the PDF document."

                processDOCXFailure:
                    type: "failure"
                    description: "An error occurred while processing the word document."
                    failureConfig:
                      error: "DOCXProcessingError"
                      cause: "An error occurred while processing the word document."

                uploadToSystemFailure:
                    type: "failure"
                    description: "An error occurred while uploading the extracted data to the system."
                    failureConfig:
                      error: "UploadToSystemError"
                      cause: "An error occurred while uploading the extracted data to the system."

    fetchDocumentHandler:
        type: "celerity/handler"
        metadata:
            displayName: "Fetch Document Handler"
            annotations:
                celerity.handler.workflow.state: "fetchDocument"
            labels:
                application: "documentProcessor"
        spec:
            handlerName: FetchDocumentHandler-v1
            codeLocation: "handlers/doc-processor"
            handler: "fetch_document"
            runtime: "python3.12.x"
            memory: 1024
            timeout: 60
            tracingEnabled: true

    scanDocumentHandler:
        type: "celerity/handler"
        metadata:
            displayName: "Scan Document Handler"
            annotations:
                celerity.handler.workflow.state: "scanDocument"
            labels:
                application: "documentProcessor"
        spec:
            handlerName: ScanDocumentHandler-v1
            codeLocation: "handlers/doc-processor"
            handler: "scan_document"
            runtime: "python3.12.x"
            memory: 1024
            timeout: 60
            tracingEnabled: true

    processPDFHandler:
        type: "celerity/handler"
        metadata:
            displayName: "PDF Processing Handler"
            annotations:
                celerity.handler.workflow.state: "processPDF"
            labels:
                application: "documentProcessor"
        spec:
            handlerName: ProcessPDFHandler-v1
            codeLocation: "handlers/doc-processor"
            handler: "process_pdf"
            runtime: "python3.12.x"
            memory: 4096
            timeout: 60
            tracingEnabled: true

    processDOCXHandler:
        type: "celerity/handler"
        metadata:
            displayName: "Word Document Processing Handler"
            annotations:
                celerity.handler.workflow.state: "processDOCX"
            labels:
                application: "documentProcessor"
        spec:
            handlerName: ProcessDOCXHandler-v1
            codeLocation: "handlers/doc-processor"
            handler: "process_docx"
            runtime: "python3.12.x"
            memory: 2048
            timeout: 60
            tracingEnabled: true

    systemUploadHandler:
        type: "celerity/handler"
        metadata:
            displayName: "System Upload Handler"
            annotations:
                celerity.handler.workflow.state: "uploadToSystem"
            labels:
                application: "documentProcessor"
        spec:
            handlerName: SystemUploadHandler-v1
            codeLocation: "handlers/doc-processor"
            handler: "upload_extracted_data"
            runtime: "python3.12.x"
            memory: 1024
            timeout: 30
            tracingEnabled: true
```

## Path Syntax

Paths are used to access values in the input object to the current state in the workflow.

When evaluating a path as an input for a condition, a string beginning with `$` is interpreted as a path, otherwise, the value is treated as a string literal.

The path to the input field from the previous state's output that the condition will be evaluated against.

The syntax for the path is `$.*`. `$` represents the root input object and `*` represents any key in the object.

For example, `$.value` would match the value of the key `value` in the input object.
Nested keys can also be accessed using the dot notation, for example, `$.result.id` would match the value of the `id` key in the nested `result` object.

The [JSONPath](https://goessner.net/articles/JsonPath/) syntax which is implemented for paths in Celerity workflows.

## Errors

There are a built-in set of errors that can be matched against in the retry and catch configuration for a state.

Built-in errors that can be retried include the following:

- `*` - Matches all errors that can be retried.
- `Timeout` - The handler execution timed out.
- `HandlerFailed` - The handler execution failed.
- `InvalidResultPath` - The result path specified in the state configuration is invalid.
- `InvalidOutputPath` - The output path specified in the state configuration is invalid.
- `BranchesFailed` - One or more branches of a parallel state failed.

Built-in errors that can be caught include the following:

- `*` - Matches all errors that can be caught.
- `Timeout` - The handler execution timed out.
- `HandlerFailed` - The handler execution failed.
- `InvalidResultPath` - The result path specified in the state configuration is invalid. _It's important to note that an invalid result path error that occurs in a catcher can not be caught._
- `InvalidOutputPath` - The output path specified in the state configuration is invalid.
- `BranchesFailed` - One or more branches of a parallel state failed.
- `InvalidInputPath` - The input path specified in the state configuration is invalid.
- `InvalidPayloadTemplate` - The payload template specified in the state configuration is invalid.
- `PayloadTemplateFailure` - An error occurred while constructing the payload using the payload template, often an issue with a template function call.
- `NoDecisionMatched` - No decision rule matched in a decision state.
- `InvalidCondition` - The condition specified in a decision rule is invalid.

These errors will map to the closest corresponding built-in error type in the target environment.

### Error Output

When an error is caught by a state, the catcher will yield an object with the following structure in the Celerity workflow runtime:

```json
{
  "error": "ErrorName",
  "cause": "Error cause message"
}
```

This can be added to the input object passed to the next state using the `resultPath` field.

For example:

```yaml
catch:
    - matchErrors: ["*"]
      next: "handleError"
      resultPath: "$.errorInfo"
```

Will result in an object like the following:

```json
{
  "otherField": "some value",
  "errorInfo": {
    "error": "Some error message",
    "cause": "Some cause"
  }
}
```

This will be passed into the next state as the input object.

:::warning
This exact error structure is only available in the Celerity workflow runtime, the error structure will map to the
closest corresponding structure in serverless target environments such as AWS Step Functions, Google Cloud Workflows, and Azure Logic Apps.
:::

## JSON Path Injections

States and catchers can have a `resultPath` field that is used to inject the result of the state or error into the input object passed to the next state.

There are limitations around how JSON paths behave in this context;
JSON path injection only supports injecting values into fields of the root JSON object.
The `$.<field>` and `$['<field>']` syntax is supported for injecting values into fields of the root object.

:::warning
The behaviour outlined above is that of the Celerity workflow runtime.
In serverless target environments where a cloud service such as AWS Step Functions
is used to run the workflow, the behaviour may differ. Where possible, it is best to keep
JSON path injections simple, where values are injected into fields in the root object.
:::

##  Payload Template

The payload template is a mapping structure that can be used to construct a payload to be passed into the handler configured to be executed for the current state.

If a field value starts with `$`, the value is treated as a path to a value in the input object to the current state in the workflow.

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

The syntax for template functions can be simplified to `func:<functionName>(<arg1>, <arg2>, ..., <argN>)` in a concise form; `func:` is the prefix that indicates the preceding value is a function call.

`<functionName>` must consist of only alphanumeric characters and underscores.

`<arg1>, <arg2>, ..., <argN>` can consist of scalar literal values, [JSON paths](https://goessner.net/articles/JsonPath/) to values in the input object, or other function calls.

Scalar literal values refer to string, integer, float, boolean, or null values.

The formalised grammar for the template function syntax that comes after the `func:` prefix is as follows:

```
function call    =  name , "(" , function args , ")" ;
function args    =  [ function arg , { "," , function arg } ] ;
function arg     =  literal | json path | function call ;
literal          =  bool literal | null literal | float literal | int literal | string literal ;
json path        = ? valid json path ? ;

# Lex tokens

string literal   =  '"' , string chars , '"' ;
bool literal     = "true" | "false" ;
null literal     = "null" ;
int literal      =  [ "-" ] , natural number ;
float literal    =  [ "-" ] , natural number , "." , natural number ;
natural number   =  { digit }- ;
string chars     =  { string char } ;
string char      =  ? utf-8 char excluding quote ? | escaped quote ;
escaped quote    =  "\" , '"' ;
name             =  start name char , name chars ;
name chars       =  { name char } ;
name char        =  letter | digit | "_" ;
start name char  =  letter | "_" ;
letter           =  ? [A-Za-z] ? ;
digit            =  ? [0-9] ? ;
```

The above is a representation of the grammar in [Extended Backus-Naur form](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) notation.

JSON paths are parsed using the syntax defined in the [JSONPath](https://goessner.net/articles/JsonPath/) specification.

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
- SHA256
- SHA384
- SHA512

_MD5 and SHA1 were considered in the original design but were not included due to the insecurity of these algorithms._

**Parameters:**

1. `string` - The input data to hash.
2. `string` - The hash algorithm to use.

**Returns:**

`string` - The hashed data as a hex string.

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
This will **not** generate a cryptographically secure random number,
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

In the Celerity::1 local environment, a workflow is deployed as a containerised version of the Celerity workflow runtime in a local container orchestrator.
In the local environment, the runtime is backed by an [Apache Cassandra](https://cassandra.apache.org/_/index.html) NoSQL database for storing workflow execution state.
Links from VPCs to APIs are ignored for this environment as the workflow is deployed to a local container network on a developer or CI machine.

### AWS

In the AWS environment, workflows are deployed as a containerised version of the Celerity workflow runtime.

Workflows can be deployed to [ECS](https://aws.amazon.com/ecs/) or [EKS](https://aws.amazon.com/eks/) backed by [Fargate](https://aws.amazon.com/fargate/) or [EC2](https://aws.amazon.com/ec2/) using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the AWS target environment.

The workflow runtime requires persistence for storing workflow execution state, this is provided by a set of DynamoDB tables that are created when the workflow is deployed. The DynamoDB tables are provisioned with on-demand capacity mode by default, this can be changed to provisioned capacity mode in the deploy configuration.

:::note
DynamoDB was chosen as the persistence layer for the workflow runtime in AWS environments as it provides a scalable and highly available NoSQL database that is more than sufficient for the requirements of the workflow runtime.
This also removes the need to manage a relational database cluster for each workflow-based application that is deployed.
:::

#### ECS

When a workflow is first deployed to ECS, a new cluster is created for the workflow.
A service is provisioned within the cluster to run the application.
A public-facing application load balancer is created to route traffic to the service, if you require private access to the workflow API, the load balancer can be configured to be internal.
When domain configuration is provided and the load balancer is public-facing, an [ACM](https://aws.amazon.com/certificate-manager/) certificate is created for the domain and attached to the load balancer, you will need to verify the domain ownership before the certificate can be used.

The service is deployed with an auto-scaling group that will scale the number of tasks running the workflow based on the CPU and memory usage of the tasks. The auto-scaling group will scale the desired task count with a minimum of 1 task and a maximum of 5 tasks by default. If backed by EC2, the auto-scaling group will scale the number instances based on the CPU and memory usage of the instances with a minimum of 1 instance and a maximum of 3 instances by default. Deploy configuration can be used to override this behaviour.

When it comes to networking, ECS services need to be deployed to VPCs; if a VPC is defined in the blueprint and linked to the workflow, it will be used, otherwise the default VPC for the account will be used. The load balancer will be placed in the public subnet by default, but can be configured to be placed in a private subnet by setting the `celerity.workflow.vpc.lbSubnetType` annotation to `private`. The service for the application will be deployed to a public subnet by default, but can be configured to be deployed to a private subnet by setting the `celerity.workflow.vpc.subnetType` annotation to `private`.
By default, 2 private subnets and 2 public subnets are provisioned for the associated VPC, the subnets are spread across 2 availability zones, the ECS resources that need to be associated with a subnet will be associated with these subnets, honouring the workflow subnet type defined in the annotations.

The CPU to memory ratio used by default for AWS deployments backed by EC2 is that of the `t3.*` instance family. The auto-scaling launch configuration will use the appropriate instance type based on the requirements of the application, these requirements will be taken from the deploy configuration or derived from the handlers configured for the workflow. If the requirements can not be derived, the instance profile will be `t3.small` with 2 vCPUs and 2GB of memory.

Fargate-backed ECS deployments use the same CPU to memory ratios allowed for Fargate tasks as per the [task definition parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size).

If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. 
For an EC2-backed cluster, the task housing the containers that make up the service for the workflow will be deployed with 896MB of memory and 0.8 vCPUs. Less than half of the memory and CPU is allocated to the EC2 instance to allow for smooth deployments of new versions of the workflow, this is done by making sure there is enough memory and CPU available to the ECS agent.
For a Fargate-backed cluster, the task housing the containers that make up the service for the workflow application will be deployed with 1GB of memory and 0.5 vCPUs.

A sidecar [ADOT collector](https://aws-otel.github.io/docs/getting-started/collector) container is deployed with the workflow to collect traces and metrics for the application, this will take up a small portion of the memory and CPU allocated to the application. Traces are always collected for workflow executions, however, they are only collected for handlers when tracing is enabled for the handler.

#### EKS

When a workflow is first deployed to EKS, a new cluster is created for the workflow unless you specify an existing cluster to use in the deploy configuration.

:::warning using existing clusters
When using an existing cluster, the cluster must be configured in a way that is compatible with the VPC annotations configured for the workflow as well as the target compute type.
For example, a cluster without a Fargate profile can not be used to deploy a workflow that is configured to use Fargate. Another example would be a cluster with a node group only associated with public subnets not being compatible with a workflow with the `celerity.workflow.vpc.subnetType` annotation set to `private`.
You also need to make sure there is enough memory and CPU allocated for node group instances to run the application in addition to other workloads running in the cluster.
:::

The cluster is configured with a public endpoint for the Kubernetes API server by default, this can be overridden to be private in the deploy configuration. (VPC links will be required to access the Kubernetes API server when set to private)

For an EKS cluster backed by EC2, a node group is configured with auto-scaling configuration to have a minimum size of 2 nodes and a maximum size of 5 nodes by default. Auto-scaling is handled by the [Kubernetes Cluster Autoscaler](https://github.com/kubernetes/autoscaler#kubernetes-autoscaler). The instance type configured for node groups is determined by the CPU and memory requirements defined in the deploy configuration or derived from the handlers of the workflow, if the requirements can not be derived, the instance type will be `t3.small` with 2 vCPUs and 2GB of memory.

For an EKS cluster backed by Fargate, a [Fargate profile](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html) is configured to run the workflow.

Once the cluster is up and running, Kubernetes services are provisioned to run the application, an Ingress service backed by an application load balancer is created to route traffic to the service, if you require private access to the workflow, the load balancer can be configured to be internal. When domain configuration is provided and the load balancer is public-facing, an [ACM](https://aws.amazon.com/certificate-manager/) certificate is created for the domain and attached to the ingress service via annotations, you will need to verify the domain ownership before the certificate can be used.

When it comes to networking, EKS services need to be deployed to VPCs; if a VPC is defined in the blueprint and linked to the workflow, it will be used, otherwise the default VPC for the account will be used.
The ingress service backed by an application load balancer will be placed in the public subnet by default, but can be configured to be placed in a private subnet by setting the `celerity.workflow.vpc.lbSubnetType` annotation to `private`.

By default, 2 private subnets and 2 public subnets are provisioned for the associated VPC, the subnets are spread across 2 availability zones. For EC2-backed clusters, the EKS node group will be associated with all 4 subnets when `celerity.workflow.vpc.subnetType` is set to `public`; when `celerity.api.vpc.subnetType` is set to `private`, the node group will only be associated with the 2 private subnets. The orchestrator will take care of assigning one of the subnets defined for the node group.

For Fargate-backed clusters, the Fargate profile will be associated with the private subnets due to the [limitations with Fargate profiles](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html). For Fargate, the workflow will be deployed to one of the private subnets associated with the profile. 

:::warning
`celerity.workflow.vpc.subnetType` has no effect for Fargate-based EKS deployments, the workflow application will always be deployed to a private subnet.
:::

If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set.
For an EC2-backed cluster, the containers that make up the service for the workflow will be deployed with 896MB of memory and 0.8 vCPUs. Less than half of the memory and CPU is allocated to a node that will host the containers to allow for smooth deployments of new versions of the workflow, this is done by making sure there is enough memory and CPU available to the Kubernetes agents.
For a Fargate-backed cluster, the pod for the application will be deployed with 1GB of memory and 0.5 vCPUs, for Fargate there are a [fixed set of CPU and memory configurations](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html) that can be used.

A sidecar [ADOT collector](https://aws-otel.github.io/docs/getting-started/collector) container is deployed in the pod with the workflow application to collect traces and metrics for the application, this will take up a small portion of the memory and CPU allocated to the workflow. Traces are always collected for workflow executions, however, they are only collected for handlers when tracing is enabled for the handler.

### AWS Serverless

In the AWS Serverless environment, workflows are deployed to AWS Step Functions with AWS Lambda for the handlers.

When tracing is enabled for handlers, an [ADOT lambda layer](https://aws-otel.github.io/docs/getting-started/lambda) is bundled with and configured to instrument each handler to collect traces and metrics.
AWS Step Functions traces are collected in AWS X-Ray, Step Functions specific traces can be collected in to tools like Grafana with plugins that use AWS X-Ray as a data source.

Workflows can be deployed to Step Functions using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the AWS Serverless target environment.

### Google Cloud

In the Google Cloud environment, workflows are deployed as a containerised version of the Celerity workflow runtime.

Workflows can be deployed to [Cloud Run](https://cloud.google.com/run), as well as [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) in [Autopilot](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview) or [Standard](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-regional-cluster) mode using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the Google Cloud target environment.

The workflow runtime requires persistence for storing workflow execution state, this is provided by a set of Cloud Datastore entities that are created when the workflow is deployed.

:::note
Cloud Datastore was chosen as the persistence layer for the workflow runtime in Google Cloud environments as it provides a scalable and highly available NoSQL database that is more than sufficient for the requirements of the workflow runtime.
This also removes the need to manage a relational database cluster for each workflow-based application that is deployed.
:::

#### Cloud Run

Cloud Run is a relatively simple environment to deploy workflows to, the workflow is deployed as a containerised application that is fronted by either an internal or external load balancer.

Autoscaling is configured with the use of Cloud Run annotations through `autoscaling.knative.dev/minScale` and `autoscaling.knative.dev/maxScale` [annotations](https://cloud.google.com/run/docs/reference/rest/v1/ObjectMeta). The knative autoscaler will scale the number of instances based on the number of requests and the CPU and memory usage of the instances. By default, the application will be configured to scale the number of instances with a minimum of 1 instance and a maximum of 5 instances. Deploy configuration can be used to override this behaviour.

When domain configuration is provided and the load balancer is public-facing and Google-managed, a [managed TLS certificate](https://cloud.google.com/load-balancing/docs/ssl-certificates) is created for the domain and attached to the load balancer, you will need to verify the domain ownership before the certificate can be used.

For Cloud Run, the workflow will not be associated with a VPC, defining custom VPCs for Cloud Run applications is not supported. Creating and linking a VPC to the workflows will enable the `Internal` networking mode in the [network ingress settings](https://cloud.google.com/run/docs/securing/ingress). `celerity.workflow.vpc.subnetType` has no effect for Cloud Run deployments, the application will always be deployed to a network managed by Google Cloud. Setting `celerity.workflow.vpc.lbSubnetType` to `private` will have the same affect as attaching a VPC to the application, making the application load balancer private. Setting `celerity.workflow.vpc.lbSubnetType` to `public` will have the same effect as not attaching a VPC to the workflow, making the application load balancer public. `public` is equivalent to the "Internal and Cloud Load Balancing" [ingress setting](https://cloud.google.com/run/docs/securing/ingress#settings).

Memory and CPU resources allocated to the workflow can be defined in the deploy configuration, when not defined, memory and CPU will be derived from the handlers configured for the workflow.
If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. The Cloud Run service will be allocated a limit of 1GB of memory and 1 vCPU per instance.

A sidecar [OpenTelemetry Collector](https://github.com/GoogleCloudPlatform/opentelemetry-cloud-run) container is deployed in the service with the workflow to collect traces and metrics, this will take up a small portion of the memory and CPU allocated to the workflow. Traces will always be collected for Workflow executions, however, they are only collected for handlers when tracing is enabled for the handler.

#### GKE

When a workflow is first deployed to GKE, a new cluster is created for the workflow unless you specify an existing cluster to use in the deploy configuration.

:::warning Using existing clusters
When using an existing cluster, the cluster must be configured in a way that is compatible with the VPC annotations configured for the application as well as the target compute type.
:::

When in standard mode, the cluster will be regional with 2 zones for better availability guarantees. A node pool is created with autoscaling enabled, by default, the pool will have a minimum of 1 node and a maximum of 3 nodes per zone. As the cluster has 2 zones, this will be a minimum of 2 nodes and a maximum of 6 nodes overall. The [cluster autoscaler](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-autoscaler) is used to manage scaling and choosing the appropriate instance type to use given the requirements of the workflow service. The minimum and maximum number of nodes can be overridden in the deploy configuration.

When in autopilot mode, Google manages scaling, security and node pools. Based on memory and CPU limits applied at the pod-level, appropriate node instance types will be selected and will be scaled automatically. There is no manual autoscaling configuration when running in autopilot mode, GKE Autopilot is priced per pod request rather than provisioned infrastructure, depending on the nature of your workloads, it could be both a cost-effective and convenient way to run your applications. [Read more about autopilot mode pricing](https://cloud.google.com/kubernetes-engine/pricing#autopilot_mode).

When domain configuration is provided and the load balancer that powers the Ingress service is public-facing and Google-managed, a [managed TLS certificate](https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs) is created for the domain and attached to the Ingress object, you will need to verify the domain ownership before the certificate can be used.

When it comes to networking, a GKE cluster is deployed as a [private cluster](https://cloud.google.com/kubernetes-engine/docs/concepts/private-cluster-concept), nodes that the pods for the workflow run on only use internal IP addresses, isolating them from the public internet. The Control plane has both internal and external endpoints, the external endpoint can be disabled from the Google Cloud/Kubernetes side. When `celerity.workflow.vpc.lbSubnetType` is set to `public`, an [Ingress](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress) service is provisioned using an external Application Load Balancer. When `celerity.workflow.vpc.lbSubnetType` is set to `private`, an Ingress service is provisioned using an internal Application Load Balancer. The Ingress service is used to route traffic from the public internet to the service running the workflow.

:::warning
`celerity.workflow.vpc.subnetType` has no effect for GKE clusters, the application will always be deployed to a private network, the workflow API is exposed through the ingress service if the ingress is configured to be public.
:::

If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. Limits of 1GB of memory and 0.5 vCPUs will be set for the pods that run the workflow.

The [OpenTelemetry Operator](https://cloud.google.com/blog/topics/developers-practitioners/easy-telemetry-instrumentation-gke-opentelemetry-operator/) is used to configure a sidecar collector container for the workflow to collect traces and metrics. Traces will always be collected for workflow executions, however, they are only collected for handlers when tracing is enabled for the handler.

### Google Cloud Serverless

In the Google Cloud Serverless environment, workflows are deployed as Google Cloud Workflows with Google Cloud Functions for the handlers.

For tracing, the built-in Google Cloud metrics and tracing offerings will be used to collect traces and metrics for the handlers. Traces and metrics can be collected into tools like Grafana with plugins that use Google Cloud Trace as a data source. Logs and metrics are captured out of the box for the Cloud Workflows and will be collected in Google Cloud Logging and Monitoring. You can export logs and metrics to other tools like Grafana with plugins that use Google Cloud Logging and Monitoring as a data source.

Workflows can be deployed to Google Cloud Workflows using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the Google Cloud Serverless target environment.

### Azure

In the Azure environment, workflows are deployed as a containerised version of the Celerity workflow runtime.

Workflows can be deployed to [Azure Container Apps](https://azure.microsoft.com/en-us/products/container-apps/) or [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/products/kubernetes-service) using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the Azure target environment.

The workflow runtime requires persistence for storing workflow execution state, this is provided by Azure Cosmos DB resources that are created when the workflow is deployed.
The workflow runtime uses the [Cassandra API for Cosmos DB](https://learn.microsoft.com/en-us/azure/cosmos-db/cassandra/introduction).

:::note
Cosmos DB was chosen as the persistence layer for the workflow runtime in Azure environments as it provides a scalable and highly available NoSQL database that is more than sufficient for the requirements of the workflow runtime.
This also removes the need to manage a relational database cluster for each workflow-based application that is deployed.
:::

#### Container Apps

Container Apps is a relatively simple environment to deploy applications to, the workflow is deployed as a containerised application that is fronted by either external HTTPS ingress or internal ingress.

Autoscaling is determined based on the number of concurrent HTTP requests for public APIs, for private  workflow APIs [KEDA-supported](https://keda.sh/docs/2.15/scalers/) CPU and memory scaling triggers are used. By default, the [scale definition](https://learn.microsoft.com/en-us/azure/container-apps/scale-app?pivots=azure-cli#scale-definition) is set to scale from 1 to 5 replicas per revision, this can be overridden in the deploy configuration.

When domain configuration is provided and the workflow API is configured to be public-facing, a [managed TLS certificate](https://learn.microsoft.com/en-us/azure/container-apps/custom-domains-managed-certificates?pivots=azure-portal) is provisioned and attached to the Container App's HTTP ingress configuration. You will need to verify the domain ownership before the certificate can be used. 

Container Apps will not be associated with a private network by default, a VNet is automatically generated for you and generated VNets are publicly accessible over the internet. [Read about networking for Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/networking?tabs=workload-profiles-env%2Cazure-cli). When you define a VPC and link it to the workflow, a custom VNet will be provisioned and the workflow will be deployed to either a private or public subnet based on the `celerity.workflow.vpc.subnetType` annotation, defaulting to a public subnet if not specified. When the `celerity.workflow.vpc.lbSubnetType` is set to `public`, a public HTTPS ingress is provisioned for the API; when set to `private`, an internal HTTP ingress is provisioned for the workflow. Azure's built-in [zone redundancy](https://learn.microsoft.com/en-us/azure/reliability/reliability-azure-container-apps?tabs=azure-cli) is used to ensure high availability of the workflow API.

Memory and CPU resources allocated to the workflow can be defined in the deploy configuration, when not defined, memory and CPU will be derived from the handlers configured for the workflow. If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. The Container App service will be allocated a limit of 1GB of memory and 0.5 vCPU per instance in the consumption plan, [see allocation requirements](https://learn.microsoft.com/en-us/azure/container-apps/containers#allocations).

The [OpenTelemetry Data Agent](https://learn.microsoft.com/en-us/azure/container-apps/opentelemetry-agents?tabs=arm) is used to collect traces and metrics for the application. Traces will always be collected for workflow executions, however, they are only collected for handlers when tracing is enabled for the handler.

#### AKS

When a workflow is first deployed to AKS, a new cluster is created for the workflow unless you specify an existing cluster to use in the deploy configuration.

:::warning Using existing clusters
When using an existing cluster, it must be configured in a way that is compatible with the VPC annotations configured for the workflow as well as the target compute type.
:::

The cluster is created across 2 availability zones for better availability guarantees. Best effort zone balancing is used with [Azure VM Scale Sets](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones?tabs=portal-2#zone-balancing). The cluster is configured with an [autoscaler](https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler?tabs=azure-cli) with a minimum of 2 nodes and a maximum of 5 nodes
distributed across availability zones as per Azure's zone balancing. The default node size is `Standard_D4d_v5` with 4 vCPUs and 16GB of memory, this size is chosen because of the [minimum requirements for system Node Pools](https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli#system-and-user-node-pools) and in the default configuration a single node pool is shared by the system and user workloads. If the CPU or memory requirements of the application mean the default node size would not be able to comfortably run 2 instances of the workflow application, a larger node size will be selected.
Min and max node count along with the node size can be overridden in the deploy configuration.

When domain configuration is provided and the load balancer that powers the Ingress service is public-facing, a TLS certificate is generated with [Let's Encrypt](https://letsencrypt.org/) via [cert-manager](https://cert-manager.io/docs/installation/helm/) to provision certificates for domains associated with Ingress resources in Kubernetes. The certificate is used by the Ingress object to terminate TLS traffic. You will need to verify the domain ownership before the certificate can be used.

When it comes to networking, the workflow will be deployed with the overlay network model in a public network as per the default AKS access mode. [Read about private and public clusters for AKS](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/public-and-private-aks-clusters-demystified/ba-p/3716838).
When you define a VPC and link it to the workflow, the application will be deployed as a private cluster using the VNET integration feature of AKS where the control plane will not be made available through a public endpoint. The `celerity.workflow.vpc.subnetType` annotation has **no** effect for AKS deployments as the networking model for Azure with it's managed Kubernetes offering is different from other cloud providers and all services running on a cluster are private by default, exposed to the internet through a load balancer or ingress controller. When `celerity.workflow.vpc.lbSubnetType` is set to `public`, an Ingress service is provisioned using the [nginx ingress controller](https://learn.microsoft.com/en-us/azure/aks/app-routing) that uses an external Azure Load Balancer under the hood. When `celerity.workflow.vpc.lbSubnetType` is set to `private`, the nginx Ingress controller is configured to use an internal Azure Load Balancer, [read more about the private ingress controller](https://learn.microsoft.com/en-us/azure/aks/create-nginx-ingress-private-controller).

Memory and CPU resources allocated to the workflow pod can be defined in the deploy configuration, if not specified, the workflow will derive memory and CPU from handlers configured for the application.
If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. The pod that runs the workflow will be allocated a limit of 1GB of memory and 0.5 vCPUs.

The [OpenTelemetry Operator](https://opentelemetry.io/docs/kubernetes/operator/) is used to configure a sidecar collector container for the workflow application to collect traces and metrics. Traces will always be collected for workflow executions, however, they are only collected for handlers when tracing is enabled for the handler.

### Azure Serverless

In the Azure Serverless environment, workflows are deployed as Azure Logic Apps with Azure Functions for the handlers.

Azure Monitor Metrics and Azure Monitor Logs can be used as sources for traces, logs and metrics for the Logic App. This data can be exported to other tools like Grafana with plugins that use Azure Monitor as a data source.
When it comes to the Azure Functions that power the endpoints, traces and metrics go to Application Insights by default, from which you can export logs, traces and metrics to other tools like Grafana with plugins that use Azure Monitor as a data source.
[OpenTelemetry for Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/opentelemetry-howto?tabs=otlp-export&pivots=programming-language-csharp) is also supported for some languages, you can use the deploy configuration to enable OpenTelemetry for Azure Functions.

Workflows can be deployed to Azure Logic Apps using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the Azure Serverless target environment.

## ⚠️ Limitations

Celerity Workflows do not support the full set of features that each cloud provider's workflow service provides. The Celerity runtime will provide a subset of features that are common across all cloud providers and are compatible with the Celerity workflow runtime.

- Parallel execution of steps is supported; however, parallel execution is limited by available compute resources when opting to deploy to an environment that runs the Celerity workflow runtime to execute workflows. In the Celerity workflow runtime, parallel execution is achieved by running multiple handlers concurrently using the [tokio runtime](https://tokio.rs/), tokio is configured to make use of multiple threads but is primarily an asynchronous runtime that uses a concurrency model optimised for efficiently using a single core to carry out I/O bound tasks. Using parallel execution for CPU-bound tasks may not have the desired effect when using the Celerity workflow runtime.
- Only handlers can be executed as steps in a workflow, not containers or third-party services, a workflow needs to be able to run end-to-end within the Celerity Workflow runtime process when deployed to a containerised or custom server environment.
- Nested workflows are not supported. A workflow can only contain handlers as steps, to get around this, you can trigger another workflow from a handler used for one of the steps and wait for the result.
- Mapping or iterating over a list of items as a part of a previous state's output is not supported in the Celerity workflow runtime. You will have to operate in the list of items within the application code of a handler that is executed as a step in the workflow.
- Celerity workflows only support handlers of the `celerity/handler` resource type for the `executeStep` state type. For integrations with cloud provider services, you will either need to use the cloud provider's workflow service or use a handler that can interact with the cloud provider's API. Celerity provides a library of handler templates for service integrations for cloud providers and other third-party services; see [Workflow Integrations](/docs/applications/workflow-integrations/intro) for more information.
