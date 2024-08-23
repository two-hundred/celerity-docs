---
sidebar_position: 2
---

# Reference

This section provides the reference for the available commands and flags for the Celerity CLI.

## Global Options

:::note
CLI options take precedence over [configuration](./configuration) from environment variables and values from a configuration file.
:::

## `init`

This command initialises a new Celerity project.
It will take you through a series of prompts to create a new project.
You can provide command line options to skip parts of the interactive process of setting up a new project.

### `--language`

**Environment Variable**: `CELERITY_CLI_INIT_LANGUAGE`

**Configuration Key**: `initLanguage`

**Allowed Values**: `nodejs` | `python` | `java` | `dotnet` | `go` | `rust`

The language or framework to use for a new Celerity project.

## `validate`

This command validates a Celerity project or blueprint file.
It will validate source code, the project blueprint and other configuration files.
It can also be used to validate a single blueprint file.

### `--blueprint-file`

**Environment Variable**: `CELERITY_CLI_VALIDATE_BLUEPRINT_FILE`

**Configuration Key**: `validateBlueprintFile`

**Default Value**: `app.blueprint.yaml`