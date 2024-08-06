---
sidebar_position: 7
---

# `celerity/handlerConfig`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/handlerConfig` resource type is used to define shared configuration for a set of handlers.

This is useful for sharing configurations between multiple handlers in a blueprint.

:::note
The [`metadata.sharedHandlerConfig`](/docs/resources/celerity-handler#sharing-handler-configuration) approach may be preferred when you want all handlers in the blueprint to share the same default configuration.
:::

## Annotations

There are no annotations required for linking other resources to a `celerity/handlerConfig` resource.
`linkSelector.byLabel` can be used to target configuration resources for specific handlers based on their labels.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.


### codeLocation

The location of the handler code that will be loaded by the runtime,
this can be a directory or a file path without the file extension.
In an OS-only runtime, this is expected to be a directory containing the handler binary.

**type**

string

**examples**

`./handlers`

### runtime

The runtime that handlers will run in.
This can be any one of the [supported runtimes](#runtimes) depending on the chosen
target environment.

**type**

string

**examples**

`python3.12.x`

### memory

The amount of memory available to the handlers at runtime. The default value is 128MB.
This value is used to configure the amount of memory available to the handler in a FaaS[^1] target environment. In containerised or custom server environments, the highest value across all handlers will be used as a guide to configure the memory available to the runtime.

The minimum and maximum values available depend on the target environment.

**type**

`integer`

**default value**

`128`

**examples**

`1024`

### timeout

The maximum amount of time in seconds that handlers can run for before being terminated.
This defaults to 30 seconds.

The minimum and maximum values available depend on the target environment.

**type**

`integer`

**default value**

`30`

### tracingEnabled

Whether or not to enable tracing for handlers.
The tracing behaviour will vary depending on the target environment.
Tracing is not enabled by default.

**type**

`boolean`

**default value**

`false`

### environmentVariables

A mapping of environment variables that will be available to handlers at runtime.
When a Celerity application is deployed to containerised or custom server environments, environment variables shared between functions will be merged and made available to the runtime.

**type**

mapping[string, string]

**examples**

```yaml
environmentVariables:
  DB_HOST: "${variables.dbHost}"
  DB_PORT: "${variables.dbPort}"
```

## Runtimes

See the [runtimes](/docs/resources/celerity-handler#runtimes) section of the `celerity/handler` resource type documentation for a list of supported runtimes.

## Examples

The following set of examples include different configurations for the `celerity/handlerConfig` resource type
along with resource types that would make up a complete application blueprint.

### Multiple shared configurations for different handler groups

```yaml
version: 2023-04-20
transform: celerity-2024-07-22
variables:
    dbHost:
        type: string
    dbPort:
        type: integer
resources:
    paymentsApi:
        type: "celerity/api"
        metadata:
            displayName: Payments API
        linkSelector:
            byLabel:
                application: "payments"
        spec:
            protocols: ["http"]
            cors:
                allowCredentials: true
                allowOrigins:
                    - "https://example.com"
                    - "https://another.example.com"
                allowMethods:
                    - "GET"
                    - "POST"
                allowHeaders:
                    - "Content-Type"
                    - "Authorization"
                exposeHeaders:
                    - "Content-Length"
                maxAge: 3600
            domain:
                domainName: "api.example.com"
                basePaths:
                    - "/"
                normalizeBasePath: false
                certificateId: "${variables.certificateId}"
                securityPolicy: "TLS_1_2"
            tracingEnabled: true

    getOrder:
        type: "celerity/handler"
        metadata:
            displayName: "Get Order Handler"
            labels:
                app: "payments"
            annotations:
                celerity.handler.http: true
                celerity.handler.http.method: "GET"
                celerity.handler.http.path: "/orders/{orderId}"
        spec:
            handler: "orders.get_order"
        linkSelector:
            byLabel:
                handlerGroup: "orders"

    createOrder:
        type: "celerity/handler"
        metadata:
            displayName: "Create Order Handler"
            labels:
                app: "payments"
            annotations:
                celerity.handler.http: true
                celerity.handler.http.method: "POST"
                celerity.handler.http.path: "/orders"
        spec:
            handler: "orders.create_order"
        linkSelector:
            byLabel:
                handlerGroup: "orders"

    getInvoice:
        type: "celerity/handler"
        metadata:
            displayName: "Get Invoice Handler"
            labels:
                app: "payments"
            annotations:
                celerity.handler.http: true
                celerity.handler.http.method: "GET"
                celerity.handler.http.path: "/invoices/{invoiceId}"
        spec:
            handler: "billing.get_invoice"
        linkSelector:
            byLabel:
                handlerGroup: "billing"
    
    createInvoice:
        type: "celerity/handler"
        metadata:
            displayName: "Create Invoice Handler"
            labels:
                app: "payments"
            annotations:
                celerity.handler.http: true
                celerity.handler.http.method: "POST"
                celerity.handler.http.path: "/invoices"
        spec:
            handler: "billing.create_invoice"
        linkSelector:
            byLabel:
                handlerGroup: "billing"

    billingHandlerConfig:
        type: celerity/handlerConfig
        metadata:
            displayName: Billing Handlers Configuration
            labels:
                handlerGroup: billing
        spec:
        codeLocation: ./handlers
        runtime: python3.12.x
        memory: 256
        timeout: 60
        tracingEnabled: true
        environmentVariables:
            DB_HOST: "${variables.dbHost}"
            DB_PORT: "${variables.dbPort}"

    ordersHandlerConfig:
        type: celerity/handlerConfig
        metadata:
            displayName: Order Handlers Configuration
            labels:
                handlerGroup: orders
        spec:
        codeLocation: ./handlers
        runtime: python3.12.x
        memory: 512
        timeout: 120
        tracingEnabled: false
        environmentVariables:
            DB_HOST: "${variables.dbHost}"
            DB_PORT: "${variables.dbPort}"
```


[^1]: Function-as-a-Service such as AWS Lambda, Google Cloud Functions, and Azure Functions.
