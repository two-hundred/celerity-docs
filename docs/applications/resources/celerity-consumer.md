---
sidebar_position: 3
---

# `celerity/consumer`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/consumer` resource type is used to define a subscriber to messages on a `celerity/topic`, an externally defined queue or message broker.

A consumer can be deployed to different target environments such as a Serverless event-driven flow[^1], a containerised environment, or a custom server.
For containerised and custom server environments, the Celerity runtime provides a polling mechanism to check for new messages in a queue or message broker.

In some target environments, infrastructure resources are created for a consumer when the `sourceId` is a Celerity topic, this will often be a queue that subscribes to the topic to implement a reliable and scalable fan-out approach.
When the `sourceId` is an external queue or message broker, the consumer is configured to listen to the external queue or message broker.

:::note
Links between consumers and topics are not supported as part of a blueprint.
The reason for this is that pub/sub systems are designed to be decouple applications and a blueprint in the context of Celerity is to define a single application.
A topic should be defined in blueprints for producer applications and a consumer should be defined in blueprints for consumer applications. The outputs of a topic can be used to configure a consumer. Multiple producers can publish to the same topic, different blueprints can define the same topic, read more about it in the [`celerity/topic` documentation](/docs/applications/resources/celerity-topic).
:::

## Annotations

Annotations define additional metadata that can determine the behaviour of the resource in relation to other resources in the blueprint or to add behaviour to a resource that is not in its spec.

### `celerity/consumer`

The following are a set of annotations that are specific to the `celerity/consumer` resource type.
These annotations are nothing to do with relationships between resources, but are used to configure the behaviour of the consumer.

<p style={{fontSize: '1.2em'}}><strong>celerity.app</strong></p>

Provides a way to group consumers together that are part of the same application.
This is especially useful when deploying to a containerised or custom server environment as it allows you to deploy multiple consumers as a part of a single deployed application.

**type**

string
___

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/consumer` resource followed by examples of different configurations for the resource type and a table outlining what each configuration value maps to in different target environments and their defaults.

### sourceId (required)

The source ID is a unique identifier for the queue or message broker that the consumer will listen to for messages.
For example, this could be a Celerity topic ID, the URL of an Amazon SQS queue, a Google Cloud Pub/Sub topic, or a name of an Azure Storage Queue.
The type of source is based on the provided target environment at build/deploy time.

**type**

string

**examples**

`celerity::topic::arn:aws:sns:us-east-1:123456789012:users-topic-NZJ5JSMVGFIE` - An Amazon SNS topic ARN prefixed with `celerity::topic::` to identify the source as a Celerity topic, which depending on the environment will require a queue to be created to subscribe to the topic. 

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

<table>
    <thead>
        <tr>
        <th>Celerity Consumer</th>
        <th>AWS SQS</th>
        <th>Google Cloud Pub/Sub</th>
        <th>Azure Storage Queue</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>batchSize</td>
        <td>batchSize (default: `10`, min: `1`, max: `10000`)</td>
        <td>N/A</td>
        <td>batchSize (default: `16`, max: `32`)</td>
        </tr>
        <tr>
        <td>visibilityTimeout</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>visibilityTimeout (default: `0s`)</td>
        </tr>
        <tr>
        <td>waitTimeSeconds</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>maxPollingInterval (default: `60s`, min: `100ms`)</td>
        </tr>
        <tr>
        <td>partialFailures</td>
        <td>functionResponseTypes</td>
        <td>N/A</td>
        <td>N/A</td>
        </tr>
    </tbody>
</table>

## Further Configuration

When deploying applications to containerised environments or custom servers, the Celerity runtime provides a polling mechanism to check for new messages in the queue or message broker.

THe runtime supports fine-tuning the polling mechanism depending on the target environment.
TODO: add link to polling mechanism configuration for the runtime

[^1]: Examples of Serverless event-driven flows include [Amazon SQS Queues triggerring AWS Lambda Functions](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html), [Google Cloud Pub/Sub triggering Google Cloud Functions](https://cloud.google.com/functions/docs/calling/pubsub), and [Azure Queue Storage triggering Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue-trigger?tabs=python-v2%2Cisolated-process%2Cnodejs-v4%2Cextensionv5&pivots=programming-language-typescript).
