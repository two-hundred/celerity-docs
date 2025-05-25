---
sidebar_position: 2
---

# Reference

This section provides the reference for the available commands and flags for the Celerity CLI.

Options that are marked with a `boolean` type are command line flags that do not take a value, however their config file and environment variable equivalents do take a value that should be set to one of `true`, `false`, `1` or `0`.

## Global Options

:::note
CLI options take precedence over [configuration](./configuration) from environment variables and values from a configuration file.
:::

### `--config`

The path to the configuration file to source CLI configuration from.
Relative paths are expected to be relative to the current working directory.

**Type**: `string`

**Default Value**: `celerity.config.toml`

### `--deploy-config-file`

**Environment Variable**: `CELERITY_CLI_DEPLOY_CONFIG_FILE`

**Configuration Key**: `deployConfigFile`

**Type**: `string`

**Default Value**: `celerity.deploy.jsonc`

The path to the deploy configuration file that contains blueprint variable overrides and configuration for providers and transformers.
This file is expected to be in the JSON with Commas and Comments format described in the [Deploy Configuration](./deploy-configuration) doc.

If the file is not found, the CLI will send empty configuration to the Deploy Engine, which will in most cases result in an error in the response from the Deploy Engine.

This file is used by the `stage-changes`, `deploy`, `destroy` and `validate` commands.

### `--app-deploy-config-file`

**Environment Variable**: `CELERITY_CLI_APP_DEPLOY_CONFIG_FILE`

**Configuration Key**: `appDeployConfigFile`

**Type**: `string`

**Default Value**: `app.deploy.jsonc`

The path to the app deploy configuration file that contains blueprint variable overrides and configuration for the target environment for a Celerity application.
This file is expected to be in the JSON with Commas and Comments format described in the [App Deploy Configuration](./app-deploy-configuration) doc.

This file is used by the `app build`, `stage-changes`, `deploy`, `destroy` and `validate` commands.

### `--connect-protocol`

**Environment Variable**: `CELERITY_CLI_CONNECT_PROTOCOL`

**Configuration Key**: `connectProtocol`

**Type**: `string`

**Default Value**: `unix`

**Allowed Values**: `unix` | `tcp`

The protocol to connect to the deploy engine with,
this can be either `unix` or `tcp`.
A unix socket can only be used on linux, macos and other unix-like operating systems.
To use a `unix` socket on windows, you will need to use WSL 2 or above.

### `--engine-endpoint`

**Environment Variable**: `CELERITY_CLI_ENGINE_ENDPOINT`

**Configuration Key**: `engineEndpoint`

**Type**: `string`

**Default Value**: `http://localhost:8325`

The endpoint of the deploy engine api, this is used if `--connect-protocol` is set to `tcp`.

## `help`

For information on all the available commands and global options, run the following:
```bash
celerity help
```

To get usage information for a specific command, run the following:
```bash
celerity [command] --help
```

## `validate`

This command validates a Celerity project or blueprint file.
It will validate source code, the project blueprint and other configuration files.
It can also be used to validate a single blueprint file.

### `--blueprint-file`

**Environment Variable**: `CELERITY_CLI_VALIDATE_BLUEPRINT_FILE`

**Configuration Key**: `validateBlueprintFile`

**Default Value**: `app.blueprint.yaml`

### `--check-blueprint-vars`

**Environment Variable**: `CELERITY_CLI_VALIDATE_CHECK_BLUEPRINT_VARS`

**Configuration Key**: `validateCheckBlueprintVars`

**Type**: `boolean`

**Default Value**: `false`

This flag enables validation of the blueprint variable values that are set in the deploy configuration file.
By default, the CLI will not validate the blueprint variable overrides set in the deploy configuration file when validating a blueprint file.

### `--check-plugin-config`

**Environment Variable**: `CELERITY_CLI_VALIDATE_CHECK_PLUGIN_CONFIG`

**Configuration Key**: `validateCheckPluginConfig`

**Type**: `boolean`

**Default Value**: `false`

By default, the validate command only runs validation on a provided blueprint file.
You can use the `--check-blueprint-vars` flag to validate the blueprint variable values set in the deploy configuration file.
By default, configuration specific to providers and transformers is not validated as a part of this command.
When this flag is set, the provider and transformer configuration sourced from deploy config files will be validated against the plugin configuration schemas.

:::note
The "app deploy config" file provides a convenient way to set up the deploy configuration specifically for a Celerity application.
All configuration in the `deployTarget` section of the app deploy config file will be used to generate the final configuration organised by the underlying provider and transformer plugins.

This means that when `--check-deploy-config` is set, the CLI will validate the configuration in the `deployTarget` section of the app deploy config file.
:::

## `stage-changes`

## `deploy`

## `destroy`

## `login`

This command logs into a plugin registry to allow the installation of plugins from specific protected registries by host.

An example of logging into a plugin registry:
```bash
celerity login registry.customhost.com
```

The auth configuration for plugin registries is expected to be present in the `$HOME/.celerity/auth.json` file.
See the [Plugin Registry Authentication Protocol](/plugin-framework/docs/registry-protocols-formats/auth-protocol) for more information on how to authenticate with a plugin registry.

## `app`

This is the command category for managing Celerity applications.

### `init`

This command initialises a new Celerity application project.
It will take you through a series of prompts to create a new application project.
You can provide command line options to skip parts of the interactive process of setting up a new application project.

#### `--language`

**Environment Variable**: `CELERITY_CLI_INIT_LANGUAGE`

**Configuration Key**: `initLanguage`

**Allowed Values**: `nodejs` | `python` | `java` | `dotnet` | `go` | `rust`

The language or framework to use for a new Celerity project.

### `start`

### `build`

### `test`

Run tests for a Celerity application.
This will set up an isolated environment that sets up and tears down test fixtures used with [Celerity::1](/celerity-one/docs/intro).
The underlying test runner will depend on the language used for the application.

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

### `uninstall`

## `version`
