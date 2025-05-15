---
sidebar_position: 9
---

# `celerity/bucket`

**v2025-08-01 (draft)**

**blueprint transform:** `celerity-2025-08-01`

The `celerity/bucket` resource type defines an object storage bucket that can be used to store files and other data for a Celerity application.

## Specification

The specification is the structure of the resource definition that comes under the `spec` field of the resource in a blueprint.
The rest of this section lists fields that are available to configure the `celerity/bucket` resource followed by examples of different configurations for the resource and how buckets are implemented in target environments along with additional documentation.

### name

A unique name to use for the bucket.
If a name is not provided, a unique name will be generated for the bucket based on the blueprint that the bucket is defined in.

:::warning
Depending on the target environment, when you specify a name, you may not be able to perform updates that require replacing the bucket, if you need to replace the bucket, you may need to specify a new name.
:::

**type**

string

### encryption

The encryption configuration for the bucket.
When not provided, default encryption settings will be used for the target environment.

**type**

[encryptionConfiguration](#encryptionconfiguration)

### cors

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) configuration for objects in a bucket.

**type**

[corsConfiguration](#corsconfiguration)

### lifecycle

Lifecycle configuration for objects in the bucket.

**type**

[lifecycleConfiguration](#lifecycleconfiguration)

### logging

Logging configuration for the bucket.

**type**

[loggingConfiguration](#loggingconfiguration)

## Annotations

There are no annotations required for linking other resources to a `celerity/bucket` resource or modifying the behaviour of a bucket resource.

`linkSelector.byLabel` can be used to target buckets from other resource types.

## Outputs

### id

The ID of the created object storage bucket in the target environment.

**type**

string

**examples**

`arn:aws:s3:::my-bucket` (AWS)

`projects/my-project/buckets/my-bucket` (Google Cloud)

`my-bucket` (Azure)

## Data Types

### encryptionConfiguration

Encryption configuration for the bucket.

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>encryptionKeyId</strong></p>

The ID of the encryption key to use for encrypting objects in the bucket.

**field type**

string

**examples**

`arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab` (AWS)

___

<p style={{fontSize: '1.2em'}}><strong>encryptionAlgorithm</strong></p>

The algorithm to use for encryption.

For example, in AWS, you can use `AES256` or `aws:kms`.

This is only supported in some target environments.

**field type**

string

**examples**

`arn:aws:kms:us-west-2:123456789012:key/1234abcd-12ab-34cd-56ef-1234567890ab` (AWS)

___

### corsConfiguration

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>corsRules</strong></p>

An array of CORS rules to apply to the bucket.

**field type**

array[[corsRule](#corsrule)]

___

### corsRule

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>id</strong></p>

A unique identifier to be used for the rule.

**field type**

string

___

<p style={{fontSize: '1.2em'}}><strong>allowedOrigins</strong></p>

An array of allowed origins that your customers will be able to access the bucket from.

**field type**

array[string]

**examples**

`["http://example.com", "https://example.com"]`

___

<p style={{fontSize: '1.2em'}}><strong>allowedHeaders</strong></p>

An array of allowed headers that are specified in the `Access-Control-Request-Headers` header.
These headers are allowed in preflight OPTIONS requests.
In response to a preflight request, the object storage service will return the requested headers that are allowed.

**field type**

array[string]

**examples**

`["Content-Type", "Authorization"]`

___

<p style={{fontSize: '1.2em'}}><strong>allowedMethods</strong></p>

An array of HTTP methods that are allowed for the bucket across origins.

**field type**

array[string]

**examples**

`["GET", "POST"]`

___

<p style={{fontSize: '1.2em'}}><strong>exposedHeaders</strong></p>

An array of headers in the response that you want customers to be able to access from their applications.

**field type**

array[string]

**examples**

`["Content-Type"]`

___

<p style={{fontSize: '1.2em'}}><strong>maxAge</strong></p>

Time in seconds that the browser is to cache the preflight response for the requested resource
in the bucket.
This must be a positive integer, equal to or greater than 0.

**field type**

integer

___

### lifecycleConfiguration

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>rules</strong></p>

An array of lifecycle rules to apply to the bucket.

:::warning
Some provider-specific fields in lifecycle rule configurations may be excluded due to the lack
of an equivalent across all target environments.
:::

**field type**

array[[lifecycleRule](#lifecyclerule)]

___

### lifecycleRule

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>id (required)</strong></p>

A unique identifier to be used for the rule.

**field type**

string

___

<p style={{fontSize: '1.2em'}}><strong>enabled (required)</strong></p>

Whether or not the rule is enabled.

**field type**

boolean

___

<p style={{fontSize: '1.2em'}}><strong>abortIncompleteMultipartUpload</strong></p>

Specifies the number of days after initiating a multipart upload that the multipart upload must be completed. If the multipart upload is not completed within the specified number of days, the object storage service will abort the multipart upload and delete the parts that were uploaded.

This field is supported by the following target environments:

- AWS (Amazon S3)
- Google Cloud (Cloud Storage)

**field type**

[abortIncompleteMultipartUploadConfig](#abortincompletemultipartuploadconfig)

___

<p style={{fontSize: '1.2em'}}><strong>expirationDate</strong></p>

Specifies the date after which objects matching the rule in the bucket will expire.
This is expected to be an ISO 8601 date string.

This field is supported by the following target environments:

- AWS (Amazon S3)

**field type**

string

**examples**

`2024-07-22T00:00:00Z`

___

<p style={{fontSize: '1.2em'}}><strong>expirationInDays</strong></p>

Specifies the number of days after the creation date of an object that the object will expire.

This field is supported by the following target environments:

- AWS (Amazon S3)
- Google Cloud (Cloud Storage)
- Azure (Blob Storage)

**field type**

integer

**examples**

`365`

___

<p style={{fontSize: '1.2em'}}><strong>noncurrentVersionExpiration</strong></p>

Specifies when noncurrent versions of objects in the bucket will expire.

This field is supported by the following target environments:

- AWS (Amazon S3)
- Google Cloud (Cloud Storage)
- Azure (Blob Storage)

**field type**

[noncurrentVersionExpirationConfig](#noncurrentversionexpirationconfig)

**examples**

`365`

___

<p style={{fontSize: '1.2em'}}><strong>noncurrentVersionTransitions</strong></p>

Specifies when noncurrent versions are transitioned to a different storage class.
Storage classes are simplified to the closest equivalent to `hot`, `cool` and `archive` storage classes,
this does not give precise control over the exact storage class in target environments with more granular storage classes.

This field is supported by the following target environments:

- AWS (Amazon S3)
- Google Cloud (Cloud Storage)
- Azure (Blob Storage)

**field type**

array[[noncurrentVersionTransitionConfig](#noncurrentversiontransitionconfig)]

**examples**

`365`

___

<p style={{fontSize: '1.2em'}}><strong>prefix</strong></p>

Specifies a prefix for the rule to apply to objects in the bucket.

**field type**

string

**examples**

`logs/`

___

<p style={{fontSize: '1.2em'}}><strong>transitions</strong></p>

Specifies when objects in the bucket will transition to a different storage class.
Storage classes are simplified to the closest equivalent to `hot`, `cool` and `archive` storage classes,
this does not give precise control over the exact storage class in target environments with more granular storage classes.

This field is supported by the following target environments:

- AWS (Amazon S3)
- Google Cloud (Cloud Storage)
- Azure (Blob Storage)

**field type**

array[[transitionConfig](#transitionconfig)]

**examples**

`365`


### abortIncompleteMultipartUploadConfig

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>daysAfterInitiation</strong></p>

The number of days after initiating a multipart upload that the multipart upload must be completed.

**field type**

integer

**examples**

`7`

___

### noncurrentVersionExpirationConfig

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>noncurrentDays</strong></p>

The number of days after which noncurrent versions of objects in the bucket will expire.

**field type**

integer

**examples**

`30`

___

### noncurrentVersionTransitionConfig

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>targetStorageClass (required)</strong></p>

The storage class to transition noncurrent versions of objects to.

See [Storage Class Mappings](#storage-class-mappings) for more information on how provider-specific storage classes are mapped to the simplified model.

**field type**

string

**allowed values**

`cool` | `archive`

___

<p style={{fontSize: '1.2em'}}><strong>transitionInDays (required)</strong></p>

The number of days after which noncurrent versions of objects in the bucket will be transitioned to the target storage class.

**field type**

integer

___

### transitionConfig

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>targetStorageClass (required)</strong></p>

The storage class to transition objects to.

See [Storage Class Mappings](#storage-class-mappings) for more information on how provider-specific storage classes are mapped to the simplified model.

**field type**

string

**allowed values**

`cool` | `archive`

___

<p style={{fontSize: '1.2em'}}><strong>transitionInDays (required)</strong></p>

The number of days after which objects in the bucket will be transitioned to the target storage class.

**field type**

integer

___

### loggingConfiguration

#### FIELDS

___

<p style={{fontSize: '1.2em'}}><strong>destinationBucket</strong></p>

The name of the bucket to save server access log files to.
By default, logs will be saved to the same bucket.

**field type**

string

**examples**

`my-logs-bucket`

___

<p style={{fontSize: '1.2em'}}><strong>logFilePrefix</strong></p>

The prefix to apply to log files saved in the destination bucket.
If you store log files from multiple buckets in a single bucket, you can use this prefix to differentiate between them.

**field type**

string

**examples**

`logs/`

___

## Linked From

#### [`celerity/handler`](/docs/applications/resources/celerity-handler)

When a handler links out to a bucket, it will be configured with permissions and environment variables that enable the handler to interact with the bucket. If a secret store is associated with the handler or the application that it is a part of, the bucket configuration will be added to the secret store instead of environment variables. You can use guides and templates to get an intuition for how to source the configuration and interact with object storage services using the handlers SDK.

:::warning Opting out of the handlers SDK for buckets
You don't have to use the handlers SDK abstraction for buckets,
you can also grab the populated configuration directly and interact directly with the SDK for the object storage service for the chosen target environment. Doing so will require application code changes if you decide to switch target environments.
:::

## Links To

Secret store resources can not link to other resources.

## Examples

## Storage Class Mappings

To simplify object lifecycle configuration, the concept of `hot`, `cool` and `archive` storage classes for object transitions is used for a `celerity/bucket` resource. (This is the simplified model provided by Azure Blob Storage)

Google Cloud Storage and Amazon S3 have more granular sets of storage classes. The following table shows the mapping of storage classes to the simplified model:

| Celerity Bucket Storage Class | Google Cloud Storage | Amazon S3   | Azure Blob Storage |
| ----------------------------- | -------------------- | ----------- | ------------------ |
| hot                           |  STANDARD            | STANDARD    |  hot               |
| cool                          |  NEARLINE            | GLACIER_IR  |  cool              |
| archive                       |  ARCHIVE             | GLACIER     |  archive           |

## Target Environments

### Celerity::1

In the Celerity::1 local environment, object storage is provided by a [minio](https://min.io/) instance running on a container network on the local or CI machine.
Replication and encryption configuration will be ignored in the Celerity::1 environment.

Bucket notifications are published from the minio instance to a [valkey](https://github.com/valkey-io/valkey) queue on the local or CI machine using the [Redis bucket notification](https://min.io/docs/minio/linux/administration/monitoring/publish-events-to-redis.html) support in minio. The runtime will poll the queue for notifications and trigger handlers in response to bucket events.

:::note
[valkey](https://github.com/valkey-io/valkey) is also used as the `celerity/queue` implementation in Celerity::1, so the same behaviour is mostly reused for bucket notifications.
:::

:::warning No encryption in local & CI environments
Buckets are not encrypted in local & CI environment.
:::

### AWS

### Google Cloud

### Azure
