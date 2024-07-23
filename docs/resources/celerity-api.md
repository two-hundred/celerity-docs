---
sidebar_position: 2
---

# `celerity/api`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/api` resource type is used to define a HTTP API or a WebSocket API.

An API can be deployed to different target environments such as a Serverless API Gateway[^1], a containerised environment, or a custom server.

Containerised environments and custom servers will require the Celerity runtime for the language of choice to be deployed to handle incoming requests and route them to your [application handlers](/docs/resources/celerity-handler).
The Celerity build engine and platforms built on top of it will take care of this for the supported target environments (e.g. Amazon ECS).

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/api` resource followed by examples of different configurations for the resource.

### protocols (required)

A list of protocols that the API supports.
A Celerity API can support HTTP or WebSocket protocols.
Multiple protocols for the same API are supported in certain cases. An API can be both a HTTP and WebSocket API. In a Serverless environment this will map to multiple API Gateways in most cases, in a custom server or containerised environment this will map to a hybrid server that handles both protocols.

:::warning
The "websocket" protocol is not supported in Serverless environments for Google Cloud and Azure.
"Serverless environments" in this context refers to environments where handlers are deployed as serverless functions (e.g. AWS Lambda).
:::

**type**

array[( "http" | "websocket" )]

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
            issuer: "https://identity.twohundred.cloud/oauth2/v1/"
            tokenSource: "$.headers.Authorization"
            audience:
                - "https://identity.twohundred.cloud/api/manage/v1/"
```

## Data Types

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

**field type**

array[string]

**default value**

`["/"]`

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

`jwt` | `apiKey` | `custom`
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

<p style={{fontSize: '1.2em'}}><strong>apiKeySource (conditionally required)</strong></p>

The source of the API key in the request or message.
This is required when the guard type is `apiKey`, ignored otherwise.

This is expected to be in the format `$.*` where `*` is the field in the request or message
that contains the API key.
For example, in a HTTP request, an api key in the `Th-Api-Key` header would be `$.headers.Th-Api-Key`.
For HTTP requests, the token sources can be `$.headers.`, `$.query.`, `$.body.`, `$.cookies.`.

In a WebSocket message a token in the message data would be `$.data.apiKey`, assuming a message structure such as:
```json
{
    "event": "authenticate",
    "data": {
        "apiKey": "..."
    }
}
```

**field type**

string | [valueSourceConfiguration](#valuesourceconfiguration)

**examples**

`$.headers.Th-Api-Key`

`$.query.apiKey`

`$.body.apiKey`

`$.cookies.apiKey`

`$.data.apiKey`

```yaml
- protocol: "http"
  source: "$.headers.Th-Api-Key"
- protocol: "websocket"
  source: "$.data.apiKey"
```
___

### valueSourceConfiguration

Configuration for a value source used to extract values such as API keys
or JWTs from a request or message.

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
For example, in a HTTP request, an api key in the `Th-Api-Key` header would be `$.headers.Th-Api-Key`.
For HTTP requests, the token sources can be `$.headers.`, `$.query.`, `$.body.`, `$.cookies.`.

In a WebSocket message, a token in the message data would be `$.data.apiKey`, assuming a message structure such as:
```json
{
    "event": "authenticate",
    "data": {
        "apiKey": "..."
    }
}
```

**field type**

string

**examples**

`$.headers.Th-Api-Key`

`$.query.token`

`$.body.apiKey`

`$.cookies.authToken`

`$.data.apiKey`
___

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
                basePath:
                    - "/"
                normalizeBasePath: false
                certificateId: "${variables.certificateId}"
                securityPolicy: "TLS_1_2"
            tracingEnabled: true
            auth:
                defaultGuard: "jwt"
                guards:
                    jwt:
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
            protocols: ["websockets"]
            cors:
                allowOrigins:
                    - "https://example.com"
                    - "https://another.example.com"
            domain:
                domainName: "api.example.com"
                basePath:
                    - "/"
                normalizeBasePath: false
                certificateId: "${variables.certificateId}"
                securityPolicy: "TLS_1_2"
            tracingEnabled: true
            auth:
                defaultGuard: "jwt"
                guards:
                    jwt:
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
                basePath:
                    - "/"
                normalizeBasePath: false
                certificateId: "${variables.certificateId}"
                securityPolicy: "TLS_1_2"
            tracingEnabled: true
            auth:
                defaultGuard: "jwt"
                guards:
                    jwt:
                        issuer: "https://identity.twohundred.cloud/oauth2/v1/"
                        tokenSource:
                            - protocol: "http"
                              source: "$.headers.Authorization"
                            - protocol: "websocket"
                              source: "$.data.token"
                        audience:
                            - "https://identity.twohundred.cloud/api/manage/v1/"
```

[^1]: Examples of Serverless API Gateways include [Amazon API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html), [Google Cloud API Gateway](https://cloud.google.com/api-gateway), and [Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-key-concepts).

## ⚠️ Limitations

There are limitations when it comes to deploying a `celerity/api` in Serverless environments. Only Amazon API Gateway supports the WebSocket protocol when opting for an architecture where handlers are deployed as serverless functions (e.g. AWS Lambda).
Azure and Google Cloud do not have an equivalent for WebSocket APIs in their Serverless API Gateway/Management offerings.

Azure API Management supports WebSocket APIs where the upstream backend is itself a WebSocket server. In this situation, you would have a Celerity runtime instance as your backend WebSocket server. Celerity **_does not_** manage this for you, as arguably, the runtime takes care of a lot of the API management features that would be provided by Azure API Management.
