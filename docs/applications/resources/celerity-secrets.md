---
sidebar_position: 8
---

# `celerity/secrets`

**v2024-07-22 (draft)**

**blueprint transform:** `celerity-2024-07-22`

The `celerity/secrets` resource type defines a secrets and configuration store to be used by a Celerity application.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/secrets` resource followed by examples of different configurations for the resource and how secret stores are implemented in target environments along with additional documentation.

To simply configuration management, Celerity does not provide separate secrets and configuration stores. Instead, non-sensitive configuration values are stored in the same secure, encrypted store as secrets. You have 2 options for configuring a Celerity application, use a secret store or environment variables.

This models a secret store as a mapping of secret names to secret values (usually as a JSON-encoded string) as opposed to storing individual secrets as separate resources; because of this, some features of cloud secret manager services are not supported.

### name

A unique name to use for the secret store.
If a name is not provided, a unique name will be generated for the secret store based on the blueprint that the secret store is defined in.

**type**

string


### replicate

A boolean value indicating whether the secret store should be replicated across multiple regions.
Celerity will attempt to replicate the secret store across multiple regions if the target environment supports it, see the [target environments documentation](#target-environments) for more information on how this is implemented.

**type**

boolean

### encryptionKeyId

The ID of the encryption key to use for encrypting secrets in the secret store.
A default, platform-specific encryption key will be used if this field is not provided.

**type**

string

## Annotations

There are no annotations required for linking other resources to a `celerity/secrets` resource or modifying the behaviour of a secret store resource.

`linkSelector.byLabel` can be used to target secret stores from other resource types.

## Outputs

### id

The ID of the created secret store in the target environment.

**type**

string

**examples**

`arn:aws:secretsmanager:us-west-2:123456789012:secret:my-secret-123456` (AWS)

`projects/my-project/secrets/my-secret` (Google Cloud)

`my-secret` (Azure)

## Linked From

#### [`celerity/api`](/docs/applications/resources/celerity-api)

An API can link to a secret store to access secrets at runtime, linking an application to a secret store will automatically make secrets accessible to all handlers in the application without having to link each handler to the secret store.

#### [`celerity/workflow`](/docs/applications/resources/celerity-workflow)

A workflow can link to a secret store to access secrets at runtime, linking an application to a secret store will automatically make secrets accessible to all handlers in the application without having to link each handler to the secret store.

#### [`celerity/consumer`](/docs/applications/resources/celerity-consumer)

A consumer can link to a secret store to access secrets at runtime, linking an application to a secret store will automatically make secrets accessible to all handlers in the application without having to link each handler to the secret store.

#### [`celerity/schedule`](/docs/applications/resources/celerity-schedule)

A schedule application can link to a secret store to access secrets at runtime, linking an application to a secret store will automatically make secrets accessible to all handlers in the application without having to link each handler to the secret store.

#### [`celerity/handler`](/docs/applications/resources/celerity-handler)

When a handler links out to a secret store, it will be configured with permissions and environment variables that will enable the handler to fetch secrets. Secrets will be fetched and passed into your handlers when they are created with the handlers SDK.

## Links To

Secret store resources can not link to other resources.

## Examples

### Minimal Configuration

```yaml
version: 2023-04-20
transform: celerity-2024-07-22
resources:
    mySecretStore:
        type: "celerity/secrets"
        metadata:
            displayName: My Secret Store
        spec:
            name: "my-secret-store"
```

### Replicated Secret Store with Custom Encryption Key

```yaml
version: 2023-04-20
transform: celerity-2024-07-22
variables:
    customEncryptionKeyId:
        type: string
        description: |
            The ID of the custom encryption key to use for encrypting secrets in the secret store.
            For example, `arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab`
            for AWS KMS master key when deploying to AWS.
resources:
    mySecretStore:
        type: "celerity/secrets"
        metadata:
            displayName: My Secret Store
        spec:
            name: "my-secret-store"
            replicate: true
            encryptionKeyId: "${variables.customEncryptionKeyId}"
```

## Pre-population Behaviours

When an application or handler links to a secret store, Celerity will inspect the other resources in the blueprint to determine if any secrets need to be pre-populated in the secret store.
For example, if an application has handlers that link to an SQL database, Celerity will pre-populate the secret store with the database connection details.

For resource types that have an abstraction in the handlers SDK (e.g. `celerity/topic`), the secret store will be populated with secret values with special prefixes that can be picked up by the SDK (or runtime). What this means is that as a developer, you don't need to worry about loading secrets/configuration in your handler code or knowing the values of certain secrets that the handlers SDK will use. Secrets will also be passed into your `celerity/handler` functions to access secrets and configuration that are specific to the application.

## Target Environments

### Celerity::1

In the Celerity::1 local environment, secrets are stored as a key/value pair in a [valkey](https://github.com/valkey-io/valkey) instance running on a container network on the local or CI machine.
The value will be the JSON-encoded string holding all the secrets and configuration values for the application.
In the Celerity local environment, the same valkey instance will be reused for secret stores and cache resource types.
Replication and encryption configuration will be ignored in the Celerity::1 environment.

:::warning No encryption in local & CI environments
Application secrets are not encrypted in local & CI environment, this would be the same situation if `.env` or  configuration files were being used on the developer's machine.
It is best to avoid storing any production secrets in your CI environments, however, secrets will be redacted from logs when running in CI environments.
:::

### AWS

In the AWS environment, secrets are stored with the [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) service.

A secret store will be stored as a single secret in the Secrets Manager service as a JSON-encoded string of key/value pairs.

The maximum size of a secret in AWS Secrets Manager is 64KB, if the secret store exceeds this size, saving the secret will fail. To get around this you can split your secrets and configuration across multiple `celerity/secrets` resources.

If `replicate` is set to `true`, the secret store will be replicated across multiple regions.
The regions **must** be specified in the [deploy configuration](/deploy-engine/docs/deploy-configuration).

If the `encryptionKeyId` is provided, it must be the ARN of a [KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html) in the same region as the secret store.

If `replicate` is set to `true` and `encryptionKeyId` is provided, the encryption key will be ignored; region-specific encryption keys must be provided for each region in the deploy configuration.

### Google Cloud

In the Google Cloud environment, secrets are stored with the [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs) service.

A secret store will be stored as a single secret in the Secret Manager service as a JSON-encoded string of key/value pairs.

The maximum size of a secret in Google Cloud Secret Manager is 64KB, if the secret store exceeds this size, saving the secret will fail. To get around this you can split your secrets and configuration across multiple `celerity/secrets` resources.

If `replicate` is set to `true`, the secret store will be replicated across multiple regions in a way that is managed by Google Cloud through the [Automatic](https://cloud.google.com/secret-manager/docs/choosing-replication#automatic) replication policy.

The `encryptionKeyId` field is not supported in Google Cloud Secret Manager, Google Cloud manages encryption keys for you.

### Azure

In the Azure environment, secrets are stored with the [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/overview) service.

A secret store will be stored as a single secret in the Key Vault service as a JSON-encoded string of key/value pairs.

The maximum size of a secret in Azure Key Vault is 25KB, if the secret store exceeds this size, saving the secret will fail. To get around this you can split your secrets and configuration across multiple `celerity/secrets` resources.

If `replicate` is set to `true`, the secret store will be replicated across multiple regions in a way that is managed by Azure.

The `encryptionKeyId` field is not supported in Azure Key Vault, Azure manages encryption keys for you.
