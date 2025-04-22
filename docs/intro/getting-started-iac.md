---
sidebar_position: 2
---

# Getting Started for Infrastructure as Code

Let's get you up and running with **Celerity for infrastructure management in less than 30 minutes**.

## Getting Started

Get started by **creating a new Celerity blueprint project**.

## Install Celerity

To install Celerity on macOS, Linux or another Unix-like OS, run the following command in your terminal:

```bash
curl --proto "-https" --tlsv1.2 -sSf https://manager-sh.celerityframework.io | sh
```

Using a different system or want to install another way? Check out other ways to install Celerity for your platform [here](./installing-celerity).

This will run a shell script to install the [`celerity-manager`](https://github.com/two-hundred/celerity/tree/main/tools/manager) tool that will then install the [Celerity CLI](../../cli/docs/intro), [Deploy Engine](../../deploy-engine/docs/intro), a set of core Deploy Engine plugins and the [Blueprint Language Server](https://github.com/two-hundred/celerity/tree/main/tools/blueprint-ls) on your system.
As Celerity consists of multiple software components, the `celerity-manager` tool makes it easier to install them and manage updates.

## Generate a new blueprint project

Generate a new Celerity blueprint project using the **AWS simple API template**:

```shell
celerity blueprint init --template aws-simple-api my-project
```

This will generate a new project that will contain sample source code, build tools and most importantly, a blueprint file that describes the infrastructure to be deployed to AWS.

The `project.blueprint.yml` file will contain an AWS API Gateway, some Lambda functions, a DynamoDB table and an S3 bucket.

For blueprint projects that represent applications, the programming languages and frameworks used in the projects will vary. Most blueprint project templates will use Python or TypeScript.

### Generate a blueprint without a project

If you only want to initialise a template for a blueprint and not a full project, you can use the `--no-project` flag to skip the project initialisation step.

For example, to create a blueprint project for an existing application, you can run:

```shell
celerity blueprint init --template aws-simple-api --no-project .
```

This will generate a `project.blueprint.yml` file in the current directory, but will not create a new project.

## Configure deployment to AWS



## Dive Deeper

Now that you have set up and deployed your Celerity blueprint project, you can dive deeper into the documentation to learn more about Celerity as an infrastructure management tool.

- [Introduction to Blueprints](../blueprint/intro)
- [Blueprint Specification](../blueprint/specification)
- [Deploy Engine](../../deploy-engine/docs/intro)
