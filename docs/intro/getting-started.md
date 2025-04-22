---
sidebar_position: 1
---

# Getting Started

Let's get you up and running with **Celerity in less than 5 minutes**.

## Getting Started

Get started by **creating a new Celerity application**.

## Install Celerity

To install Celerity on macOS, Linux or another Unix-like OS, run the following command in your terminal:

```bash
curl --proto "-https" --tlsv1.2 -sSf https://manager-sh.celerityframework.io | sh
```

Using a different system or want to install another way? Check out other ways to install Celerity for your platform [here](./installing-celerity).

This will run a shell script to install the [`celerity-manager`](https://github.com/two-hundred/celerity/tree/main/tools/manager) tool that will then install the [Celerity CLI](../../cli/docs/intro), [Deploy Engine](../../deploy-engine/docs/intro), a set of core Deploy Engine plugins and the [Blueprint Language Server](https://github.com/two-hundred/celerity/tree/main/tools/blueprint-ls) on your system.
As Celerity consists of multiple software components, the `celerity-manager` tool makes it easier to install them and manage updates.

## Generate a new project

Generate a new Celerity application using the **simple API template**:

```shell
celerity app init --template simple-api my-app
```

You will be prompted to select a programming language for your application, before the project can be generated. Celerity provides template projects for languages with official SDK support, including:

- Python
- Node.js (TypeScript)
- Java
- C# (dotnet)
- Go
- Rust

See the [runtime](../runtime/intro#supported-languages) documentation for more information and to see how you can implement Celerity applications in other languages.

## Start your API locally

Run the development server:

```shell
cd my-app

celerity app start
```

The API will now be available at `http://localhost:3005`.
You can test the simple API users endpoint with a `GET` request to `http://localhost:3005/users`.

Edit some source code for the users endpoint: the API will **reload automatically** and you can check by re-running `GET /users` request.

## Dive Deeper

Now that you have a Celerity application up and running, you can dive deeper into the documentation to learn more about the framework and its features.

- [Celerity Overview](../overview)
- [Celerity Applications](../applications/intro)
- [Celerity Runtime](../runtime/intro)
- [Celerity CLI](../../cli/docs/intro)
- [Deploy Engine](../../deploy-engine/docs/intro)


## Celerity for Infrastructure as Code (IaC)

You can also use Celerity as an infrastructure management tool using blueprints for IaC and the Deploy Engine for deployment.

[Follow the Getting Started guide for Celerity for IaC](./getting-started-iac) to learn how to create and deploy your first blueprint.
