---
sidebar_position: 5
---

# App Deploy Configuration

This section provides documentation for a simplified configuration format tailored for deploying Celerity applications.

## Overview

App deploy configuration is used for blueprint variable overrides and configuration for the target environment to deploy the application to. This configuration will be converted to the standard [deploy configuration](./deploy-configuration) format when an application is built and deployed.

App deploy configuration is used with the following commands:
- `app build` - Used to build the application, target environment configuration helps determine how the application should be built.
- `stage-changes` - Used to ensure that all the final blueprint variables are set and that the Celerity app transformer and target environment provider is configured correctly.
- `deploy` - Used to ensure that all the final blueprint variables are set and that the the Celerity app transformer and target environment provider are configured correctly when deploying resources for a new blueprint instance.
- `destroy` - Used to ensure that Celerity app transformer and target environment provider are configured correctly when destroying resources in a blueprint instance. This command does not make use of an input blueprint file so blueprint variable overrides are not used.
- `validate` - Used to ensure that Celerity app transformer and target environment provider are configured correctly when validating a blueprint document. This command usually does not make use of blueprint variable overrides as validation is carried out on the source blueprint document and not a deployed instance. The target environment provider may provide custom validation logic that in advanced cases may require calls to APIs that require credentials and configuration.

:::warning
This is not to be confused with the configuration for the CLI, this is purely for providing blueprint variable overrides and configuration for an application deployment target.
See [here](./configuration) for more information on configuring the CLI.
:::

## Structure

The app deploy configuration is a JSONC file that will usually be located in the root directory of a project in a file named `app.deploy.jsonc` but this can be overridden with the `--app-deploy-config-file` option in the CLI.

This file is expected to contain the following structure:

```javascript
{
  "deployTarget": {
    "name": "<deploy-target-name>",
    "appEnv": "<app-environment>",
    "config": {
      "<key>": "<value> (string | number | boolean)"
    }
  }
  "blueprintVariables": {
    "<key>": "<value> (string | number | boolean)"
  }
}
```

`<deploy-target-name>` is the unique name of the target environment that the application will be deployed to. This can be one of the following:

- `aws`
- `aws-serverless`
- `gcloud`
- `gcloud-serverless`
- `azure`
- `azure-serverless`

_See the "Target Environments" docs for each Celerity resource type for the details of how each resource type is deployed to a specific environment._

`<app-environment>` is the kind of environment that the application will be deployed to. This can be one of the following:

- `production`
- `development`

_App environments help in determining how the application should be built and deployed. For example, Celerity will use the app environment to determine appropriate defaults for the instance types used to back a containerised deployment._

The `deployTarget.config` object contains configuration for the target environment provider that can include credentials, provider-specific configuration and configuration that is specific to a Celerity resource type. Each Celerity resource type defines its own set of app configuration options, explore Celerity application resource types [here](/docs/applications/intro).

### Example

```javascript
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      // It would be better to assume an AWS IAM role for the host machine
      // running the deployment.
      "accessKeyId": "my-access-key-id",
      "secretAccessKey": "secret-access-key",
      "aws.containerService": "eks",
      "aws.compute": "fargate",
    },
  },
  "blueprintVariables": {
    "region": "us-east-1"
  }
}
```

## Version Control

The app deploy configuration file is not intended to be version controlled when its contents is primarily used for credentials and blueprint variable overrides that can contain sensitive information. However, for heavily customised deployments where a lot of the deployment target configuration is used (e.g. AWS), it can be useful to commit sections of this file to version control.

When you want to commit sections of configuration in the app deploy configuration file to version control, you can either commit the entire file and use environment variable substitution for sensitive information like so:

```javascript title="app.deploy.jsonc"
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      // It would be better to assume an AWS IAM role for the host machine
      // running the deployment.
      "aws.accessKeyId": "${AWS_ACCESS_KEY_ID}",
      "aws.secretAccessKey": "${AWS_SECRET_ACCESS_KEY}",
      "aws.containerService": "ecs",
      "aws.compute": "fargate"
    },
  },
  "blueprintVariables": {
    "region": "${REGION}"
  }
}
```

Alternatively, you can create a template file that contains the configuration you want to commit to version control and have placeholders for sensitive information that should be populated in the final file used with the Celerity CLI.
You can then copy this template file to the final file used with the Celerity CLI and populate the placeholders with environment variables or secrets loaded into a CI/CD or local environment from which you are deploying the application.

```javascript title="app.deploy.template.jsonc"
{
  "deployTarget": {
    "name": "aws",
    "appEnv": "production",
    "config": {
      "aws.accessKeyId": "[placeholder__aws_access_key_id]",
      "aws.secretAccessKey": "[placeholder__aws_secret_access_key]",
      "aws.containerService": "ecs",
      "aws.compute": "fargate"
    },
  },
  "blueprintVariables": {
    "region": "[placeholder__region]"
  }
}
```
