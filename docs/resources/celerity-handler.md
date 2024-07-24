---
sidebar_position: 6
---

# `celerity/handler`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/handler` resource type is used to define a handler that processes HTTP requests, WebSocket messages or events from queues/message brokers, scheduled events, or cloud services.

Handlers can be deployed to different target environments such as FaaS[^1], containerised environments, or custom servers.
For containerised and custom server environments, the Celerity runtime is responsible for setting up the appropriate server or polling mechanism to handle incoming requests or messages and route them to the appropriate handler.

In addition to being wired up to `celerity/api`, `celerity/consumer` and `celerity/schedule` resource types, handlers can be configured directly to respond to specific events in cloud services such as object storage, database streams, and other services.

## Annotations

### `celerity/api` 🔗 `celerity/handler`

The following are a set of annotations that activate a link that can be used to configure a handler to respond to HTTP requests or WebSocket messages for a Celerity API.

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.http</strong></p>

Enables the handler to respond to HTTP requests for a Celerity API.

**type**

boolean
___

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.http.method</strong></p>

The HTTP method that the handler will respond to.

**type**

string

**allowed values**

`GET` | `POST` | `PUT` | `PATCH` | `DELETE` | `OPTIONS` | `HEAD` | `CONNECT` | `TRACE`
___

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.http.path</strong></p>

The HTTP path that the handler will respond to, this can include path parameters.

**type**

string

**examples**

`/orders`

`/orders/{order_id}`
___

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.websocket</strong></p>

Enables the handler to respond to WebSocket messages for a Celerity API.

**type**

boolean
___

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.websocket.routeKey</strong></p>

The route key that the handler will respond to for WebSocket messages.

**type**

string

**examples**

`$connect`

`$disconnect`

`$default`

`action`
___

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.guard.protectedBy</strong></p>

Enables the handler to use a specified guard for incoming requests or messages.
The guard must be defined in the linked `celerity/api` resource.

**type**

string
___

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.guard.custom</strong></p>

Marks the handler to be used as a custom guard for incoming requests or messages.

**type**

boolean

### `celerity/consumer` 🔗 `celerity/handler`

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.consumer</strong></p>

Marks the handler to be used with a consumer for incoming messages from a queue or message broker.
This is only required when there is ambiguity where a handler is linked to any combination of consumers, apis or schedules. If the handler is only linked to consumers, this annotation is not required and the default behaviour is to use the handler with the consumer.

**type**

boolean

### `celerity/schedule` 🔗 `celerity/handler`

<p style={{fontSize: '1.2em'}}><strong>celerity.handler.schedule</strong></p>

Marks the handler to be used with a schedule for handling scheduled events.
This is only required when there is ambiguity where a handler is linked to any combination of consumers, apis or schedules. If the handler is only linked to a schedule, this annotation is not required and the default behaviour is to use the handler with the consumer.

You should avoid using the same `linkSelector` for multiple schedules to avoid associating the wrong handler with a schedule, instead, it is best to be specific
in selecting the handler to associate with a schedule.

**type**

boolean

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.

### handlerName

The name to identify the handler that will be loaded by the runtime.
In FaaS[^1] target environments this will be the name of the function resource in the cloud provider.

**type**

string

**examples**

`Orders-SaveOrder-v1`


### codeLocation (required)

The location of the handler code that will be loaded by the runtime,
this can be a directory or a file path without the file extension.
In an OS-only runtime, this is expected to be a directory containing the handler binary.

**type**

string

**examples**

`./handlers`

### handler (required)

The name of the handler function that will be loaded by the runtime.
In an OS-only runtime, this is expected to be the name of the handler binary.

**type**

string

**examples**

`save_order`

### runtime (required)

