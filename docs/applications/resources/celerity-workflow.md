---
sidebar_position: 7
---

# `celerity/workflow`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/workflow` resource type is used to define a workflow that orchestrates the execution of multiple handlers in a blueprint as a series of steps.

Workflows can be deployed to different target environments. Serverless environments will use the cloud provider's workflow service, such as AWS Step Functions, Google Cloud Workflows, or Azure Logic Apps. Containerised and custom server environments will use the Celerity workflow runtime to execute the workflow steps.

Workflows can be used to define complex logic that requires multiple steps to be executed in a specific order. Each step in a workflow can be a handler. Workflows can also be used to define error handling and retries for each step to create robust and fault-tolerant applications.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/workflow` resource followed by examples of different configurations for the resource type, a section outlining the behaviour in supported target environments along with additional documentation.

The specification for a workflow is influenced by the concept of a workflow as a state machine emphasised by Amazon's States Language created for AWS Step Functions.

### states (required)

A mapping of state names to state configurations that make up the state machine of the workflow.
A state configuration resembles a state in a state machine which describes conditions/choices, transitions or the step to be executed when the state is entered.

**type**

mapping[string, [stateConfiguration](#stateconfiguration)]

## Annotations

## Outputs

## Data Types

### stateConfiguration

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

<p style={{fontSize: '1.2em'}}><strong>next (conditionally required)</strong></p>

The next state to transition to after the current state is executed.

This field is required for `executeStep`, `pass`, and `wait` states if `end` is not set to `true`.
The next field can not be used for `failure`, `decision` or `success` states.
**field type**

string

**allowed values**

`executeStep` | `decision` | `failure` | `success`

___

## Linked From

## Links To

## Examples

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
