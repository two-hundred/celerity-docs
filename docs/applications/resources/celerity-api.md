---
sidebar_position: 1
---

# `celerity/api`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/api` resource type is used to define a HTTP API or a WebSocket API.

An API can be deployed to different target environments such as a Serverless API Gateway[^1], a containerised environment, or a custom server.

Containerised environments and custom servers use the Celerity runtime for the language of choice to be deployed to handle incoming requests and route them to your [application handlers](/docs/applications/resources/celerity-handler).
The Celerity deploy engine and platforms built on top of it will take care of this for the supported target environments (e.g. Amazon ECS).

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/api` resource followed by examples of different configurations for the resource and how the API behaves in target environments along with additional documentation.

### protocols (required)

A list of protocols that the API supports.
A Celerity API can support HTTP or WebSocket protocols.
Multiple protocols for the same API are supported in certain cases. An API can be both a HTTP and WebSocket API. In a Serverless environment this will map to multiple API Gateways in most cases, in a custom server or containerised environment this will map to a hybrid server that handles both protocols.

:::warning
The "websocket" protocol is not supported in Serverless environments for Google Cloud and Azure.
"Serverless environments" in this context refers to environments where handlers are deployed as serverless functions (e.g. AWS Lambda).
:::

**type**

array[( "http" | "websocket" | [websocketNamedConfiguration](#websocketnamedconfiguration) )]

### cors

Cross-Origin Resource Sharing ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)) configuration for the API.

**type**

string | [corsConfiguration](#corsconfiguration)

**examples**

```yaml
cors: "*"
```

```yaml
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
```

### domain

Configure a custom domain for the API.

**type**

[domainConfiguration](#domainconfiguration)

**examples**

```yaml
domain:
    domainName: "api.example.com"
    basePaths:
        - "/"
    normalizeBasePath: false
    certificateId: "${variables.certificateId}"
    securityPolicy: "TLS_1_2"
```

### tracingEnabled

Determines whether tracing is enabled for the API.
Depending on the target environment this could mean enabling AWS X-Ray, Google Cloud Trace, or Azure Application Insights.

**type**

boolean

### auth

Configure authorization to control access to the API.

**type**

[authConfiguration](#authconfiguration)

**examples**

```yaml
auth:
    defaultGuard: "jwt"
    guards:
        jwt:
            type: jwt
            issuer: "https://identity.twohundred.cloud/oauth2/v1/"
            tokenSource: "$.headers.Authorization"
            audience:
                - "https://identity.twohundred.cloud/api/manage/v1/"
```

## Annotations

Annotations define additional metadata that can determine the behaviour of the resource in relation to other resources in the blueprint or to add behaviour to a resource that is not in its spec.

### `celerity/vpc` 🔗 `celerity/api`

The following are a set of annotations that determine the behaviour of the API in relation to a VPC.
Appropriate security groups are managed by the VPC to API link.

When a VPC is not defined for the container-backed AWS, Google Cloud and Azure target environments, the default VPC for the account will be used.

VPC annotations and links do not have any effect for serverless environments.
Serverless APIs are managed by the cloud provider and are not deployed to a customer-managed VPC.

:::warning
When a VPC is not defined for container-backed cloud environments, annotations in the `celerity/api` will apply to the default VPC for the account.
:::

<p style={{fontSize: '1.2em'}}><strong>celerity.api.vpc.subnetType</strong></p>

The kind of subnet that the API should be deployed to.

**type**

string

**allowed values**

`public` | `private`

**default value**

`public` - When a VPC links to an API, the API will be deployed to a public subnet.

___

<p style={{fontSize: '1.2em'}}><strong>celerity.api.vpc.lbSubnetType</strong></p>

The kind of subnet that the load balancer for an API should be deployed to.
This is only relevant when the API is deployed to an environment that requires load balancers to run the API.

**type**

string

**allowed values**

`public` | `private`

**default value**

`public` - When a VPC links to an API, the load balancer for the API will be deployed to a public subnet.

## Outputs

### id

The ID of the created API in the target environment.
For customer server or containerised environments, this will be the same as the `baseUrl` output field.

**type**

string

**examples**

`arn:aws:apigateway:us-east-1::/apis/1234567890` (AWS Serverless)

`projects/123456789/locations/global/apis/api-abc` (Google Cloud Serverless)

`https://api.example.com/v1` (Custom Server or Containerised Environment)


### baseUrl

The base URL of the deployed API.

**type**

string

**examples**

`https://api.example.com/v1`

`https://abcdef.execute-api.us-east-1.amazonaws.com` (AWS Serverless)

`https://my-gateway-a12bcd345e67f89g0h.uc.gateway.dev` (Google Cloud Serverless)

## Data Types

### websocketNamedConfiguration

A named entry for WebSocket configuration.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>websocketConfig</strong></p>

Configuration for a WebSocket API.

**field type**

