---
sidebar_position: 4
---

# `celerity/schedule`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/schedule` resource type is used to define a scheduled rule to trigger handlers at a specific time or interval based on a schedule.

A schedule rule can be deployed to different target environments such as a Serverless event-driven flow[^1], a containerised environment, or a custom server.
For containerised and custom server environments, the default mode is for the Celerity runtime provides a polling mechanism to check for new messages in a queue or message broker. There are some exceptions like the Google Cloud Run target environment where a push model is used to trigger a scheduled run for a schedule application.

Multiple schedule rules can be defined in a blueprint to trigger different handlers at different times or intervals.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/schedule` resource followed by examples of different configurations for the resource type and a table outlining what each configuration value maps to in different target environments.

### schedule (required)

A cron or rate expression that defines the schedule for the rule to trigger handlers.
The expected format follows the Amazon EventBridge cron and rate expression syntax that can be found [here](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions). This will then be converted into the appropriate format for the target environment at build/deploy time.

**type**

string

## Annotations

Annotations define additional metadata that can determine the behaviour of the resource in relation to other resources in the blueprint or to add behaviour to a resource that is not in its spec.

### `celerity/vpc` 🔗 `celerity/schedule`

The following are a set of annotations that determine the behaviour of the schedule in relation to a VPC.
Appropriate security groups are managed by the VPC to schedule link.

When a VPC is not defined for the container-backed AWS, Google Cloud and Azure target environments, the default VPC for the account will be used.

VPC annotations and links do not have any effect for serverless environments.
Serverless schedules are no more than configuration of a schedule trigger for a serverless function.

:::warning
When a VPC is not defined for container-backed cloud environments, annotations in the `celerity/schedule` will apply to the default VPC for the account.
:::

<p style={{fontSize: '1.2em'}}><strong>celerity.schedule.vpc.subnetType</strong></p>

The kind of subnet that the schedule application should be deployed to.

**type**

string

**allowed values**

`public` | `private`

**default value**

`public` - When a VPC links to a schedule, the schedule will be deployed to a public subnet.

___

<p style={{fontSize: '1.2em'}}><strong>celerity.schedule.vpc.ingressType</strong></p>

The kind of ingress used for the schedule application.
This is only applicable when the schedule app is deployed to a containerised environment that subscribes to a queue or topic via a push model. (e.g. Google Cloud Run)

**type**

string

**allowed values**

`public` | `private`

**default value**

`public` - When a VPC links to a schedule, traffic will be accepted from the public internet via an application load balancer if one is configured for the application.

## Outputs

### queueId (optional)

The ID of the queue or pub/sub topic that is created for the schedule.
This output is **only** present in the outputs when the `sourceId` is a Celerity topic and the target environment requires a queue or pub/sub topic as an intermediary between the scheduler and the scheduled handler.

**type**

string | null

**examples**

`arn:aws:sqs:us-east-1:123456789012:example-queue-NZJ5JSMVGFIE` - An Amazon SQS Queue ARN

`projects/my-project/topics/my-topic` - A Google Cloud Pub/Sub Topic

## Linked From

#### [`celerity/vpc`](/docs/applications/resources/celerity-vpc)

Depending on the target environment, a schedule application may be deployed to a VPC.
When a schedule is combined into a single application with an API, consumer or other triggers for handlers,
a single VPC will be created for the application and all resource types that make up the application will be deployed into the VPC.
When deploying to serverless environments, a schedule is a placeholder for a connection between a scheduler, possible queue or pub/sub subscription and a handler, which does not require a VPC.

## Links To

#### [`celerity/handler`](/docs/applications/resources/celerity-handler)

Handlers contain the work the functionality that runs when a schedule is triggered.

#### [`celerity/secrets`](/docs/applications/resources/celerity-secrets)

Secrets can be used to store configuration and sensitive information such as API keys, database passwords, and other credentials that are used by the application.
A consumer can link to a secret store to access secrets at runtime, linking an application to a secret store will automatically make secrets accessible to all handlers in the application without having to link each handler to the secret store.

:::note
Where an application is made up of a composition of consumers, an API, schedules or other triggers, secrets only need to be linked to one of the application resource types.
:::

## Examples

```yaml
version: 2023-04-20
transform: celerity-2024-07-22
resources:
    jobSchedule:
        type: "celerity/schedule"
        metadata:
            displayName: Job Schedule
        linkSelector:
            byLabel:
                application: "jobs"
        spec:
            schedule: "rate(1 hour)"
```

## Target Environments

### Celerity::1

In the Celerity::1 local environment, a schedule application is deployed as a containerised version of the Celerity runtime that polls a queue for scheduled trigger messages.
Schedules are registered with a local scheduler that is used to send messages to the queue at the scheduled time or interval.

Links from VPCs to schedules are ignored for this environment as the schedule application is deployed to a local container network on a developer or CI machine.

### AWS

### AWS Serverless

### Google Cloud

### Google Cloud Serverless

### Azure

### Azure Serverless

## Configuration Mappings

### Serverless Event-Driven Flows

The following is a table of `celerity/schedule` configuration fields and how they map to different target environments when the Celerity application is deployed as a Serverless event-driven flow[^1].

Celerity Schedule      | AWS EventBridge                                          | Google Cloud Scheduler       | Azure Function Trigger
---------------------- | -------------------------------------------------------- | ---------------------------- | ------------------------------------
schedule               | schedule - [cron and rate expressions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions)                                              | schedule - [cron expression](https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules)                        | schedule - [NCRONTAB expression](https://github.com/atifaziz/NCrontab)


[^1]: Examples of Serverless event-driven flows include [Amazon Event Bridge triggerring AWS Lambda Functions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-run-lambda-schedule.html), [Google Cloud Scheduler with Pub/Sub and Google Cloud Functions](https://cloud.google.com/scheduler/docs/tut-gcf-pub-sub), and [Timer triggers for Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=python-v2%2Cisolated-process%2Cnodejs-v4&pivots=programming-language-javascript).
