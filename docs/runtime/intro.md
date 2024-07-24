---
sidebar_position: 1
---

# Introduction

The Celerity runtime allows you to run your applications in environments other than FaaS[^1] offerings without any changes to your application source code[^2].

[^1]: Function-as-a-Service such as AWS Lambda, Google Cloud Functions, and Azure Functions.
[^2]: Minimal configuration changes that feed into the Celerity Build process are required. Changes to your source code may be required if you are switching cloud providers and your application talks to vendor-specific services, such as AWS S3, Google Cloud Storage, or Azure Blob Storage.

The Celerity runtime is designed to be deployed in containerised environments, such as Kubernetes, Docker, and the container orchestration platforms that use these technologies such as Amazon ECS, Google Kubernetes Engine, and Azure Kubernetes Service.

The runtime supports applications that provide HTTP APIs, WebSocket APIs and those that poll messages from a queue or message broker.

## How the runtime works

The runtime takes your application source code organised with handlers as entry points along with a configuration file that describes the kind of application you want to run in the form of a blueprint.
Based on the configuration, it will set up the appropriate server or polling mechanism to handle incoming requests or messages and set up routing for your handlers.

### Example Application Structure

The following example would be how you might organise a simple application that provides a HTTP API with two endpoints:

```python title="/orders_api/handlers.py"
from celerity_handlers_sdk import (
    create_http_handler, Request, Response, HttpException
)
from pydantic_core import ValidationError

# This would be a module in your application that provides models with
# validation rules and a service to interact with your data store.
from orders_api.services.orders import OrdersService, CreateOrderPayload

def _save_order(req: Request, orders_service: OrdersService) -> Response:
    try:
        order_payload = CreateOrderPayload.model_validate(req.json())
        order = orders_service.save_order(order_payload)
        return Response(201, order.model_dump())
    except ValidationError as exc:
        raise HttpException(400, exc.errors())

save_order = create_http_handler(_save_order)

def _get_order(req: Request, orders_service: OrdersService) -> Response:
    order_id = req.path_params['order_id']
    order = orders_service.get_order(order_id)

    if order is None:
        raise HttpException(404, 'Order not found')

    return Response(200, order.model_dump())

get_order = create_http_handler(_get_order)
```

```yaml title="/application.blueprint.yaml"
version: 2023-04-20
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

    saveOrderHandler:
        type: "celerity/handler"
        metadata:
            displayName: Save Order Handler
            labels:
                application: "orders"
            annotations:
                celerity.handler.http: true
                celerity.handler.http.path: "/orders"
                celerity.handler.http.method: POST
        spec:
            codeLocation: "./orders_api"
            handler: "handlers.save_order"
            runtime: python3.12
    
    getOrderHandler:
        type: "celerity/handler"
        metadata:
            displayName: Get Order Handler
            labels:
                application: "orders"
            annotations:
                celerity.handler.http: true
                celerity.handler.http.path: "/orders/{order_id}"
                celerity.handler.http.method: GET
        spec:
            codeLocation: "./orders_api"
            handler: "handlers.get_order"
            runtime: python3.12
```

### Evaluating the Example Application

At build time, the Celerity Build process will prepare the correct infrastructure to run your application based on the target environment specified in the process along with configuration in the blueprint file.
For example, the build process will select the correct runtime image for Python 3.12 and prepare the necessary runtime-specific environment variables to run your application.

On startup, the runtime will locate the blueprint file via the `CELERITY_BLUEPRINT` environment variable that will be prepared by the Celerity Build process. The runtime will then attempt to load and parse the blueprint file.

In this process, it will read the `celerity/api` resource and determine that it needs to set up a HTTP server to handle incoming requests. It will then read the `celerity/handler` resources and load each handler module dynamically based on the `codeLocation` and `handler` fields in the resource and wire them up to the corresponding route defined in the `httpApiRoute` definition.

The HTTP server will then listen for incoming requests and route them to the appropriate handler based on the method and path of the request.

## Supported Languages

The Celerity runtime currently supports the following languages with tailored SDK support:

- Python
- Node.js
- Java
- C#
- Go
- Rust

The runtime also supports any other language that can be compiled ahead of time into an executable binary.
Languages such as C++, C or Zig can be used but lack the official SDK support that the languages listed above have. For these languages, you can use the [Core Runtime API](#) to interact with the runtime from your handler code.
