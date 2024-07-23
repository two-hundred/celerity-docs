---
sidebar_position: 5
---

# `celerity/schedule`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/schedule` resource type is used to define an application where handlers are triggered at a specific time or interval based on a schedule.

A schedule application can be deployed to different target environments such as a Serverless event-driven flow[^1], a containerised environment, or a custom server.
For containerised and custom server environments, the Celerity runtime provides a polling mechanism to check for new messages in the queue or message broker.

[^1]: Examples of Serverless event-driven flows include [Amazon SQS Queues triggerring AWS Lambda Functions](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html), [Google Cloud Pub/Sub triggering Google Cloud Functions](https://cloud.google.com/functions/docs/calling/pubsub), and [Azure Queue Storage triggering Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-queue-trigger?tabs=python-v2%2Cisolated-process%2Cnodejs-v4%2Cextensionv5&pivots=programming-language-typescript).
