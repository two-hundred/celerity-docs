---
sidebar_position: 1
---

# Introduction

The Deploy Engine provides the core functionality for validating and deploying the infrastructure required to run a Celerity application.
This powers the CLI and exposes a HTTP API that allows for integration into other tools.

Although the Deploy Engine is focused on Celerity applications, It can also be used as a more general purpose solution for deploying and managing infrastructure as code across multiple cloud providers.

The Deploy Engine is responsible for:
- Carrying out extensive validation of a Celerity blueprint.
- Deploying Celerity applications to supported platforms.
- Deploying blueprints that go beyond Celerity applications, with a primary example being infrastructure as code.

For the validation and deployment stages, at the centre of the Deploy Engine lies the [Blueprint Framework](../../blueprint-framework/docs/intro) which is used to validate and deploy blueprints.
A blueprint is used to define a Celerity application in a similar way an AWS SAM template is used to define a serverless application in AWS.

The Deploy Engine contains a collection of resource type providers and other Blueprint Framework plugins that enable Celerity applications to be deployed to various platforms.

## Installation

The Deploy Engine is included with the Celerity CLI and other components in a standard install, follow the instructions [here](../../docs/intro/installing-celerity) to install Celerity.

### Binaries

TODO: Add instructions for downloading and running the binaries for the Deploy Engine API.

### Docker

The Deploy Engine is also available as a Docker image, you can pull the latest version with:

```bash
docker pull ghcr.io/two-hundred/celerity-deploy-engine:latest
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

The Deploy Engine provides a HTTP API that supports SSE (Server-Sent Events) for streaming events for change staging, validation and deployment. 

The Deploy Engine API facilitates multiple versions of the HTTP API, this allows for backwards compatibility with older clients. The HTTP API version is specified in the URL path, for example `/v1/deploy`. Older versions are slowly deprecated and removed as the deploy engine is updated.

In terms of the composition of the Deploy Engine, it brings together the [Plugin Framework](../../plugin-framework/docs/intro) and [Blueprint Framework](../../blueprint-framework/docs/intro) to provide a powerful and extensible solution for deploying and managing Celerity applications and infrastructure as code.

The Deploy Engine itself is combined with the CLI, foundational resource provider plugins and the Celerity Application transformer plugin to provide a complete solution for managing Celerity applications.
