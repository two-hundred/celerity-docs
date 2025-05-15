---
sidebar_position: 4
---

# Deploy Configuration

This section provides documentation for configuration that needs to be provided when carrying out a subset of commands in the CLI.

## Overview

Deploy configuration is used for blueprint variable overrides, configuration for providers (e.g. credentials for AWS), configuration for transformers and more general configuration that may be used by Deploy Engine plugins.

Deploy configuration is used with the following commands:
- `stage-changes` - Used to ensure that all the final blueprint variables are set and that providers and transformers are configured correctly when deploying resources for a new blueprint instance.
- `deploy` - Used to ensure that all the final blueprint variables are set and that providers and transformers are configured correctly when deploying resources for a new blueprint instance. The change staging process makes use of the final blueprint variables in producing a change set to be deployed, however, not all values can be resolved during change staging, especially where there are dependencies between resources. To account for this, the blueprint document is required along with blueprint variable overrides to resolve the remaining values during the deployment process.
- `destroy` - Used to ensure that providers and transformers are configured correctly when destroying resources in a blueprint instance. This command does not make use of an input blueprint file so blueprint variable overrides are not used.
- `validate` - Used to ensure that providers and transformers are configured correctly when validating a blueprint document. This command usually does not make use of blueprint variable overrides as validation is carried out on the source blueprint document and not a deployed instance. Plugins may provide custom validation logic that in advanced cases may require calls to APIs that require credentials and configuration.

:::warning
This is not to be confused with the configuration for the CLI, this is purely for providing blueprint variable overrides and configuration for Deploy Engine plugins.
See [here](./configuration) for more information on configuring the CLI.
:::

## Structure

The deploy configuration is a JSONC file that will usually be located in the root directory of a project in a file named `celerity.deploy.jsonc` but this can be overridden with the `--deploy-config-file` option in the CLI.

This file is expected to contain the following structure:

```javascript
{
  "providers": {
    "<provider-name>": {
      "<key>": "<value> (string | number | boolean)"
    }
  },
  "transformers": {
    "<transformer-name>": {
      "<key>": "<value> (string | number | boolean)"
    }
  },
  "contextVariables": {
    "<key>": "<value> (string | number | boolean)"
  },
  "blueprintVariables": {
    "<key>": "<value> (string | number | boolean)"
  }
}
```

`<provider-name>` is the name of the provider that is being configured. This name is the last part of the plugin ID for the provider. For example, for the plugin ID `registry.customhost.com/celerity/azure`, the provider name would be `azure`.

`<transformer-name>` is the name of the transformer that is being configured. This name is the last part of the plugin ID for the transformer. For example, for the plugin ID `two-hundred/awsTransform`, the transformer name would be `awsTransform`.

For each provider and transformer, the keys and values are specific to the provider or transformer being configured. The valid keys and values can be found in the plugin documentation. The Deploy Engine will validate the configuration against the plugin schema when any of the `stage-changes`, `deploy`, `destroy` or `validate` commands are run unless the `--skip-config-validation` option is specified.

### Example

```javascript
{
  "providers": {
    "aws": {
      // It would be best to assume a role on the host machine
      // running the deployment instead of using access keys.
      "accessKeyId": "my-access-key-id",
      "secretAccessKey": "secret-access-key"
    }
  },
  "transformers": {
    "celerityTransform": {
      "deployTarget": "aws-serverless"
    }
  },
  "contextVariables": {
    "myConfigKey": "my-config-value"
  },
  "blueprintVariables": {
    "region": "us-east-1"
  }
}
```