[websocketConfiguration](#websocketconfiguration)
___

### websocketConfiguration

Configuration for the WebSocket protocol of an API.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>routeKey</strong></p>

The key in the message JSON object to use for routing messages to the correct handler.
This is not used for binary messages, only for text WebSocket messages.
For binary messages, the route is extracted from the prefix of the message as per the [Celerity Binary Message Format](#celerity-binary-message-format).

**field type**

string

**default value**

`event`

___

<p style={{fontSize: '1.2em'}}><strong>authStrategy</strong></p>

Determines the strategy for authenticating WebSocket connections.
When `authMessage` is set, the client is expected to send a message with an authentication token to authenticate the connection.
When `connect` is set, the client is expected to send the authentication token in the connection request headers.

See the [WebSocket Auth Strategy](#websocket-auth-strategy) section for more information.

:::warning
In Serverless environments that support WebSocket APIs, only the `authMessage` strategy is supported.
This is because custom WebSocket status codes are not supported by Serverless WebSocket API offerings.
:::

**field type**

string

**allowed values**

`authMessage` | `connect`

**default value**

`authMessage`

___

### corsConfiguration

Detailed Cross-Origin Resource Sharing ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)) configuration for the API.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>allowCredentials</strong></p>

Indicates whether the request is allowed to contain credentials that are set in cookies.

**field type**

boolean
___

<p style={{fontSize: '1.2em'}}><strong>allowOrigins</strong></p>

A list of origins that are allowed to access the endpoints of the API.

**field type**

array[string]
___

<p style={{fontSize: '1.2em'}}><strong>allowMethods</strong></p>

A list of HTTP methods that are allowed to be used when accessing the endpoints of the API
from an allowed origin.

**field type**

array[string]
___

<p style={{fontSize: '1.2em'}}><strong>allowHeaders</strong></p>

A list of HTTP headers that are allowed to be used when accessing the endpoints of the API
from an allowed origin.

**field type**

array[string]
___

<p style={{fontSize: '1.2em'}}><strong>exposeHeaders</strong></p>

A list of HTTP headers that can be exposed in responses of the API endpoints
for a request from an allowed origin.

**field type**

array[string]
___

<p style={{fontSize: '1.2em'}}><strong>maxAge</strong></p>

A value that contains the number of seconds to cache a CORS Preflight request for.

**field type**

string
___

### domainConfiguration

Configuration for attaching a custom domain to the API.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>domainName (required)</strong></p>

The custom domain name to use for the API.

**field type**

string

**examples**

`api.example.com`

___

<p style={{fontSize: '1.2em'}}><strong>basePaths</strong></p>

A list of base paths to configure for the API.
This is useful when you want to configure the same domain for multiple APIs
and route requests to different APIs based on the base path.

When providing protocol-specific base paths, only one can be provided for each protocol; additionally, protocol-specific base paths can not be mixed with simple base paths.

Hybrid APIs that support both HTTP and WebSocket protocols **must** have protocol-specific base paths defined.

:::caution
When deploying a Celerity application to a custom server or containerised environment,
the base path is used by a reverse proxy or load balancer to route a request to the correct upstream service
for a domain that hosts multiple APIs or applications.
In a simple set up, the base path should be stripped from the request URL before it reaches the runtime router.

Simple examples where base path should be stripped:

`["/"]`

`["/api/current", "/api/v1"]`

When multiple base paths are provided for different protocols, the reverse proxy or load balancer
must **not** strip the base path from the request URL.
The presence of the base path in the request allows the runtime router to determine whether to route the request to a HTTP or WebSocket handler.

Advanced example where base path should **not** be stripped:

```yaml
- protocol: "http"
  basePath: "/api"
- protocol: "websocket"
  basePath: "/ws"
```
:::

**field type**

array[( string | [basePathConfiguration ](#basepathconfiguration))]

**default value**

`["/"]`

**examples**

```yaml
- protocol: "http"
  basePath: "/api"
- protocol: "websocket"
  basePath: "/ws"
```

___

<p style={{fontSize: '1.2em'}}><strong>normalizeBasePath</strong></p>

A boolean value that indicates whether the base path should be normalised.
When set to `true`, the base path will be normalised to remove non-alphanumeric characters.

**field type**

boolean

**default value**

`true`

___

<p style={{fontSize: '1.2em'}}><strong>certificateId (required)</strong></p>

The ID of the certificate to use for the custom domain.
This is specific to the target environment where the API is deployed.
For example, in AWS, this would be the ARN of an ACM certificate.
Usually, it would be best to provide this as a variable to decouple the blueprint
from a specific target environment like a cloud provider.

**field type**

string

**examples**

`arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`

`"${variables.certificateId}"`
___

<p style={{fontSize: '1.2em'}}><strong>securityPolicy</strong></p>

The Transport Layer Security (TLS) version and cipher suite for this domain.
Supported values are `TLS_1_0` and `TLS_1_2`.

**field type**

string

**allowed values**

`TLS_1_0` | `TLS_1_2`

___

### authConfiguration

Configuration for authorization to control access to the API.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>guards</strong></p>

A list of guards that are used to control access to the API.

**field type**

mapping[string, [authGuardConfiguration](#authguardconfiguration)]

___

<p style={{fontSize: '1.2em'}}><strong>defaultGuard</strong></p>

The identifier of the guard that should be used as the default guard for the API.
This should only be set when you want to use the same guard for all endpoints of the API.

**field type**

string

___

### authGuardConfiguration

Configuration for a guard that is used to control access to the API.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>type</strong></p>

The type of guard that can be used to control access to endpoints
of the API.
When the guard type is set to custom, you can implement a custom guard with a handler.
In the blueprint definition, the handler must be linked to the API with the annotation `celerity.handler.guard.custom` set to `true`.

**field type**

string

**allowed values**

`jwt` | `custom`
___

<p style={{fontSize: '1.2em'}}><strong>issuer (conditionally required)</strong></p>

The token issuer that is used to validate a JWT when the guard type is `jwt`.
This is required when the guard type is `jwt`, ignored otherwise.

**field type**

string

**examples**

`https://identity.twohundred.cloud/oauth2/v1/`
___

<p style={{fontSize: '1.2em'}}><strong>tokenSource (conditionally required)</strong></p>

The source of the token in the request or message.
This is required when the guard type is `jwt`, ignored otherwise.

This is expected to be in the format `$.*` where `*` is the field in the request or message
that contains the token.
For example, in a HTTP request, a token in the `Authorization` header would be `$.headers.Authorization`.
For HTTP requests, the token sources can be `$.headers.`, `$.query.`, `$.body.`, `$.cookies.`.

In a WebSocket message a token in the message data would be `$.data.token`, assuming a message structure such as:
```json
{
    "event": "authenticate",
    "data": {
        "token": "..."
    }
}
```

**field type**

string | [valueSourceConfiguration](#valuesourceconfiguration)

**examples**

`$.headers.Authorization`

`$.query.token`

`$.body.token`

`$.cookies.token`

`$.data.token`

```yaml
- protocol: "http"
  source: "$.headers.Authorization"
- protocol: "websocket"
  source: "$.data.token"
```
___

<p style={{fontSize: '1.2em'}}><strong>audience (conditionally required)</strong></p>

A list of intended recipients of a JWT.
This is required when the guard type is `jwt`, ignored otherwise.
See [RFC 7519](https://tools.ietf.org/html/rfc7519#section-4.1.3) for more information about JWT audiences.

**field type**

array[string]

**examples**

`["https://identity.twohundred.cloud/api/manage/v1/"]`

`["4f4948fac1b4b2b4c10deaf32"]` (a client ID for an OAuth2 application)

___


### valueSourceConfiguration

Configuration for a value source used to extract values such as JWTs from a request or message.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>protocol (required)</strong></p>

The protocol that the value source is used for.
This can be either `http` or `websocket`.

**field type**

string

**allowed values**

`http` | `websocket`
___

<p style={{fontSize: '1.2em'}}><strong>source (required)</strong></p>

The source of the value in the request or message.

This is expected to be in the format `$.*` where `*` is the field in the request or message
that contains the value.
For example, in a HTTP request, the `Authorization` header would be `$.headers.Authorization`.
For HTTP requests, the token sources can be `$.headers.`, `$.query.`, `$.body.`, `$.cookies.`.

In a WebSocket message, a token in the message data would be `$.data.authToken`, assuming a message structure such as:
```json
{
    "event": "authenticate",
    "data": {
        "authToken": "..."
    }
}
```

**field type**

string

**examples**

`$.headers.Authorization`

`$.query.token`

`$.cookies.authToken`

___

### basePathConfiguration

Configuration for a base path of an API that allows you to map base paths
to different protocols.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>protocol (required)</strong></p>

The protocol that the base path should serve.
This can be either `http` or `websocket`.

**field type**

string

**allowed values**

`http` | `websocket`
___

<p style={{fontSize: '1.2em'}}><strong>basePath (required)</strong></p>

The base path to configure for the specified protocol in the API.

**field type**

string

**examples**

`/api`

`/ws`
___

## Linked From

#### [`celerity/vpc`](/docs/applications/resources/celerity-vpc)

Depending on the target environment, the API may be deployed to a VPC for private access.
When deploying to serverless environments such as AWS API Gateway, the API itself is not deployed to a VPC.

## Links To

#### [`celerity/handler`](/docs/applications/resources/celerity-handler)

Handlers contain the application functionality that is executed in response to an incoming request or message to an API. Annotations for the handler resource type can be used to configure the behaviour of the handler in relation to the API.

Handlers can also be custom auth guards that are used to control access to the API.

#### [`celerity/secrets`](/docs/applications/resources/celerity-secrets)

Secrets can be used to store configuration and sensitive information such as API keys, database passwords, and other credentials that are used by the application.
An API can link to a secret store to access secrets at runtime, linking an application to a secret store will automatically make secrets accessible to all handlers in the application without having to link each handler to the secret store.

## Examples

### HTTP API

```yaml
version: 2023-04-20
transform: celerity-2024-07-22
resources:
    ordersApi:
        type: "celerity/api"
        metadata:
            displayName: Orders API
            annotations:
                celerity.api.vpc.subnetType: "public"
        linkSelector:
            byLabel:
                application: "orders"
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
            auth:
                defaultGuard: "jwt"
                guards:
                    jwt:
                        type: jwt
                        issuer: "https://identity.twohundred.cloud/oauth2/v1/"
                        tokenSource: "$.headers.Authorization"
                        audience:
                            - "https://identity.twohundred.cloud/api/manage/v1/"
```

### WebSocket API

```yaml
version: 2023-04-20
transform: celerity-2024-07-22
resources:
    orderStreamApi:
        type: "celerity/api"
        metadata:
            displayName: Order Stream API
        linkSelector:
            byLabel:
                application: "orders"
        spec:
            protocols:
                - websocket:
                    routeKey: "action"
            cors:
                allowOrigins:
                    - "https://example.com"
                    - "https://another.example.com"
            domain:
                domainName: "api.example.com"
                basePaths:
                    - "/"
                normalizeBasePath: false
                certificateId: "${variables.certificateId}"
                securityPolicy: "TLS_1_2"
            tracingEnabled: true
            auth:
                defaultGuard: "jwt"
                guards:
                    jwt:
                        type: jwt
                        issuer: "https://identity.twohundred.cloud/oauth2/v1/"
                        tokenSource: "$.data.token"
                        audience:
                            - "https://identity.twohundred.cloud/api/manage/v1/"
```

### Hybrid API

```yaml
version: 2023-04-20
transform: celerity-2024-07-22
resources:
    ordersApi:
        type: "celerity/api"
        metadata:
            displayName: Orders API
        linkSelector:
            byLabel:
                application: "orders"
        spec:
            protocols: ["http", "websocket"]
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
                    - protocol: "http"
                      basePath: "/api"
                    - protocol: "websocket"
                      basePath: "/ws"
                normalizeBasePath: false
                certificateId: "${variables.certificateId}"
                securityPolicy: "TLS_1_2"
            tracingEnabled: true
            auth:
                defaultGuard: "jwt"
                guards:
                    jwt:
                        type: jwt
                        issuer: "https://identity.twohundred.cloud/oauth2/v1/"
                        tokenSource:
                            - protocol: "http"
                              source: "$.headers.Authorization"
                            - protocol: "websocket"
                              source: "$.data.token"
                        audience:
                            - "https://identity.twohundred.cloud/api/manage/v1/"
```

## WebSockets

### Celerity Binary Message Format

Celerity provides a binary message format that is used to route binary WebSocket messages to the correct handler.
This format is purely for messages sent from a client to the server, messages sent from the server to the client can be in any format as per the API designed for a specific application.

:::caution
WebSocket binary messages are only supported by the Celerity runtime. The runtime is used when deploying a Celerity application to a custom server or a containerised environment.
:::

In environments that support binary messages (e.g. Celerity runtime in a containerised environment),
a message is expected to be of the following format:

```
<routeLength><route><message>
```

`<routeLength>` is a 1-byte unsigned integer that represents the length of the route in bytes.

`<route>` is an encoded utf-8 string for the route of the message that is used to route the message to the correct handler, this will be exactly the length specified in `<routeLength>`. A route can not have a length greater than 255 bytes, for performance reasons it is recommended to keep the route as short as possible.

`<message>` is the actual binary data of the message.


### WebSocket Auth Strategy

There are two strategies for authenticating WebSocket connections: `authMessage` and `connect`.
See the [WebSocket Configuration](#websocketconfiguration) section for the field that determines the strategy.

#### `authMessage` approach

On successful connection, the client must send a message with the token in the format:
```json
{
    "event": "authenticate",
    "data": {
        "token": "..."
    }
}
```

_The API's auth guard token source must match the field containing the token in the message. (i.e. `$.data.token`)_

_"event" in this example is using the default routeKey, when you specify a custom route key, that will be used instead._

Upon successful authentication, the client will receive a message with the event `authenticated` in the following form:

```json
{
    "event": "authenticated",
    "data": {
        "success": true,
        "message": "Authenticated successfully"
    }
}
```

Upon failed authentication, the client will receive a message with the event `authenticated` in the following form:

```json
{
    "event": "authenticated",
    "data": {
        "success": false,
        "message": "Authentication failed"
    }
}
```

After sending the failed authentication message, the connection will be closed from the server-side.
The purpose of sending the failed authentication message is to provide a clear reason for failure to the client before closing the connection, this is essential in environments that do not support custom WebSocket status codes.

_the "event" field in the response message is not related to the route key, this will always be event._

#### `connect` approach

The HTTP header configured as the API's auth guard token source must be sent in the connection request headers.

For example, if the token source is `$.headers.Authorization`, the client must send the token in the `Authorization` header when connecting.

Upon successful authentication, the connection will be upgraded to WebSockets and the client will be able to send and receive messages.

Upon failed authentication, the connection will be closed with the custom status code `4001` (Unauthorized). The client should handle this status code as an authentication failure.
The custom status code is in the range reserved for application-specific status codes, see [RFC 6455](https://tools.ietf.org/html/rfc6455#section-7.4.2) for more information.


## Target Environments

### Celerity::1

In the Celerity::1 local environment, an API is deployed as a containerised version of the Celerity runtime in Docker.
Links from VPCs to APIs are ignored for this environment as the API is deployed to a local container network on a developer or CI machine.

### AWS

In the AWS environment, APIs are deployed as a containerised version of the Celerity runtime.
Authentication, authorisation and CORS configuration defined for the API is taken care of by the runtime.

APIs can be deployed to [ECS](https://aws.amazon.com/ecs/) or [EKS](https://aws.amazon.com/eks/) backed by [Fargate](https://aws.amazon.com/fargate/) or [EC2](https://aws.amazon.com/ec2/) using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the AWS target environment.

#### ECS

When an API is first deployed to ECS, a new cluster is created for the API.
A service is provisioned within the cluster to run the application.
A public-facing application load balancer is created to route traffic to the service, if you require private access to the API, the load balancer can be configured to be internal.
When domain configuration is provided and the load balancer is public-facing, an [ACM](https://aws.amazon.com/certificate-manager/) certificate is created for the domain and attached to the load balancer, you will need to verify the domain ownership before the certificate can be used.

The service is deployed with an auto-scaling group that will scale the number of tasks running the API based on the CPU and memory usage of the tasks. The auto-scaling group will scale the desired task count with a minimum of 1 task and a maximum of 5 tasks by default. If backed by EC2, the auto-scaling group will scale the number instances based on the CPU and memory usage of the instances with a minimum of 1 instance and a maximum of 3 instances by default. Deploy configuration can be used to override this behaviour.

When it comes to networking, ECS services need to be deployed to VPCs; if a VPC is defined in the blueprint and linked to the API, it will be used, otherwise the default VPC for the account will be used. The load balancer will be placed in the public subnet by default, but can be configured to be placed in a private subnet by setting the `celerity.api.vpc.lbSubnetType` annotation to `private`. The service for the application will be deployed to a public subnet by default, but can be configured to be deployed to a private subnet by setting the `celerity.api.vpc.subnetType` annotation to `private`.
By default, 2 private subnets and 2 public subnets are provisioned for the associated VPC, the subnets are spread across 2 availability zones, the ECS resources that need to be associated with a subnet will be associated with these subnets, honouring the API subnet type defined in the annotations.

The CPU to memory ratio used by default for AWS deployments backed by EC2 is that of the `t3.*` instance family. The auto-scaling launch configuration will use the appropriate instance type based on the requirements of the application, these requirements will be taken from the deploy configuration or derived from the handlers configured for the API. If the requirements can not be derived, the instance profile will be `t3.small` with 2 vCPUs and 2GB of memory.

Fargate-backed ECS deployments use the same CPU to memory ratios allowed for Fargate tasks as per the [task definition parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size).

If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. 
For an EC2-backed cluster, the task housing the containers that make up the service for the API will be deployed with 896MB of memory and 0.8 vCPUs. Less than half of the memory and CPU is allocated to the EC2 instance to allow for smooth deployments of new versions of the API, this is done by making sure there is enough memory and CPU available to the ECS agent.
For a Fargate-backed cluster, the task housing the containers that make up the service for the API will be deployed with 1GB of memory and 0.5 vCPUs.

A sidecar [ADOT collector](https://aws-otel.github.io/docs/getting-started/collector) container is deployed with the API to collect traces and metrics for the application, this will take up a small portion of the memory and CPU allocated to the API. Traces are only collected when tracing is enabled for the API.

#### EKS

When an API is first deployed to EKS, a new cluster is created for the API unless you specify an existing cluster to use in the deploy configuration.

:::warning using existing clusters
When using an existing cluster, the cluster must be configured in a way that is compatible with the VPC annotations configured for the API as well as the target compute type.
For example, a cluster without a Fargate profile can not be used to deploy an API that is configured to use Fargate. Another example would be a cluster with a node group only associated with public subnets not being compatible with an API with the `celerity.api.vpc.subnetType` annotation set to `private`.
You also need to make sure there is enough memory and CPU allocated for node group instances to run the API in addition to other workloads running in the cluster.
:::

The cluster is configured with a public endpoint for the Kubernetes API server by default, this can be overridden to be private in the deploy configuration. (VPC links will be required to access the Kubernetes API server when set to private)

For an EKS cluster backed by EC2, a node group is configured with auto-scaling configuration to have a minimum size of 2 nodes and a maximum size of 5 nodes by default. Auto-scaling is handled by the [Kubernetes Cluster Autoscaler](https://github.com/kubernetes/autoscaler#kubernetes-autoscaler). The instance type configured for node groups is determined by the CPU and memory requirements defined in the deploy configuration or derived from the handlers of the API, if the requirements can not be derived, the instance type will be `t3.small` with 2 vCPUs and 2GB of memory.

For an EKS cluster backed by Fargate, a [Fargate profile](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html) is configured to run the API.

Once the cluster is up and running, Kubernetes services are provisioned to run the application, an Ingress service backed by an application load balancer is created to route traffic to the service, if you require private access to the API, the load balancer can be configured to be internal. When domain configuration is provided and the load balancer is public-facing, an [ACM](https://aws.amazon.com/certificate-manager/) certificate is created for the domain and attached to the ingress service via annotations, you will need to verify the domain ownership before the certificate can be used.

When it comes to networking, EKS services need to be deployed to VPCs; if a VPC is defined in the blueprint and linked to the API, it will be used, otherwise the default VPC for the account will be used.
The ingress service backed by an application load balancer will be placed in the public subnet by default, but can be configured to be placed in a private subnet by setting the `celerity.api.vpc.lbSubnetType` annotation to `private`.

By default, 2 private subnets and 2 public subnets are provisioned for the associated VPC, the subnets are spread across 2 availability zones. For EC2-backed clusters, the EKS node group will be associated with all 4 subnets when `celerity.api.vpc.subnetType` is set to `public`; when `celerity.api.vpc.subnetType` is set to `private`, the node group will only be associated with the 2 private subnets. The orchestrator will take care of assigning one of the subnets defined for the node group.

For Fargate-backed clusters, the Fargate profile will be associated with the private subnets due to the [limitations with Fargate profiles](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html). For Fargate, the API will be deployed to one of the private subnets associated with the profile. 

:::warning
`celerity.api.vpc.subnetType` has no effect for Fargate-based EKS deployments, the API will always be deployed to a private subnet.
:::

If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set.
For an EC2-backed cluster, the containers that make up the service for the API will be deployed with 896MB of memory and 0.8 vCPUs. Less than half of the memory and CPU is allocated to a node that will host the containers to allow for smooth deployments of new versions of the API, this is done by making sure there is enough memory and CPU available to the Kubernetes agents.
For a Fargate-backed cluster, the pod for the API will be deployed with 1GB of memory and 0.5 vCPUs, for Fargate there are a [fixed set of CPU and memory configurations](https://docs.aws.amazon.com/eks/latest/userguide/fargate-pod-configuration.html) that can be used.

A sidecar [ADOT collector](https://aws-otel.github.io/docs/getting-started/collector) container is deployed in the pod with the API to collect traces and metrics for the application, this will take up a small portion of the memory and CPU allocated to the API. Traces are only collected when tracing is enabled for the API.

### AWS Serverless

In the AWS Serverless environment, APIs are deployed as Amazon API Gateway REST, WebSocket or HTTP APIs with AWS Lambda for the handlers.

Authorisers are configured in the API Gateway for the JWT auth guards.
Custom auth guards will be deployed as custom authorizers with AWS Lambda housing the custom guard handler.

When domain configuration is provided, an [ACM](https://aws.amazon.com/certificate-manager/) certificate is created for the domain and attached to the API Gateway, you will need to verify the domain ownership before the certificate can be used.

When tracing is enabled, an [ADOT lambda layer](https://aws-otel.github.io/docs/getting-started/lambda) is bundled with and configured to instrument each handler to collect traces and metrics.
AWS API Gateway traces are collected in AWS X-Ray, API Gateway-specific traces can be collected into tools like Grafana with plugins that use AWS X-Ray as a data source.

APIs can be deployed to API Gateway using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the AWS Serverless target environment.

### Google Cloud

In the Google Cloud environment, APIs are deployed as a containerised version of the Celerity runtime.
Authentication, authorisation and CORS configuration defined for the API is taken care of by the runtime.

APIs can be deployed to [Cloud Run](https://cloud.google.com/run), as well as [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) in [Autopilot](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview) or [Standard](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-regional-cluster) mode using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the Google Cloud target environment.

#### Cloud Run

Cloud Run is a relatively simple environment to deploy applications to, the API is deployed as a containerised application that is fronted by either an internal or external load balancer.

Autoscaling is configured with the use of Cloud Run annotations through `autoscaling.knative.dev/minScale` and `autoscaling.knative.dev/maxScale` [annotations](https://cloud.google.com/run/docs/reference/rest/v1/ObjectMeta). The knative autoscaler will scale the number of instances based on the number of requests and the CPU and memory usage of the instances. By default, the application will be configured to scale the number of instances with a minimum of 1 instance and a maximum of 5 instances. Deploy configuration can be used to override this behaviour.

When domain configuration is provided and the load balancer is public-facing and Google-managed, a [managed TLS certificate](https://cloud.google.com/load-balancing/docs/ssl-certificates) is created for the domain and attached to the load balancer, you will need to verify the domain ownership before the certificate can be used.

For Cloud Run, the API will not be associated with a VPC, defining custom VPCs for Cloud Run applications is not supported. Creating and linking a VPC to the API will enable the `Internal` networking mode in the [network ingress settings](https://cloud.google.com/run/docs/securing/ingress). `celerity.api.vpc.subnetType` has no effect for Cloud Run deployments, the API will always be deployed to a network managed by Google Cloud. Setting `celerity.api.vpc.lbSubnetType` to `private` will have the same affect as attaching a VPC to the application, making the application load balancer private. Setting `celerity.api.vpc.lbSubnetType` to `public` will have the same effect as not attaching a VPC to the API, making the application load balancer public. `public` is equivalent to the "Internal and Cloud Load Balancing" [ingress setting](https://cloud.google.com/run/docs/securing/ingress#settings).

Memory and CPU resources allocated to the API can be defined in the deploy configuration, when not defined, memory and CPU will be derived from the handlers configured for the API.
If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. The Cloud Run service will be allocated a limit of 1GB of memory and 1 vCPU per instance.

A sidecar [OpenTelemetry Collector](https://github.com/GoogleCloudPlatform/opentelemetry-cloud-run) container is deployed in the service with the API to collect traces and metrics, this will take up a small portion of the memory and CPU allocated to the API. Traces will only be collected if tracing is enabled for the API.

#### GKE

When an API is first deployed to GKE, a new cluster is created for the API unless you specify an existing cluster to use in the deploy configuration.

:::warning Using existing clusters
When using an existing cluster, the cluster must be configured in a way that is compatible with the VPC annotations configured for the API as well as the target compute type.
:::

When in standard mode, the cluster will be regional with 2 zones for better availability guarantees. A node pool is created with autoscaling enabled, by default, the pool will have a minimum of 1 node and a maximum of 3 nodes per zone. As the cluster has 2 zones, this will be a minimum of 2 nodes and a maximum of 6 nodes overall. The [cluster autoscaler](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-autoscaler) is used to manage scaling and choosing the appropriate instance type to use given the requirements of the API service. The minimum and maximum number of nodes can be overridden in the deploy configuration.

When in autopilot mode, Google manages scaling, security and node pools. Based on memory and CPU limits applied at the pod-level, appropriate node instance types will be selected and will be scaled automatically. There is no manual autoscaling configuration when running in autopilot mode, GKE Autopilot is priced per pod request rather than provisioned infrastructure, depending on the nature of your workloads, it could be both a cost-effective and convenient way to run your APIs. [Read more about autopilot mode pricing](https://cloud.google.com/kubernetes-engine/pricing#autopilot_mode).

When domain configuration is provided and the load balancer that powers the Ingress service is public-facing and Google-managed, a [managed TLS certificate](https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs) is created for the domain and attached to the Ingress object, you will need to verify the domain ownership before the certificate can be used.

When it comes to networking, a GKE cluster is deployed as a [private cluster](https://cloud.google.com/kubernetes-engine/docs/concepts/private-cluster-concept), nodes that the pods for the API run on only use internal IP addresses, isolating them from the public internet. The Control plane has both internal and external endpoints, the external endpoint can be disabled from the Google Cloud/Kubernetes side. When `celerity.api.vpc.lbSubnetType` is set to `public`, an [Ingress](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress) service is provisioned using an external Application Load Balancer. When `celerity.api.vpc.lbSubnetType` is set to `private`, an Ingress service is provisioned using an internal Application Load Balancer. The Ingress service is used to route traffic from the public internet to the service running the API.

:::warning
`celerity.api.vpc.subnetType` has no effect for GKE clusters, the API will always be deployed to a private network, the API is exposed through the ingress service if the ingress is configured to be public.
:::

If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. Limits of 1GB of memory and 0.5 vCPUs will be set for the pods that run the API.

The [OpenTelemetry Operator](https://cloud.google.com/blog/topics/developers-practitioners/easy-telemetry-instrumentation-gke-opentelemetry-operator/) is used to configure a sidecar collector container for the API to collect traces and metrics. Traces will only be collected if tracing is enabled for the API.

### Google Cloud Serverless

In the Google Cloud Serverless environment, REST/HTTP APIs are deployed as Google Cloud API Gateways with Google Cloud Functions for the handlers.

[JWT authentication](https://cloud.google.com/api-gateway/docs/authenticating-users-jwt) for API Gateway is used for JWT auth guards.

Custom authorisers are not supported by Google Cloud API Gateway; to get around this, Celerity will bundle the custom authoriser handler code with each protected handler and the handlers SDK that is used to build a Celerity application will take care of calling the custom authoriser before the actual handler is called.

When tracing is enabled, the built-in Google Cloud metrics and tracing offerings will be used to collect traces and metrics for the handlers. Traces and metrics can be collected into tools like Grafana with plugins that use Google Cloud Trace as a data source. Logs and metrics are captured out of the box for the API Gateway and will be collected in Google Cloud Logging and Monitoring. You can export logs and metrics to other tools like Grafana with plugins that use Google Cloud Logging and Monitoring as a data source.

:::warning Tracing in Google Cloud Serverless
Google Cloud API Gateway does not currently support tracing.
:::

APIs can be deployed to API Gateway using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the Google Cloud Serverless target environment.

:::warning About WebSockets
Google Cloud API Gateway does not support WebSocket APIs.
To deploy a WebSockets API to Google Cloud, you will need to use the "[Google Cloud](#google-cloud)" target environment and deploy the API as a containerised application.
:::

### Azure

In the Azure environment, APIs are deployed as a containerised version of the Celerity runtime.
Authentication, authorisation and CORS configuration defined for the API is taken care of by the runtime.

APIs can be deployed to [Azure Container Apps](https://azure.microsoft.com/en-us/products/container-apps/) or [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/products/kubernetes-service) using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the Azure target environment.

#### Container Apps

Container Apps is a relatively simple environment to deploy applications to, the API is deployed as a containerised application that is fronted by either external HTTPS ingress or internal ingress.

Autoscaling is determined based on the number of concurrent HTTP requests for public APIs, for private APIs and hybrid applications (e.g. API and message processor) [KEDA-supported](https://keda.sh/docs/2.15/scalers/) CPU and memory scaling triggers are used. By default, the [scale definition](https://learn.microsoft.com/en-us/azure/container-apps/scale-app?pivots=azure-cli#scale-definition) is set to scale from 1 to 5 replicas per revision, this can be overridden in the deploy configuration.

When domain configuration is provided and the API is configured to be public-facing, a [managed TLS certificate](https://learn.microsoft.com/en-us/azure/container-apps/custom-domains-managed-certificates?pivots=azure-portal) is provisioned and attached to the Container App's HTTP ingress configuration. You will need to verify the domain ownership before the certificate can be used. 

Container Apps will not be associated with a private network by default, a VNet is automatically generated for you and generated VNets are publicly accessible over the internet. [Read about networking for Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/networking?tabs=workload-profiles-env%2Cazure-cli). When you define a VPC and link it to the API, a custom VNet will be provisioned and the API will be deployed to either a private or public subnet based on the `celerity.api.vpc.subnetType` annotation, defaulting to a public subnet if not specified. When the `celerity.api.vpc.lbSubnetType` is set to `public`, a public HTTPS ingress is provisioned for the API; when set to `private`, an internal HTTP ingress is provisioned for the API. Azure's built-in [zone redundancy](https://learn.microsoft.com/en-us/azure/reliability/reliability-azure-container-apps?tabs=azure-cli) is used to ensure high availability of the API.

Memory and CPU resources allocated to the API can be defined in the deploy configuration, when not defined, memory and CPU will be derived from the handlers configured for the API. If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. The Container App service will be allocated a limit of 1GB of memory and 0.5 vCPU per instance in the consumption plan, [see allocation requirements](https://learn.microsoft.com/en-us/azure/container-apps/containers#allocations).

The [OpenTelemetry Data Agent](https://learn.microsoft.com/en-us/azure/container-apps/opentelemetry-agents?tabs=arm) is used to collect traces and metrics for the application. Traces will only be collected if tracing is enabled for the API.

#### AKS

When an API is first deployed to AKS, a new cluster is created for the API unless you specify an existing cluster to use in the deploy configuration.

:::warning Using existing clusters
When using an existing cluster, it must be configured in a way that is compatible with the VPC annotations configured for the API as well as the target compute type.
:::

The cluster is created across 2 availability zones for better availability guarantees. Best effort zone balancing is used with [Azure VM Scale Sets](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones?tabs=portal-2#zone-balancing). The cluster is configured with an [autoscaler](https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler?tabs=azure-cli) with a minimum of 2 nodes and a maximum of 5 nodes
distributed across availability zones as per Azure's zone balancing. The default node size is `Standard_D4d_v5` with 4 vCPUs and 16GB of memory, this size is chosen because of the [minimum requirements for system Node Pools](https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli#system-and-user-node-pools) and in the default configuration a single node pool is shared by the system and user workloads. If the CPU or memory requirements of the API mean the default node size would not be able to comfortably run 2 instances of the API, a larger node size will be selected.
Min and max node count along with the node size can be overridden in the deploy configuration.

When domain configuration is provided and the load balancer that powers the Ingress service is public-facing, a TLS certificate is generated with [Let's Encrypt](https://letsencrypt.org/) via [cert-manager](https://cert-manager.io/docs/installation/helm/) to provision certificates for domains associated with Ingress resources in Kubernetes. The certificate is used by the Ingress object to terminate TLS traffic. You will need to verify the domain ownership before the certificate can be used.

When it comes to networking, the API will be deployed with the overlay network model in a public network as per the default AKS access mode. [Read about private and public clusters for AKS](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/public-and-private-aks-clusters-demystified/ba-p/3716838).
When you define a VPC and link it to the API, the API will be deployed as a private cluster using the VNET integration feature of AKS where the control plane will not be made available through a public endpoint. The `celerity.api.vpc.subnetType` annotation has **no** effect for AKS deployments as the networking model for Azure with it's managed Kubernetes offering is different from other cloud providers and all services running on a cluster are private by default, exposed to the internet through a load balancer or ingress controller. When `celerity.api.vpc.lbSubnetType` is set to `public`, an Ingress service is provisioned using the [nginx ingress controller](https://learn.microsoft.com/en-us/azure/aks/app-routing) that uses an external Azure Load Balancer under the hood. When `celerity.api.vpc.lbSubnetType` is set to `private`, the nginx Ingress controller is configured to use an internal Azure Load Balancer, [read more about the private ingress controller](https://learn.microsoft.com/en-us/azure/aks/create-nginx-ingress-private-controller).

Memory and CPU resources allocated to the API pod can be defined in the deploy configuration, if not specified, the API will derive memory and CPU from handlers configured for the API.
If memory and CPU is not defined in the deploy configuration and can not be derived from the handlers, some defaults will be set. The pod that runs the API will be allocated a limit of 1GB of memory and 0.5 vCPUs.

The [OpenTelemetry Operator](https://opentelemetry.io/docs/kubernetes/operator/) is used to configure a sidecar collector container for the API to collect traces and metrics. Traces will only be collected if tracing is enabled for the API.

### Azure Serverless

In the Azure Serverless environment, REST/HTTP APIs are deployed as Azure API Management APIs with Azure Functions for the handlers.

[JWT authentication](https://learn.microsoft.com/en-us/azure/api-management/validate-jwt-policy) for API Management Gateways is used for JWT auth guards.

Custom authorisers are not supported by Azure API Management; to get around this, Celerity will bundle the custom authoriser handler code with each protected handler and the handlers SDK that is used to build a Celerity application will take care of calling the custom authoriser before the actual handler is called.

When tracing is enabled, the [trace policy](https://learn.microsoft.com/en-us/azure/api-management/trace-policy) is used for the API Management Gateway, these traces will go to Application Insights. You can export logs, traces and metrics to other tools like Grafana with plugins that use Azure Monitor as a data source.
When it comes to the Azure Functions that power the endpoints, traces and metrics go to Application Insights by default, from which you can export logs, traces and metrics to other tools like Grafana with plugins that use Azure Monitor as a data source.
[OpenTelemetry for Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/opentelemetry-howto?tabs=otlp-export&pivots=programming-language-csharp) is also supported for some languages, you can use the deploy configuration to enable OpenTelemetry for Azure Functions.

APIs can be deployed to API Gateway using [deploy configuration](/deploy-engine/docs/deploy-configuration) for the Azure Serverless target environment.

:::warning About WebSockets
Azure API Management does not support WebSocket APIs natively, WebSocket APIs can be used as the backend server but do not get the benefits of the API Management features such as authentication.
:::

## ⚠️ Limitations

There are limitations when it comes to deploying a `celerity/api` in Serverless environments. Only Amazon API Gateway supports the WebSocket protocol when opting for an architecture where handlers are deployed as serverless functions (e.g. AWS Lambda).
Azure and Google Cloud do not have an equivalent for WebSocket APIs in their Serverless API Gateway/Management offerings.

Azure API Management supports WebSocket APIs where the upstream backend is itself a WebSocket server. In this situation, you would have a Celerity runtime instance as your backend WebSocket server. Celerity **_does not_** manage this for you. You would need to setup and manage your own Azure API Management instance and configure the Celerity WebSocket API as the backend server.

[^1]: Examples of Serverless API Gateways include [Amazon API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html), [Google Cloud API Gateway](https://cloud.google.com/api-gateway), and [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-key-concepts).
