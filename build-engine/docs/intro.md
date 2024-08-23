---
sidebar_position: 1
---

# Introduction

The Build Engine provides the core functionality for every stage of development for Celerity applications.
This powers the CLI and exposes a HTTP API that allows for integration into other tools.

Although the Build Engine is focused on Celerity applications, It can also be used as a more general purpose solution for deploying and managing infrastructure as code across multiple cloud providers.

The Build Engine is responsible for:
- Carrying out extensive validation of a Celerity project or blueprint.
- Building and packaging up Celerity applications to be deployed to supported platforms.
- Deploying Celerity applications to supported platforms.
- Deploying blueprints that go beyond Celerity applications, with a primary example being infrastructure as code.

For the validation and deployment stages, at the centre of the Build Engine lies the [Blueprint Framework](../blueprint-framework/docs/intro) which is used to validate and deploy blueprints.
A blueprint is used to define a Celerity application in a similar way an AWS SAM template is used to define a serverless application in AWS.

The Build Engine contains a registry of resource types and other Blueprint Framework plugins that enable Celerity applications to be deployed to various platforms.

## Installation

The Build Engine is included with the Celerity CLI, follow the instructions [here](../../cli/docs/intro#installation) to install the CLI.

### Binaries

TODO: Add instructions for downloading and running the binaries for the Build Engine API.

### Docker

The Build Engine is also available as a Docker image, you can pull the latest version with:

```bash
docker pull ghcr.io/two-hundred/celerity-build-engine:latest
```

TODO: Add instructions for running the Docker image.
TODO: Add instructions for a docker compose setup.

## Getting Started

Get started by **creating a new site**.

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.

## Generate a new site

Generate a new Docusaurus site using the **classic template**:

```shell
npm init docusaurus@latest my-website classic
```

## Start your site

Run the development server:

```shell
cd my-website

npx docusaurus start
```

Your site starts at `http://localhost:3000`.

Open `docs/intro.md` and edit some lines: the site **reloads automatically** and displays your changes.

## Architecture

The Build Engine is made up of a core Go library and a HTTP API that wraps around it. For the most part these are treated as one and the same, they are versioned together and the interfaces are designed to be as similar as possible.

For example, `v1.0.5` of the Build Engine Library will have a corresponding `v1.0.5` of the Build Engine API executable.

The Build Engine API executable supports multiple versions of the HTTP API, this allows for backwards compatibility with older clients. The HTTP API version is specified in the URL path, for example `/v1/build`. Older versions are slowly deprecated and removed as the library and executable are updated.

:::note
The HTTP API version only changes when there are major breaking changes to the API.
For example, when the library and executable are updated from `v1.1.0` to `v1.2.0`, the HTTP API version will remain `v1`.
When the library and executable are updated from `v1.1.0` to `v2.0.0`, the HTTP API version will be updated to `v2`.
:::

