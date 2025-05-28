---
sidebar_position: 10
---

# `celerity/topic`

**v2025-08-01 (draft)**

**blueprint transform:** `celerity-2025-08-01`

The `celerity/topic` resource type is used to define a topic that can be used to publish and subscribe to messages for a Celerity application. Topics are typically used in event-driven architectures to be used between applications for asynchronous communication and to allow applications to respond to infrastructure events (e.g. database changes, file uploads, etc.).

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/topic` resource followed by examples of different configurations for the resource and how topics are implemented in target environments along with additional documentation.

### name

The unique name of the topic. 
If a name is not provided, a unique name will be generated for the topic based on the blueprint that the topic is defined in.

Depending on the target environment, if `fifo` is set to `true`, the name must end with `.fifo` to indicate that the topic is a FIFO (first in, first out) topic.

:::warning
Depending on the target environment, when you specify a name, you may not be able to perform updates that require replacing the topic, if you need to replace the topic, you may need to specify a new name.
:::

**type**

string

### fifo

If set to `true`, the topic will be configured as a FIFO (first in, first out) topic. This means that messages published to the topic will be delivered to subscribers in the order they were published.

Message ordering is a subscription-level feature in some target environments (e.g. Google Cloud Pub/Sub), so this field will not always have an effect on the topic as a standalone resource but will be used when linking the topic to a queue, consumer or workflow resource.

**type**

boolean

**default**

`false`

### encryptionKeyId

The ID of the encryption key to use for encrypting messages published to the topic at rest. This is an optional field and can be used to specify a custom encryption key for the topic.

**type**

string

**examples**

`arn:aws:kms:us-east-1:123456789012:key/abcd1234-56ef-78gh-90ij-klmnopqrstuv` (AWS)

`projects/your-project-id/locations/us-east1/keyRings/your-key-ring-name/cryptoKeys/your-key-name` (Google Cloud)

`https://mykeyvault.vault.azure.net/keys/MyRSAKey/859e54971b3e4866a51595456f64f1dd` (Azure)

## Annotations

There are no annotations required for linking other resources to a `celerity/topic` resource or modifying the behaviour of a topic resource.

`linkSelector.byLabel` can be used to target topics from other resource types.

## Outputs

Outputs are computed values that are accessible via the `{resourceName}.spec.*` field accessor in a blueprint substitution.
For example, if the resource name is `myTopic`, the output would be accessible via `${myTopic.spec.id}`.

### id

The ID of the created topic in the target environment.

**type**

string

**examples**

`arn:aws:sns:us-east-1:123456789012:my-topic` (AWS)

`projects/my-project/topics/my-topic` (Google Cloud)

`my-topic` (Azure)

## Linked From

#### [`celerity/handler`](/docs/applications/resources/celerity-handler)

When a handler links out to a topic, it will be configured with permissions and environment variables that enable the handler to publish messages to the topic. If a `celerity/config` resource is associated with the handler or the application that it is a part of, the topic configuration will be added to the config/secret store instead of environment variables. You can use guides and templates to get an intuition for how to source the configuration and interact with pub/sub topic services using the handlers SDK.

:::warning Opting out of the handlers SDK for topics
You don't have to use the handlers SDK abstraction for topics,
you can also grab the populated configuration directly and interact directly with the SDK for the pub/sub topic service for the chosen target environment. Doing so will require application code changes if you decide to switch target environments.
:::

#### [`celerity/queue`](/docs/applications/resources/celerity-queue)

When a queue links out to a topic, messages received by the queue will be published to the topic. Intermediary configuration and code will be provisioned to enable message forwarding from the queue to the topic. This can be useful if a queue is used as the endpoint of a specific task that should be published to a topic for further processing or to send out notifications. 

## Links To

#### [`celerity/queue`](/docs/applications/resources/celerity-queue)

When a topic links to a queue, the queue will be configured as a subscriber to the topic. Messages published to the topic will be delivered to the queue, which can then be processed by a consumer or workflow application.

Usually, you'll link a topic directly to a consumer or workflow application as the queue (if required) will be created automatically under the hood.

