---
sidebar_position: 4
---

# `celerity/consumer`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/consumer` resource type is used to define an application where handlers are triggered by events in queues or message brokers.

A consumer can be deployed to different target environments such as a Serverless event-driven flow[^1], a containerised environment, or a custom server.
For containerised and custom server environments, the Celerity runtime provides a polling mechanism to check for new messages in the queue or message broker.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/consumer` resource followed by examples of different configurations for the resource type and a table outlining what each configuration value maps to in different target environments and their defaults.

### sourceId (required)

The source ID is a unique identifier for the queue or message broker that the consumer will listen to for messages.
For example, this could be the URL of an Amazon SQS queue, a Google Cloud Pub/Sub topic, or a name of an Azure Storage Queue.
The type of source is based on the provided target environment at build/deploy time.

**type**

string

**examples**

`https://sqs.us-east-1.amazonaws.com/123456789012/my-queue`

`projects/my-project/topics/my-topic`

`my-queue`

### batchSize

The size of the batch of messages to retrieve from the queue or message broker.
This value is used to configure the maximum number of messages to retrieve in a single poll operation.
Depending on the target environment, this value will be limited to different maximum values and may be ignored, see the [configuration mappings](#configuration-mappings) section for more details.

**type**

integer

### visibilityTimeout

The time in seconds that a message is hidden from other consumers after being retrieved from the queue or message broker.
Depending on the target environment, this value may be ignored, see the [configuration mappings](#configuration-mappings) section for more details.

**type**

integer

### waitTimeSeconds

The time in seconds to wait for messages to become available in the queue or message broker before polling again.
Depending on the target environment, this value may be ignored, see the [configuration mappings](#configuration-mappings) section for more details.

**type**

integer

### partialFailures

Whether partial failure reporting is supported.
When enabled, the consumer will report partial failures to the source queue or message broker,
meaning that only failed messages will be retried.

This is only supported in some target environments, see the [configuration mappings](#configuration-mappings) section for more details.

**type**

boolean

**default value**

`false`

## Examples

```yaml
version: 2023-04-20
transform: celerity-2024-07-22
variables:
    ordersQueue:
        type: string
resources:
    ordersConsumer:
        type: "celerity/consumer"
        metadata:
            displayName: Orders Consumer
        linkSelector:
            byLabel:
                application: "orders"
        spec:
            sourceId: "${variables.ordersQueue}"
            batchSize: 10
            visibilityTimeout: 30
            waitTimeSeconds: 20
            partialFailures: true
```

## Configuration Mappings

### Serverless Event-Driven Flows

The following is a table of `celerity/consumer` configuration fields and how they map to different target environments when the Celerity application is deployed as a Serverless event-driven flow[^1].

Celerity Consumer      | AWS SQS                                                  | Google Cloud Pub/Sub         | Azure Storage Queue
---------------------- | -------------------------------------------------------- | ---------------------------- | -------------------
batchSize              | batchSize (default: `10`, min: `1`, max: `10000`)        | N/A                          | batchSize (default: `16`, max: `32`)
visibilityTimeout      | N/A                                                      | N/A                          | visibilityTimeout (default: `0s`)
waitTimeSeconds        | N/A                                                      | N/A                          | maxPollingInterval (default: `60s`, min: `100ms`)
functionResponseTypes  | functionResponseTypes                                    | N/A                          | N/A


## Further Configuration

When deploying applications to containerised environments or custom servers, the Celerity runtime provides a polling mechanism to check for new messages in the queue or message broker.

THe runtime supports fine-tuning the polling mechanism depending on the target environment.
TODO: add link to polling mechanism configuration for the runtime

[^1]: Examples of Serverless event-driven flows include [Amazon SQS Queues triggerring AWS Lambda Functions](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html), [Google Cloud Pub/Sub triggering Google Cloud Functions](https://cloud.google.com/functions/docs/calling/pubsub), and [Azure Queue Storage triggering Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue-trigger?tabs=python-v2%2Cisolated-process%2Cnodejs-v4%2Cextensionv5&pivots=programming-language-typescript).
