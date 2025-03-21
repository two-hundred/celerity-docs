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

## `plugins`

This is the command category for managing deploy engine plugins installed on the machine
that the CLI is running on.

:::note
You can only manage plugins from the CLI for the machine that you call the CLI commands on.
These plugins will only be available when running commands such as `deploy` or `destroy`
against an instance of the deploy engine running on the same machine.
This is the default behaviour if a custom host is not specified for the deploy engine.
:::

### `list`

Lists all the plugins that are installed on the machine that the CLI is running on.

#### `--type`

**Environment Variable**: `CELERITY_CLI_PLUGINS_LIST_TYPE`

**Configuration Key**: `type`

**Allowed Values**: `provider` | `transformer` | `all`

**Default Value**: `all`

The type of plugins to list.

### `install`

Installs one or more plugins on the machine that the CLI is running on.
This command takes one or more plugin IDs as arguments.

An example of installing a single plugin:
```bash
celerity plugins install celerity/aws
```

An example of installing multiple plugins:
```bash
celerity plugins install celerity/aws celerity/azure registry.customhost.com/celerity/gcp
```

Plugins that exist in the celerity framework registry do not need the full URL with the host name,
only plugins stored in a custom registry need the full URL.
For example, the plugin ID `celerity/aws` will be resolved to `registry.celerityframework.io/celerity/aws`.

The Celerity CLI only supports sourcing plugins from a custom registry if it has been added to the
allowed registries, you can create a PR or contact the Celerity team to get a custom registry
verified and added to the list of allowed registries.

As plugin IDs are globally unique, the CLI does not differentiate between provider and transformer plugins
for the sake of installation.

