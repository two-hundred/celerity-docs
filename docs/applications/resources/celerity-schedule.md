---
sidebar_position: 4
---

# `celerity/schedule`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/schedule` resource type is used to define a scheduled rule to trigger handlers at a specific time or interval based on a schedule.

A schedule rule can be deployed to different target environments such as a Serverless event-driven flow[^1], a containerised environment, or a custom server.
For containerised and custom server environments, the Celerity runtime provides a polling mechanism to check for new messages in the queue or message broker.

Multiple schedule rules can be defined in a blueprint to trigger different handlers at different times or intervals.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/schedule` resource followed by examples of different configurations for the resource type and a table outlining what each configuration value maps to in different target environments.

### schedule (required)

A cron or rate expression that defines the schedule for the rule to trigger handlers.
The expected format follows the Amazon EventBridge cron and rate expression syntax that can be found [here](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions). This will then be converted into the appropriate format for the target environment at build/deploy time.

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

## Configuration Mappings

### Serverless Event-Driven Flows

The following is a table of `celerity/schedule` configuration fields and how they map to different target environments when the Celerity application is deployed as a Serverless event-driven flow[^1].

Celerity Schedule      | AWS EventBridge                                          | Google Cloud Scheduler       | Azure Function Trigger
---------------------- | -------------------------------------------------------- | ---------------------------- | ------------------------------------
schedule               | schedule - [cron and rate expressions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html#eb-cron-expressions)                                              | schedule - [cron expression](https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules)                        | schedule - [NCRONTAB expression](https://github.com/atifaziz/NCrontab)


[^1]: Examples of Serverless event-driven flows include [Amazon Event Bridge triggerring AWS Lambda Functions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-run-lambda-schedule.html), [Google Cloud Scheduler with Pub/Sub and Google Cloud Functions](https://cloud.google.com/scheduler/docs/tut-gcf-pub-sub), and [Timer triggers for Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=python-v2%2Cisolated-process%2Cnodejs-v4&pivots=programming-language-javascript).