The runtime that the handler will run in.
This can be any one of the [supported runtimes](#runtimes) depending on the chosen
target environment.

**type**

string

**examples**

`python3.12.x`

### memory

The amount of memory available to the handler at runtime. The default value is 128MB.
This value is used to configure the amount of memory available to the handler in a FaaS[^1] target environment. In containerised or custom server environments, the highest value across all handlers will be used as a guide to configure the memory available to the runtime.

The minimum and maximum values available depend on the target environment.

**type**

`integer`

**default value**

`128`

**examples**

`1024`

### timeout

The maximum amount of time in seconds that the handler can run for before being terminated.
This defaults to 30 seconds.

The minimum and maximum values available depend on the target environment.

**type**

`integer`

**default value**

`30`

### tracingEnabled

Whether or not to enable tracing for the handler.
The tracing behaviour will vary depending on the target environment.
Tracing is not enabled by default.

**type**

`boolean`

**default value**

`false`

### environmentVariables

A mapping of environment variables that will be available to the handler at runtime.
When a Celerity application is deployed to containerised or custom server environments, environment variables shared between functions will be merged and made available to the runtime.

:::warning
If you define an environment variable with the same key in multiple handlers, the value of the environment variable will be taken from the last handler that is loaded by the runtime.
:::

**type**

mapping[string, string]

**examples**

```yaml
envVars:
  DB_HOST: "${variables.dbHost}"
  DB_PORT: "${variables.dbPort}"
```

### events

A mapping of cloud service event configurations that the handler will respond to,
this can include events from object storage, databases, and other services.
Depending on the target environment, the handler will be wired up to the appropriate event source (e.g. AWS S3, Google Cloud Storage, Azure Blob Storage).

**type**

mapping[string, [eventConfiguration](#eventconfiguration)]

## Data Types

### eventConfiguration

Configuration for a cloud service event trigger that the handler will respond to.
This supports a limited set of event sources, such as object storage, NoSQL database streams/events, data streams and a few other services.

Due to the differences in event sources across cloud providers, the amount of options is kept minimal and as general as possible to support the most common event sources.
To support the full range of event sources, you will need to wire up an event source to a queue or message broker and use a `celerity/consumer` resource to handle the events.

#### FIELDS
___

<p style={{fontSize: '1.2em'}}><strong>sourceType (required)</strong></p>

The type of event source that the handler will respond to.

**field type**

string

**allowed values**

`objectStorage` | `dbStream` | `dataStream`
___

<p style={{fontSize: '1.2em'}}><strong>sourceConfiguration (required)</strong></p>

The event source configuration for the event source type. 

**field type**

[objectStorageEventConfiguration](#objectstorageeventconfiguration) |
[dbStreamConfiguration](#dbstreamconfiguration) |
[dataStreamConfiguration](#datastreamconfiguration)

___

### objectStorageEventConfiguration

Configuration for an object storage event trigger that the handler will respond to.
This supports object storage services such as AWS S3, Google Cloud Storage, and Azure Blob Storage based on the target environment.

#### FIELDS
___

<p style={{fontSize: '1.2em'}}><strong>event (required)</strong></p>

The object storage event that should trigger the handler.

**field type**

string

**allowed values**

`created` | `deleted` | `metadataUpdated`
___


<p style={{fontSize: '1.2em'}}><strong>bucket (required)</strong></p>

The name of the bucket that the handler will respond to events from.

**field type**

string

**examples**

`order-invoice-bucket`
___

### dbStreamConfiguration

Configuration for a database stream event trigger that the handler will respond to.
This supports NoSQL database streams/events such as DynamoDB Streams, Google Cloud Datastore, and Azure Cosmos DB based where the selected service is based on the target environment.

You can find more information about the configuration mappings for database streams in the [configuration mappings](#serverless-database-streams) section. You can also dive into how DB streams work with containerised and custom server environments [here](/docs/resources/architectures#events---cloud-service-events)

#### FIELDS
___

<p style={{fontSize: '1.2em'}}><strong>batchSize</strong></p>

The size of the batch of events to retrieve from the database stream.
The maximum value depends on the target environment, see the [configuration mappings](#serverless-database-streams) section for more details.

**field type**

integer
___

<p style={{fontSize: '1.2em'}}><strong>dbStreamId (required)</strong></p>

The ID of the database stream that the handler will respond to events from.
The format of the ID depends on the target environment, see the [configuration mappings](#serverless-database-streams) section for more details.

**field type**

string

**examples**

`arn:aws:dynamodb:us-east-1:123456789012:table/MyTable/stream/2021-07-01T00:00:00.000`
___

<p style={{fontSize: '1.2em'}}><strong>partialFailures</strong></p>

Whether partial failure reporting is supported.
When enabled, the consumer will report partial failures to the source stream,
meaning that only failed messages will be retried.

This is only supported in some target environments, see the [configuration mappings](#serverless-database-streams) section for more details.

**type**

boolean

___

<p style={{fontSize: '1.2em'}}><strong>startFromBeginning</strong></p>

Whether the handler should start processing events from the beginning of the stream (or earliest available point).

This is only supported in some target environments, see the [configuration mappings](#serverless-database-streams) section for more details.

**type**

boolean
___

### dataStreamConfiguration

Configuration for data stream event triggers that the handler will respond to.
This supports data stream services such as Amazon Kinesis and Azure Event Hubs, where the selected service is based on the target environment.

You can find more information about the configuration mappings for data streams in the [configuration mappings](#serverless-data-streams) section. You can also dive into how DB streams work with containerised and custom server environments [here](/docs/resources/architectures#events---cloud-service-events)

#### FIELDS
___

<p style={{fontSize: '1.2em'}}><strong>batchSize</strong></p>

The size of the batch of events to retrieve from the data stream.
The maximum value depends on the target environment, see the [configuration mappings](#serverless-data-streams) section for more details.

**field type**

integer
___

<p style={{fontSize: '1.2em'}}><strong>dataStreamId (required)</strong></p>

The ID of the data stream that the handler will respond to events from.
The format of the ID depends on the target environment, see the [configuration mappings](#serverless-data-streams) section for more details.

**field type**

string

**examples**

`arn:aws:kinesis:us-east-1:123456789012:stream/MyStream`
___

<p style={{fontSize: '1.2em'}}><strong>partialFailures</strong></p>

Whether partial failure reporting is supported.
When enabled, the consumer will report partial failures to the source stream,
meaning that only failed messages will be retried.

This is only supported in some target environments, see the [configuration mappings](#serverless-data-streams) section for more details.

**type**

boolean

___

<p style={{fontSize: '1.2em'}}><strong>startFromBeginning</strong></p>

Whether the handler should start processing events from the beginning of the stream (or earliest available point).

This is only supported in some target environments, see the [configuration mappings](#serverless-data-streams) section for more details.

**type**

boolean
___

## Examples

The following set of examples include different configurations for the `celerity/handler` resource type
along with resource types that can be linked to the handler resource type to add more context.


### Handlers for a HTTP API

### Handlers for a WebSocket API

### Handlers for a Hybrid API

### Handlers for a Message Queue

### Handlers for a Hybrid Application (Queue, HTTP, WebSocket)

### Handlers for Scheduled Events

### Handlers for Cloud Object Storage Events

### Handlers for Data Streams

## Runtimes

### Celerity Runtime

The Celerity runtime is used when you deploy your handlers to a containerised environment such as Kubernetes, Docker, and the container orchestration platforms that use these technologies such as Amazon ECS, Google Kubernetes Engine, and Azure Kubernetes Service.

You can choose from the following options for the Celerity runtime:

 Runtime         | Runtime ID   | Operating System     |
---------------- | ------------ | -------------------- |
 Node.js 20      | nodejs20.x   | Debian 12 (bookworm) |
 .NET 8          | dotnet8.x    | Debian 12 (bookworm) |
 Python 3.12     | python3.12.x | Debian 12 (bookworm) |
 Java 21         | java21.x     | Debian 12 (bookworm) |
 OS-only Runtime | os.deb2024   | Debian 12 (bookworm) |

### AWS Lambda Runtime

The AWS Lambda runtime is used when you deploy your handlers to AWS Lambda.
You can choose from the [supported runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtimes-supported) for AWS lambda.

### Google Cloud Functions Runtime

The Google Cloud Functions runtime is used when you deploy your handlers to Google Cloud Functions.
You can choose from the [supported runtimes](https://cloud.google.com/functions/docs/concepts/execution-environment#runtimes) for Google Cloud Functions.

:::warning
Google Cloud Functions do not support OS-only runtimes where pre-compiled binaries are used for handlers.
The only supported language in Google Cloud Functions that is compiled in other environments is Go.
:::

### Azure Functions Runtime

The Azure Functions runtime is used when you deploy your handlers to Azure Functions.
You can choose from the [supported runtimes](https://docs.microsoft.com/en-us/azure/azure-functions/supported-languages) for Azure Functions.

:::note
Azure Functions do not support OS-only runtimes where pre-compiled binaries are used for handlers in the same way as the Celerity runtime and AWS Lambda.
Azure functions do support custom handlers that are compiled light-weight HTTP servers that run in the Azure Functions runtime environment.
Celerity will map OS-only runtimes (`os.*`) to custom handlers in Azure Functions.
:::

## Configuration Mappings

### Serverless Database Streams

The following is a table of database stream configuration fields and how they map to different target environments when the Celerity application is deployed as a Serverless stream flow[^2].
Google Cloud Datastore event triggers aren't actually stream-based, but comes under database streams as is the closest analogue to DynamoDB Streams and Azure Cosmos DB Triggers.

<table>
    <thead>
        <tr>
            <th>Celerity Handler Events</th>
            <th>DynamoDB Stream Event Source for AWS Lambda</th>
            <th>Google Cloud Datastore Trigger for Cloud Functions</th>
            <th>Azure Cosmos DB Trigger for Azure Functions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>batchSize</td>
            <td>batchSize (default: `100`, max: `10000`)</td>
            <td>N/A</td>
            <td>maxItemsPerInvocation</td>
        </tr>
        <tr>
            <td>dbStreamId</td>
            <td>eventSourceArn</td>
            <td>`{database}(:{namespace})?` (Maps to event filters)</td>
            <td>`{databaseName}:{collectionName}`</td>
        </tr>
        <tr>
            <td>partialFailures</td>
            <td>functionResponseTypes</td>
            <td>N/A</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>startFromBeginning</td>
            <td>startingPosition = "TRIM_HORIZON"</td>
            <td>N/A</td>
            <td>startFromBeginning</td>
        </tr>
    </tbody>
</table>

### Serverless Data Streams

The following is a table of data stream configuration fields and how they map to different target environments when the Celerity application is deployed as a Serverless stream flow[^3].

<table>
    <thead>
        <tr>
            <th>Celerity Handler Events</th>
            <th>Kinesis Data Stream Event Source for AWS Lambda</th>
            <th>Azure Events Hub Trigger for Azure Functions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>batchSize</td>
            <td>batchSize (default: `100`, max: `10000`)</td>
            <td>maxItemsPerInvocation</td>
        </tr>
        <tr>
            <td>dataStreamId</td>
            <td>eventSourceArn</td>
            <td>[Event Hub Trigger Attributes](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-hubs-trigger?tabs=python-v2%2Cisolated-process%2Cnodejs-v4%2Cfunctionsv2%2Cextensionv5&pivots=programming-language-csharp#attributes) - will map to a combination of attributes.</td>
        </tr>
        <tr>
            <td>partialFailures</td>
            <td>functionResponseTypes</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>startFromBeginning</td>
            <td>startingPosition = "TRIM_HORIZON"</td>
            <td>N/A</td>
        </tr>
    </tbody>
</table>

[^1]: Function-as-a-Service such as AWS Lambda, Google Cloud Functions, and Azure Functions.
[^2]: Examples of Serverless stream flows include [Amazon DynamoDB Streams and AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html), [Google Cloud Datastore triggering Google Cloud Functions](https://cloud.google.com/datastore/docs/extend-with-functions-2nd-gen) and [Azure Cosmos DB Streams triggering Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb?toc=%2Fazure%2Fcosmos-db%2Ftoc.json&bc=%2Fazure%2Fcosmos-db%2Fbreadcrumb%2Ftoc.json&tabs=csharp).
[^3]: Examples of Serverless stream flows include [Amazon Kinesis Streams and AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/with-kinesis.html) and [Azure Event Hubs triggering Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-hubs?tabs=csharp).