#### [`celerity/consumer`](/docs/applications/resources/celerity-handler)

When a topic links to a consumer application, the consumer will be configured to receive messages published to the topic. The consumer will be wired up to a subscription that is created under the hood, which will receive messages from the topic; for some target environments, this will involve provisioning a queue.

#### [`celerity/workflow`](/docs/applications/resources/celerity-workflow)

When a topic links to a workflow application, the workflow will be configured to receive messages published to the topic. The workflow will be wired up to a subscription that is created under the hood, which will receive messages from the topic; for some target environments, this will involve provisioning a queue. This "wire up" will involve an intermediary serverless function that will receive messages via the subscription and make an API call to invoke the workflow with the message payload.

## Examples

```yaml
version: 2025-05-12
transform: celerity-2025-08-01
variables:
  encryptionKeyId:
    type: string
    description: "The ID of the encryption key to use for encrypting messages at rest."
resources:
  orderEventsTopic:
    type: "celerity/bucket"
    metadata:
      displayName: Order Events Topic
    spec:
      name: "OrderEventsTopic.fifo"
      fifo: true
      encryptionKeyId: "${variables.encryptionKeyId}"
```

## Target Environments

### Celerity::1

In the Celerity::1 local environment, a topic is implemented as a channel as a part of the [valkey pub/sub](https://valkey.io/topics/pubsub/) functionality.

A subscriber to the topic will receive messages published to the topic in the order they were published,
configuring FIFO (first in, first out) behaviour is not supported in the Celerity::1 local environment.

Valkey pub/sub provides at-most-once delivery semantics, where messages may be lost if the subscriber is not available when the message is published. When linking a `celerity/topic` with a `celerity/consumer` or `celerity/workflow`, a queue component will be created under the hood, providing stronger guarantees of message delivery; queues generated for `celerity/consumer` and `celerity/workflow` applications are implemented using [streams](https://valkey.io/topics/streams-intro/) that provide a reliable append-only log data structure.

A single instance of a valkey server is shared across the `celerity/topic`, `celerity/queue` and `celerity/cache` resource types in a Celerity application.

:::warning No encryption in local & CI environments
Topic messages are not encrypted at rest in local & CI environment, the `encryptionKeyId` field is not used.
:::

### AWS

In the AWS environment, a topic is implemented as an [Amazon SNS topic](https://docs.aws.amazon.com/sns/latest/dg/welcome.html).

For tracing, the topic will be configured with the default `PassThrough` tracing mode, which means that the topic passes through the tracing header it receives from the publisher to its subscriptions.
When using the handlers SDK in your publisher application, the tracing header will be automatically added to the messages published to the topic.

For FIFO topics, a message retention period of 7 days is set by default, this can be configured in the [`app deploy configuration`](#app-deploy-configuration) file.

Delivery status logging is disabled by default, but can be enabled and configured in the [`app deploy configuration`](#app-deploy-configuration) file.

When linking a `celerity/topic` to a `celerity/consumer` or `celerity/workflow` application resource type, an SQS queue will be created to receive messages from the topic and will be wired up to the consumer or workflow application. This allows for reliable and scalable message delivery.

:::warning FIFO topics and deduplication
Content-based deduplication is not supported for FIFO topics in the AWS environment, this is because other cloud provider implementations of FIFO (or message ordering) do not support content-based deduplication. Requiring ID/Key-based deduplication also means that the implementation of an application that uses a FIFO topic and the Celerity handlers SDK will be consistent across cloud providers.
:::

### Google Cloud

In the Google Cloud environment, a topic is implemented as a [Google Cloud Pub/Sub topic](https://cloud.google.com/pubsub/docs/overview).

For tracing, a [trace context](https://cloud.google.com/trace/docs/trace-context) is propagated through the topic, allowing for distributed tracing of messages published to the topic.
For Celerity applications that consume messages from the topic, the trace context will be extracted and used to trace the processing of the message in the consumer application using libraries such as [OpenTelemetry](https://opentelemetry.io/).

When `fifo` is set to `true`, the [message ordering](https://cloud.google.com/pubsub/docs/ordering) feature of Google Cloud Pub/Sub will be used in subscriptions to the topic. An ordering key must be provided when publishing messages to the topic to ensure that messages are delivered in the order they were published.

Message retention can be configured for topics regardless of whether they use message ordering or not, the default retention period is 7 days. This can be configured in the [`app deploy configuration`](#app-deploy-configuration) file.

When linking a `celerity/topic` to a `celerity/consumer` or `celerity/workflow` application resource type, a subscription will be created to receive messages from the topic and will be wired up to the consumer or workflow application.

### Azure

In the Azure environment, a topic is implemented as an [Azure Service Bus topic](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview#topics).

For tracing, [context](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-end-to-end-tracing?tabs=net-standard-sdk-2) is propagated through the Service Bus topic using specific payload properties based on the [W3C Trace Context](https://www.w3.org/TR/trace-context/) standard. This allows for distributed tracing of messages published to the topic.
For Celerity applications that consume messages from the topic, the trace context will be extracted and used to trace the processing of the message in the consumer application using libraries such as [OpenTelemetry](https://opentelemetry.io/).

When `fifo` is set to `true`, a service bus queue will be created using [message sessions](https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-sessions) to ensure that messages are delivered in the order they were published. A session ID must be provided when publishing messages to the topic to ensure that messages are delivered in the order they were published.

There is no built-in message retention support for Azure Service Bus topics, once a message has been successfully delivered to each subscriber, it will be removed from the queue wired up to the topic on behalf of the consumer or workflow application.

When linking a `celerity/topic` to a `celerity/consumer` or `celerity/workflow` application resource type, a Service Bus Queue will be created to subscribe to messages from the topic and will be wired up to the consumer or workflow application. Message sessions will be configured if the topic is configured as FIFO.

:::warning Azure service tiers and message sessions
Message sessions are only supported in the Standard and Premium service tiers of Azure Service Bus.
[Read about message sessions](https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-sessions).
:::

## App Deploy Configuration

Configuration specific to a target environment can be defined for `celerity/topic` resources in the [app deploy configuration](/cli/docs/app-deploy-configuration) file.

This section lists the configuration options that can be set in the `deployTarget.config` object in the app deploy configuration file.

### AWS Configuration Options

#### aws.sns.fifo.messageRetentionPeriod

The message retention period for SNS FIFO topics in AWS, in days.
This can be a period ranging from 1 to 365 days.

**Type**

integer

**Deploy Targets**

`aws`, `aws-serverless`

**Default Value**

`7`

**Minimum Value**

`1`

**Maximum Value**

`365`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.fifo.messageRetentionPeriod": 14
    }
  }
}
```

#### aws.sns.fifo.\<topic\>.messageRetentionPeriod

The message retention period for a specific SNS topic in AWS, in days.
This can be a period ranging from 1 to 365 days.
`<topic>` is the name (key) of the topic resource in the blueprint, not the topic name in AWS.

**Type**

integer

**Deploy Targets**

`aws`, `aws-serverless`

**Default Value**

`7`

**Minimum Value**

`1`

**Maximum Value**

`365`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.fifo.myTopic.messageRetentionPeriod": 14
    }
  }
}
```

#### aws.sns.statusLogging.\<index\>.failureFeedbackRoleArn

The IAM role ARN to be used when logging failed message deliveries in Amazon CloudWatch.

**Type**

string

**Deploy Targets**

`aws`, `aws-serverless`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.statusLogging.0.failureFeedbackRoleArn": "arn:aws:iam::123456789012:role/SNSFailureFeedbackRole"
    }
  }
}
```

#### aws.sns.\<topic\>.statusLogging.\<index\>.failureFeedbackRoleArn

The IAM role ARN to be used when logging failed message deliveries in Amazon CloudWatch
for a specific SNS topic in AWS.
`<topic>` is the name (key) of the topic resource in the blueprint, not the topic name in AWS.

**Type**

string

**Deploy Targets**

`aws`, `aws-serverless`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.myTopic.statusLogging.0.failureFeedbackRoleArn": "arn:aws:iam::123456789012:role/SNSFailureFeedbackRole"
    }
  }
}
```

#### aws.sns.statusLogging.\<index\>.protocol

Indicates one of the supported protocols for Amazon SNS topics.

**Type**

string

**Deploy Targets**

`aws`, `aws-serverless`

**Allowed Values**

`http` | `https` | `sqs` | `lambda` | `firehose` | `application`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.statusLogging.0.protocol": "sqs"
    }
  }
}
```

#### aws.sns.\<topic\>.statusLogging.\<index\>.protocol

Indicates one of the supported protocols for a specific Amazon SNS topic.
`<topic>` is the name (key) of the topic resource in the blueprint, not the topic name in AWS.

**Type**

string

**Deploy Targets**

`aws`, `aws-serverless`

**Allowed Values**

`http` | `https` | `sqs` | `lambda` | `firehose` | `application`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.myTopic.statusLogging.0.protocol": "sqs"
    }
  }
}
```

#### aws.sns.statusLogging.\<index\>.successFeedbackRoleArn

The IAM role ARN to be used when logging successful message deliveries in Amazon CloudWatch.

**Type**

string

**Deploy Targets**

`aws`, `aws-serverless`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.statusLogging.0.successFeedbackRoleArn": "arn:aws:iam::123456789012:role/SNSSuccessFeedbackRole"
    }
  }
}
```

#### aws.sns.\<topic\>.statusLogging.\<index\>.successFeedbackRoleArn

The IAM role ARN to be used when logging successful message deliveries in Amazon CloudWatch
for a specific SNS topic in AWS.
`<topic>` is the name (key) of the topic resource in the blueprint, not the topic name in AWS.

**Type**

string

**Deploy Targets**

`aws`, `aws-serverless`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.myTopic.statusLogging.0.successFeedbackRoleArn": "arn:aws:iam::123456789012:role/SNSSuccessFeedbackRole"
    }
  }
}
```

#### aws.sns.statusLogging.\<index\>.successFeedbackSampleRate

The percentage of successful message deliveries to be logged in Amazon CloudWatch.

**Type**

integer

**Deploy Targets**

`aws`, `aws-serverless`

**Minimum Value**

`0`

**Maximum Value**

`100`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.statusLogging.0.successFeedbackSampleRate": 50
    }
  }
}
```

#### aws.sns.\<topic\>.statusLogging.\<index\>.successFeedbackSampleRate

The percentage of successful message deliveries to be logged in Amazon CloudWatch
for a specific SNS topic in AWS.
`<topic>` is the name (key) of the topic resource in the blueprint, not the topic name in AWS.

**Type**

integer

**Deploy Targets**

`aws`, `aws-serverless`

**Minimum Value**

`0`

**Maximum Value**

`100`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
        "aws.sns.myTopic.statusLogging.0.successFeedbackSampleRate": 50
    }
  }
}
```

### Google Cloud Configuration Options

#### gcloud.pubsub.topic.messageRetentionPeriod

The message retention period for Google Cloud Pub/Sub topics.
You can disable message retention by setting this property to `disabled`.

**Type**

string

**Deploy Targets**

`gcloud`, `gcloud-serverless`

**Default Value**

`7d`

**Minimum Value**

`10m`

**Maximum Value**

`31d`

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
        "gcloud.pubsub.topic.messageRetentionPeriod": "14d"
    }
  }
}
```

#### gcloud.pubsub.topic.\<topic\>.messageRetentionPeriod

The message retention period for a specific Google Cloud Pub/Sub topic.
`<topic>` is the name (key) of the topic resource in the blueprint, not the topic name in Google Cloud.

You can disable message retention by setting this property to `disabled`.

**Type**

string

**Deploy Targets**

`gcloud`, `gcloud-serverless`

**Default Value**

`7d`

**Minimum Value**

`10m`

**Maximum Value**

`31d`

**Example**

```javascript
{
  "deployTarget": {
    "name": "gcloud",
    "appEnv": "production",
    "config": {
        "gcloud.pubsub.topic.myTopic.messageRetentionPeriod": "14d"
    }
  }
}
```
