---
sidebar_position: 1
---

# Registry Protocol

This document describes the protocol for a registry service that can be used to discover and install plugins.
This is the protocol used by the Celerity CLI plugin commands to discover and download plugins.

## Overview

The main implementation of this protocol is the [Celerity Registry](https://registry.celerityframework.io) which can be found at `registry.celerityframework.io`.
Custom implementations of this protocol can be used to provide alternate registries for plugins so you do not need to publish them to the public Celerity Registry.
The most common use case for implementing a custom registry is to provide a private registry for your organisation's plugins.

This document does not cover the API for provider and transformer plugins, only the protocol for discovery and installation of plugins. Check out the [SDK documentation](../sdk) for more information on building plugins.

:::warning
The public Celerity Registry implements additional functionality to provide a rich experience for exploring plugins in the Registry UI, functionality that is not covered by this protocol should not be implemented in custom registries as the interfaces may change without warning.
:::

## Plugin Identifiers

There are two formats for plugin identifiers:

- `{hostname/}?{namespace}/{plugin}` - This format is used for plugins that are hosted on a custom registry.
- `{namespace}/{plugin}` - This format is used for plugins that are hosted in the Celerity Registry.

An example for the former format would be `registry.customhost.com/celerity/azure`.

An example for the latter format would be `celerity/aws`.

Plugin IDs are globally unique and are used to identify a plugin regardless of type, a transformer plugin and a provider plugin must **_not_** have the same ID.

`{namespace}/{plugin}` is shorthand for a global ID of `registry.celerityframework.io/{namespace}/{plugin}`. The Celerity CLI uses the full address as a global identifier for a plugin, so changing the host/registry for a plugin will require you to update the plugin ID to include the new registry host.

### IDs and Plugin Types

One way of differentiating between provider and transformer plugins could be to use the overarching service name for the provider and add a suffix to the ID for the transformer.
For example, an AWS provider plugin is expected to be a provider of resources from AWS services, so a plugin ID of `celerity/aws` would make sense for a provider plugin.
You may also have a transformer plugin that carries out transformations of AWS service resources, in this case, you could have a plugin ID of `celerity/aws-transform`.

## Plugin Versions

Plugins are versioned using [Semantic Versioning](https://semver.org/).
Each unique plugin ID can have multiple versions where each version has its own documentation for the API of that particular plugin version.

All versions of a plugin are considered to be the same plugin by an instance of the Deploy Engine as it can only have one version of a plugin installed at a time.

## List Versions

`GET /{namespace}/{plugin}/versions`

Lists the available versions of a plugin in the registry.

### Parameters

- **namespace** (path, string) - The namespace of the plugin.
- **plugin** (path, string) - The name of the plugin.

### Example Request

```bash
curl -X GET https://api.registry.celerityframework.io/v1/plugins/celerity/aws/versions
```

### Response

Content-Type: `application/json`

Example:

```json
{
  "versions": [
    {
      "version": "1.0.0",
      "supportedProtocols": ["1.0", "2.2"],
      "supportedPlatforms": [
        { "os": "darwin", "arch": "amd64" },
        { "os": "linux", "arch": "amd64" },
        { "os": "linux", "arch": "arm" },
        { "os": "windows", "arch": "amd64" }
      ]
    },
    {
      "version": "1.0.1",
      "supportedProtocols": ["1.4"],
      "supportedPlatforms": [
        { "os": "darwin", "arch": "amd64" },
        { "os": "darwin", "arch": "arm" },
        { "os": "linux", "arch": "amd64" },
        { "os": "linux", "arch": "arm" },
        { "os": "windows", "arch": "amd64" }
      ]
    }
  ]
}
```

### Response Properties

A successful response will contain a JSON object containing the `versions` property which is an array of objects that describe the available versions for the plugin.
Each version object has the following properties:

- **version** (required, string) - The version of the plugin. This must be unique across all objects in the response array.

- **supportedProtocols** (required, array of strings) - The supported plugin protocols for this version of the plugin. Each protocol should be given in the `MAJOR.MINOR` format where there should be only one instance of each major version and the minor version indicates the highest minor version that is supported. <br />\
  This information will be used by Celerity to inform the user of the compatibility of the plugin with the current version of the Celerity Deploy Engine.

- **supportedPlatforms** (required, array of objects) - The supported platforms for this version of the plugin. Each object should contain the `os` and `arch` properties. `os` must be one of `darwin`, `linux` or `windows`. `arch` must be one of `amd64` or `arm`. <br />\
  This information will be used by Celerity to inform the user of the compatibility of the plugin with the current platform.

Return a `404 Not Found` response to indicate that the requested plugin does not exist in the registry.

## Retrieve Plugin Package

`GET /{namespace}/{plugin}/{version}/package/{os}/{arch}`

Retrieves the download URL and essential metadata for the plugin package for a perticular version of the plugin for a specified operating system and architecture.

The Celerity CLI will use this endpoint to download the plugin package for installation once the matching version has been selected in configuration by the end-user.

### Parameters

- **namespace** (path, string) - The namespace of the plugin.
- **plugin** (path, string) - The name of the plugin.
- **version** (path, string) - The version of the plugin.
- **os** (path, string) - The target operating system for the plugin executable. Must be one of `darwin`, `linux` or `windows`.
- **arch** (path, string) - The architecture of the plugin executable. Must be one of `amd64` or `arm`.

### Example Request

```bash
curl -X GET https://api.registry.celerityframework.io/v1/plugins/celerity/aws/1.0.0/package/linux/amd64
```

### Response

Content-Type: `application/json`

Example:

```json
{
  "supportedProtocols": ["1.0", "2.2"],
  "os": "linux",
  "arch": "amd64",
  "filename": "provider-celerity-aws_1.0.0_linux_amd64.zip",
  "downloadUrl": "https://artifacts.registry.celerityframework.io/plugins/celerity/aws/1.0.0/provider-celerity-aws_1.0.0_linux_amd64.zip",
  "shasumsUrl": "https://artifacts.registry.celerityframework.io/plugins/celerity/aws/1.0.0/provider-celerity-aws_1.0.0_sha256sums",
  "shasumsSignatureUrl": "https://artifacts.registry.celerityframework.io/plugins/celerity/aws/1.0.0/provider-celerity-aws_1.0.0_sha256sums.sig",
  "shasum": "d41d8cd98f00b204e9800998ecf8427e4039f2d610f1e9c3d4f3f4f4f4f4f4f4",
  "signingKeys": {
    "gpg": [
      {
        "keyId": "391E4A5DFC4D1D8D",
        "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBF7z1ZsBEADJ...\n-----END PGP PUBLIC KEY BLOCK-----",
        "trustSignature": "",
        "source": "Celerity",
        "sourceUrl": "https://registry.celerityframework.io/security"
      }
    ]
  }
}
```

### Response Properties

A successful response will contain a JSON object with the following properties:

- **supportedProtocols** (required, array of strings) - The supported plugin protocols for this version of the plugin. This should be in the same format as in [List Versions](#list-versions).
- **os** (required, string) - The target operating system for the plugin executable, this should match the `os` parameter in the request.
- **arch** (required, string) - The architecture of the plugin executable, this should match the `arch` parameter in the request.
- **filename** (required, string) - The filename of the plugin archive. This is required as it is used in the "shasums" document. The Celerity CLI will use it to determine which of the provided checksums to use for this particular package.
- **downloadUrl** (required, string) - The URL to download the plugin archive. This can be an absolute or relative URL. When relative, the base URL that returned the response will be used to resolve the full download URL.
- **shasumsUrl** (required, string) - The URL to download the "shasums" document for the plugin archive. This contains a set of SHA256 checksums for this package and potentially other packages for the same plugin version across multiple platforms. This can be an absolute or relative URL. When relative, the base URL that returned the response will be used to resolve the full download URL. <br />\
This document must be in the format generated by the `sha256` command that is available on most Unix-like systems. One entry must be provided for the same file name provided in the `filename` property where the file name is case-sensitive.
- **shasumsSignatureUrl** (optional, string) - The URL to download the binary, detached GPG signature for the document at `shasumsUrl`, signed by one the keys specified in the `signingKeys` property.
- **shasum** (required, string) - The SHA256 checksum of the plugin archive.
- **signingKeys** (required, object) - An object containing the public keys, where at least one was used to produce the signature at `shasumsSignatureUrl`. The object should contain the following properties:
  - **gpg** (required, array of objects) - An array of objects that contain the following properties:
    - **keyId** (required, string) - The key ID of the GPG key, this must be an uppercase hexadecimal string.
    - **publicKey** (required, string) - The public key in ASCII-armored format.
    - **trustSignature** (optional, string) - The trust signature of the key.
    - **source** (optional, string) - The source of the key.
    - **sourceUrl** (optional, string) - The URL to the source of the key.


Return a `404 Not Found` response to indicate that the requested plugin does not exist in the registry. The Celerity CLI will only try to download versions that are listed in the response from the [List Versions](#list-versions) operation.
