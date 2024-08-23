---
sidebar_position: 3
toc_max_heading_level: 4
---

# Links

The link concept in blueprints defines a way to connect resources together with minimal configuration.
Links are implicit by default based on the [`linkSelector`](./specification#linkselectordefinitions) functionality that can target resources based on a label.

For example, let's say you have a serverless API resource to be deployed to AWS:

```yaml
resources:
  orderApi:
    type: "aws/serverless/api"
    metadata:
      displayName: Order API
    linkSelector:
      byLabel:
        app: orderApi
    spec:
        stageName: prod
```

To connect this API to the AWS Lambda functions that serve the routes of the API, you can add labels that match the `linkSelector` of the API resource:

```yaml
resources:
  # ...
  createOrderFunction:
    type: "aws/serverless/function"
    metadata:
      displayName: Create Order Function
      annotations:
        aws.serverless.lambda.http: true
        aws.serverless.lambda.http.path: /orders
        aws.serverless.lambda.http.method: post
      labels:
        app: orderApi
    spec:
      handler: createOrder.handler
      runtime: nodejs20.x
      codeUri: ./src

  getOrderFunction:
    type: "aws/serverless/function"
    metadata:
      displayName: Get Order Function
      annotations:
        aws.serverless.lambda.http: true
        aws.serverless.lambda.http.path: /orders/{orderId}
        aws.serverless.lambda.http.method: get
      labels:
        app: orderApi
    spec:
      handler: getOrder.handler
      runtime: nodejs20.x
      codeUri: ./src
```

You may be familiar with this kind of behaviour from Kubernetes services and selectors.

As you may have noticed, `metadata.annotations` is used to add information about the link, this lets a provider know exactly how to connect to the target resource when there are multiple options.
In the example above, there are multiple options as an AWS API Gateway can connect to lambda functions in different ways, such as for a route or a custom authorizer.

Annotations can also be used to provide additional configuration for finer control over the link, but should always have good defaults where possible to minimise the need for the level of configuration found in common IaC tooling.

## Link Implementation in Tools

For implementing a link, a tool or library (such as the [Blueprint Framework](../../blueprint-framework/docs/intro)) should provide a way to define links between resources as deployable units.

In practice, a link is not a cleanly defined resource that can be deployed and managed in isolation. Instead, it consists of configuration that is applied to resources on either side of the relationship and intermediary "glue" resources that need to exist to make the connection possible.

With this in mind, the modelling for a link should be done in a way that is transparent to the practicioner in what will be/has been created for a link but removes the need for the practicioner to define all the intermediary resources and link-enabling configuration themselves.

The "glue" resources used in a link should consist of resource types that are available for the practicioner to use directly. This ensures that in a situation where a link is not sufficient for the practicioner's needs, they can still create the resources they need directly. This also keeps the implementation of links modular and more easily maintainable than solutions where custom approaches are taken for managing the intermediary resources on a per-provider basis.

The same way resource state can be accessed through the use of [references](./specification#references--substitutions), the state of a link should be accessible with the `link(resourceA, resourceB)` function as per the [specification](./core-functions#link). This is useful for accesing state related to annotations used to configure a link.
When a link contains intermediary "glue" resources, the full state of these resources does not need to be made available through references, only the most relevant information that is needed to activate the link should be exposed. If the practicioner needs access to the full state of the intermediary resources, they should define the resources directly in the blueprint.
