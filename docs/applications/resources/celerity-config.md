---
sidebar_position: 8
---

# `celerity/config`

**v2025-08-01 (draft)**

**blueprint transform:** `celerity-2025-08-01`

The `celerity/config` resource type defines a secrets and configuration store to be used by a Celerity application.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/config` resource followed by examples of different configurations for the resource and how secret and configuration stores are implemented in target environments along with additional documentation.

Depending on the target environment, secrets and configuration for an application will be stored in one of two ways.
This first would be an encrypted collection of key value pairs that will typically be a JSON-encoded string.
The second would be a set of individually encrypted secrets and plain text configuration values, where non-sensitive configuration values will need to be specified in the `plaintext` field of the resource spec.

You have 2 options for configuring a Celerity application, use a secret and configuration store or environment variables. It is recommended to use a secret and configuration store, or at least a combination of both, where environment variables for your application are sourced at build time from a secrets and configuration store. Celerity facilitates the latter with annotations that can be used with the application resource types such as `celerity/api`.

### name

A unique name to use for the secret and configuration store.
If a name is not provided, a unique name will be generated for based on the blueprint that the secret and configuration store is defined in.

**type**

string

### values

A map of key/value pairs to be stored in the secret and configuration store.
All values defined here will be stored as encrypted secrets, unless the key is included in the `plaintext` field, indicating that the value is a non-sensitive configuration value.

:::warning
If the keys defined in this field clash with auto-generated secrets and configurations that are created and populated for linked resources, the values in this field will be overwritten.

Usually, auto-generated secrets and configurations will be prefixed by the special prefix `CELERITY_APP_` used internally by Celerity in the runtime and SDK to load secrets and configuration values for your handlers.
To avoid values defined in this field being overwritten, avoid using the `CELERITY_APP_` prefix in your config value keys.
:::

**type**

mapping[string, string | number | boolean]

### plaintext

A list of keys that do not hold sensitive values and should be stored as plain text configuration values.

Depending on the target environment, these values may be stored as plain text or included in a JSON-encoded string of key/value pairs that is stored as an encrypted secret.

**type**

array[string]

### replicate

A boolean value indicating whether the secret and configuration store should be replicated across multiple regions.
Celerity will attempt to replicate the secret and configuration store across multiple regions if the target environment supports it, see the [target environments documentation](#target-environments) for more information on how this is implemented.

**type**

boolean

### encryptionKeyId

The ID of the encryption key to use for encrypting secrets in the store.
A default, platform-specific encryption key will be used if this field is not provided.

**type**

string

## Annotations

There are no annotations required for linking other resources to a `celerity/config` resource or modifying the behaviour of a secret and configuration store resource.

`linkSelector.byLabel` can be used to target secret and configuration stores from other resource types.

## Outputs

Outputs are computed values that are accessible via the `{resourceName}.spec.*` field accessor in a blueprint substitution.
For example, if the resource name is `myConfigStore`, the output would be accessible via `${myConfigStore.spec.id}`.

### id

The ID of the created secret and configuration store in the target environment.

**type**

string

**examples**

`arn:aws:secretsmanager:us-west-2:123456789012:secret:my-secret-123456` (AWS Secrets Manager)

`arn:aws:ssm:us-west-2:123456789012:parameter/app/config/*` (AWS Parameter Store)

_A prefix is used for AWS parameter store as each parameter will have its own resource in AWS._

`projects/my-project/secrets/my-secret` (Google Cloud)

`my-secret` (Azure)

## Linked From

#### [`celerity/api`](/docs/applications/resources/celerity-api)

An API can link to a store to access secrets and configuration at runtime, linking an application to a config resource will automatically make secrets and configuration accessible to all handlers in the application without having to link each handler to the config resource.

#### [`celerity/workflow`](/docs/applications/resources/celerity-workflow)

A workflow can link to a store to access secrets and configuration at runtime, linking an application to a config resource will automatically make secrets and configuration accessible to all handlers in the application without having to link each handler to the config resource.

#### [`celerity/consumer`](/docs/applications/resources/celerity-consumer)

A consumer can link to a store to access secrets and configuration at runtime, linking an application to a config resource will automatically make secrets and configuration accessible to all handlers in the application without having to link each handler to the secret store.

#### [`celerity/schedule`](/docs/applications/resources/celerity-schedule)

A schedule application can link to a store to access secrets and configuration at runtime, linking an application to a config resource will automatically make secrets and configuration accessible to all handlers in the application without having to link each handler to the config resource.

#### [`celerity/handler`](/docs/applications/resources/celerity-handler)

When a handler links out to a config resource, it will be configured with permissions and environment variables that will enable the handler to fetch secrets and configuration. Secrets and configuration will be fetched and passed into your handlers when they are created with the handlers SDK.

## Links To

Config resources can not link to other resources.

## Examples

### Minimal Configuration

```yaml
version: 2025-05-12
transform: celerity-2025-08-01
resources:
  myAppConfig:
    type: "celerity/config"
    metadata:
      displayName: My App Config
    spec:
      name: "my-app-config"
      plaintext:
        - "FETCH_TIMEOUT"
        - "MAX_RETRIES"
```

### Replicated Config Store with Custom Encryption Key

```yaml
version: 2025-05-12
transform: celerity-2025-08-01
variables:
  customEncryptionKeyId:
    type: string
    description: |
      The ID of the custom encryption key to use for encrypting secrets in the config store.
      For example, `arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab`
      for AWS KMS master key when deploying to AWS.
resources:
  myAppConfig:
    type: "celerity/config"
    metadata:
      displayName: My App Config
    spec:
      name: "my-app-config"
      replicate: true
      encryptionKeyId: "${variables.customEncryptionKeyId}"
```

## Pre-population Behaviours

When an application or handler links to a config resource, Celerity will inspect the other resources in the blueprint to determine if any secrets or configuration need to be pre-populated in the config store.
For example, if an application has handlers that link to an SQL database, Celerity will pre-populate the config store with the database connection details.

For resource types that have an abstraction in the handlers SDK (e.g. `celerity/topic`), the config store will be populated with secret and configuration values with special prefixes that can be picked up by the SDK (or runtime). What this means is that as a developer, you don't need to worry about loading secrets/configuration in your handler code or knowing the values of certain secrets that the handlers SDK will use. Secrets and configuration will also be passed into your `celerity/handler` functions to access values that are specific to the application.

## Target Environments

### Celerity::1

In the Celerity::1 local environment, secrets and configuration are stored as a key/value pair in a [valkey](https://github.com/valkey-io/valkey) instance running on a container network or directly on the host for a local or CI machine.
The value will be the JSON-encoded string holding all the secrets and configuration values for the application.
In the Celerity local environment, the same valkey instance will be reused for config stores and cache resource types.
Replication and encryption configuration will be ignored in the Celerity::1 environment.

:::warning No encryption in local & CI environments
Application secrets are not encrypted in local & CI environment, this would be the same situation if `.env` or configuration files were being used on the developer's machine.
It is best to avoid storing any production secrets in your CI environments, however, secrets will be redacted from logs when running in CI environments.
:::

### AWS

#### Secrets Manager (Default)

In the AWS environment, by default, secrets and configuration is stored with the [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) service.

As long as the `plaintext` field is omitted or empty, a secret store will be stored as a single secret in the Secrets Manager service as a JSON-encoded string of key/value pairs. When the `plaintext` field has at least one value, [Parameter Store](#parameter-store) will be used instead.

A secret store will be stored as a single secret in the Secrets Manager service as a JSON-encoded string of key/value pairs.

The maximum size of a secret in AWS Secrets Manager is 64KB, if the secret store exceeds this size, saving the secret will fail. To get around this you can split your secrets and configuration across multiple `celerity/config` resources.

If `replicate` is set to `true`, the secret store will be replicated across multiple regions.
The regions **must** be specified in the [app deploy configuration](#app-deploy-configuration).

If the `encryptionKeyId` is provided, it must be the ARN of a [KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html) in the same region as the secret store.

If `replicate` is set to `true` and `encryptionKeyId` is provided, the encryption key will be ignored; region-specific encryption keys must be provided for each region in the app deploy configuration.

#### Parameter Store

In the AWS environment, secrets and configuration can also be stored with the [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) service.

If the `plaintext` field has at least one value, the `celerity/config` resource will be stored as a set of individual parameters in the Parameter Store service.

If `replicate` is set to `true`, parameters will be replicated across multiple regions.
The regions **must** be specified in the [app deploy configuration](#app-deploy-configuration). Celerity will make copies of the parameters in each region as AWS Parameter Store does not have built-in support for cross-region replication.

If the `encryptionKeyId` is provided, it must be the ARN of a [KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html) in the same region as the parameters.

If `replicate` is set to `true` and `encryptionKeyId` is provided, the encryption key will be ignored; region-specific encryption keys must be provided for each region in the app deploy configuration.

### Google Cloud

In the Google Cloud environment, secrets and configuration is stored with the [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs) service.

A secret store will be stored as a single secret in the Secret Manager service as a JSON-encoded string of key/value pairs.

The maximum size of a secret in Google Cloud Secret Manager is 64KB, if the secret store exceeds this size, saving the secret will fail. To get around this you can split your secrets and configuration across multiple `celerity/config` resources.

If `replicate` is set to `true`, the secret store will be replicated across multiple regions in a way that is managed by Google Cloud through the [Automatic](https://cloud.google.com/secret-manager/docs/choosing-replication#automatic) replication policy.

The `encryptionKeyId` field is not supported in Google Cloud Secret Manager, Google Cloud manages encryption keys for you.

### Azure

In the Azure environment, secrets and configuration is stored with the [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/overview) service.

A secret store will be stored as a single secret in the Key Vault service as a JSON-encoded string of key/value pairs.

The maximum size of a secret in Azure Key Vault is 25KB, if the secret store exceeds this size, saving the secret will fail. To get around this you can split your secrets and configuration across multiple `celerity/config` resources.

If `replicate` is set to `true`, the secret store will be replicated across multiple regions in a way that is managed by Azure.

The `encryptionKeyId` field is not supported in Azure Key Vault, Azure manages encryption keys for you.

## App Deploy Configuration

Configuration specific to a target environment can be defined for `celerity/config` resources in the [app deploy configuration](/cli/docs/app-deploy-configuration) file.

This section lists the configuration options that can be set in the `deployTarget.config` object in the app deploy configuration file.

### aws.config.replicateRegions

A comma-separated list of regions to replicate the secret and configuration store to.
This is required if `replicate` is set to `true` in the `celerity/config` resource and the target environment is `aws` or `aws-serverless`.
This value will be ignored if `replicate` is set to `false` or is not set.

**Type**

string

**Deploy Targets**

`aws`, `aws-serverless`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.config.replicateRegions": "us-east-1,us-west-2"
    }
  }
}
```

### aws.config.regionKMSKeys.\<region\>

A mapping of region name to KMS key ARN where the region name must match one of the region names in the `aws.config.replicateRegions` field.
One of these fields must be set for each region in the `aws.config.replicateRegions` field.
This is required if `replicate` is set to `true` in the `celerity/config` resource.
This value is ignored if `replicate` is set to `false` or is not set.

**Type**

string

**Deploy Targets**

`aws`, `aws-serverless`

**Example**

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.config.replicateRegions": "us-east-1,us-west-2",
      "aws.config.regionKMSKeys.us-east-1": "arn:aws:kms:us-east-1:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab",
      "aws.config.regionKMSKeys.us-west-2": "arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab"
    }
  }
}
```
