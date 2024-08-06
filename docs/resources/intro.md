---
sidebar_position: 1
---

# Introduction

Celerity provides a set of resource types that can be defined in a [blueprint](/docs/blueprint/intro) to describe the components of a Celerity application.

Resources make up the compute components of your application that can run on FaaS[^1] platforms, containerised environments, or other compute platforms without any changes to your application source code[^2]. 

It's important to understand that Celerity resources (`celerity/*`) do not cover infrastructure resources such as databases, storage, or message queues; the scope of the Celerity resource abstraction is limited to the infrastructure that runs your application code. Typically, you would define these resources in a separate blueprint and deploy them with a service such as [TwoHundred Architect](https://architect.twohundred.cloud), you could then feed the outputs of these resources as variables into your Celerity application blueprint.

Alternatively, you could use a service like [TwoHundred Architect](https://architect.twohundred.cloud) to define your entire application including infrastructure and application resources in a single blueprint and deploy them together.
One of the key benefits of this approach is that you can connect your Celerity application resources to your infrastructure resources with minimal effort utilising links that figure out the necessary configuration for you.

There are 4 main resource types for a Celerity application including [`celerity/api`](/docs/resources/celerity-api), [`celerity/consumer`](/docs/resources/celerity-consumer), [`celerity/schedule`](/docs/resources/celerity-schedule) and [`celerity/handler`](/docs/resources/celerity-handler).
In addition to these, there is also a convenience [`celerity/handlerConfig`](/docs/resources/celerity-handler-config) resource type that can be used to define shared configuration for a set of handlers.
Each of these resources are versioned over time, the implementation of these resource types are spread across the Celerity runtime and build engine.
The runtime and build engine projects will indicate which resource versions are supported for a given version of the software.

The `celerity/api`, `celerity/consumer` and `celerity/schedule` resource types can be composed together to make up a single application.
Depending on the target environment, the Celerity build engine will ensure the necessary infrastructure is provisioned to support each of these resource types.

:::note
Blueprints are not exclusive to Celerity resources.
The blueprint specification and core framework implementation are designed to be generic and can be used to describe any kind of resources, not just Celerity resources.
You can even use the Blueprint framework as a part of a more general purpose deployment system for known cloud providers or any kind of resources that can be managed with an API.
:::

[^1]: Function-as-a-Service such as AWS Lambda, Google Cloud Functions, and Azure Functions.
[^2]: Minimal configuration changes that feed into the Celerity Build process are required. Changes to your source code may be required if you are switching cloud providers and your application talks to vendor-specific services, such as AWS S3, Google Cloud Storage, or Azure Blob Storage.
