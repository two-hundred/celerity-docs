---
sidebar_position: 2
---
# Plugin System

The Deploy Engine supports plugins that can be pulled in at runtime for providers and transformers.
These plugins are [gRPC](https://grpc.io/) servers that implement one of the `Provider` or `Transformer` gRPC service interfaces.

## Plugin Discovery

Out of the box, the Deploy Engine discovers plugins by looking for executables under the `$HOME/.celerity/deploy-engine/plugins/bin` directory. The `bin` directory is expected to contain a directory for each type of plugin. Provider plugins should be in the `providers` directory, and transformer plugins should be in the `transformers` directory.

Each plugin is expected to be in a subdirectory following the ID format of `{hostname/}?{namespace}/{plugin}`. 
For example, a plugin for the `celerity/aws` provider would be located at `$HOME/.celerity/deploy-engine/plugins/bin/providers/celerity/aws`. Another example, would be that the plugin with the ID `registry.customhost.com/celerity/azure` would be expected to be located in `$HOME/.celerity/deploy-engine/plugins/bin/providers/registry.customhost.com/celerity/azure`. 
The `{hostname/}` part is only required if the plugin is hosted on a custom registry, all plugins that have an ID in the form `{namespace}/{plugin}` are assumed to be hosted in the Celerity Framework registry.

In each plugin directory, there should be a folder for each version of the plugin. The version folder should be named with the version number of the plugin. For example, the plugin version `1.0.0` would be located at `$HOME/.celerity/deploy-engine/plugins/bin/providers/celerity/aws/1.0.0`.

Each plugin executable is expected to be a file named `plugin` with no file extension.
An example of a full path to the plugin executable file would be `$HOME/.celerity/deploy-engine/plugins/bin/providers/celerity/aws/1.0.0/plugin`.

For a standard install of the Deploy Engine, the `$HOME/.celerity/deploy-engine/plugins/bin` directory is created for you and populated with the core plugins that enable the Celerity resource types.

You can specify a custom directory for the Deploy Engine to look for plugins by appending a new directory to the `CELERITY_DEPLOY_ENGINE_PLUGIN_PATH` environment variable. This environment variable is a colon-separated list of directories that the Deploy Engine will search for plugins in. This environment variable will be set as a part of the standard Celerity installation with a default value of `$HOME/.celerity/deploy-engine/plugins/bin`. If, for some reason, this environment variable is not set, the Deploy Engine will default to the `$HOME/.celerity/deploy-engine/plugins/bin` directory.

An example for a custom plugin path would be to set the `$HOME/.celerity/deploy-engine/plugins/bin:/path/to/custom/plugins`.

The priority of plugin discovery is based on the order of the directories in the `CELERITY_DEPLOY_ENGINE_PLUGIN_PATH` environment variable. The Deploy Engine will search for plugins in the directories in the order they are listed in the environment variable from left to right.

## Plugin IDs

There are two formats for plugin IDs:
- `{hostname/}?{namespace}/{plugin}` - This format is used for plugins that are hosted on a custom registry.
- `{namespace}/{plugin}` - This format is used for plugins that are hosted in the Celerity Framework registry.

An example for the former format would be `registry.customhost.com/celerity/azure`.

An example for the latter format would be `celerity/aws`.

Plugin IDs are globally unique and are used to identify a plugin regardless of type, a transformer plugin and a provider plugin must **_not_** have the same ID.

## Plugin Lifecycle

The Deploy Engine will execute each discovered plugin and waits for each plugin to register itself with the plugin service by a pre-determined deadline before continuing, it will store the process ID and plugin ID (Based on the path) in memory to manage the lifecycle of the plugin.

The plugin will register itself with the "Plugin Service" which is a gRPC service that is a part of the Deploy Engine that listens for plugin registration and deregistration messages.

On successful registration, the "Plugin Service" will instantiate a new plugin client that will allow the Deploy Engine to communicate with the plugin.

On a graceful shutdown of the plugin, the plugin will deregister itself with the "Plugin Service" and the Deploy Engine will remove the plugin client from it's in-memory store.

When a plugin hasn't registered itself with the host after a pre-determined deadline, the Deploy Engine will kill the plugin process. It will then attempt to restart the plugin process up to a maximum of 4 times (5 launch attempts as per the default configuration). The attempt limit is configurable via the `CELERITY_DEPLOY_ENGINE_PLUGIN_LAUNCH_ATTEMPT_LIMIT` environment variable.
If the plugin still hasn't registered itself after the maximum number of attempts, the Deploy Engine will log an error and exit with a non-zero exit code.
The Deploy Engine does not carry on as all installed plugins are required to be registered before the Deploy Engine can continue to ensure it can not get into an unrecoverable state.

## Plugin Method Error Handling

Error codes are expected to be returned by the plugin if an error occurs during the execution of a method. The Deploy Engine will handle these errors and log them accordingly.

There are three error codes that are expected to be returned by the plugin:

`UNEXPECTED (0)` - This error code is used when the plugin encounters an error that should not be retried.

`TRANSIENT (1)` - This error code is used when the plugin encounters an error that can be retried. _This error type will not be handled in all situations, see [Transient Errors and Retries](#transient-errors-and-retries) for more information._

`BAD_INPUT (2)` - This error code is used when the plugin encounters an error due to bad input.

The Deploy Engine will retry transient errors based on a configured retry and backoff strategy.
The actual retry behaviour is managed by the [Blueprint Framework](https://celerityframework.com/blueprint-framework/docs/intro), the Deploy Engine maps these error codes to errors that are a part of the framework's error handling system used in the data retrieval, change staging and deployment processes.

When the `details` field of an error response is set and is an object containing a `failureReasons` field, these reasons will be extracted and persisted as the reason for failure by the Deploy Engine. Otherwise, the error message will be used as the reason for failure.

### Transient Errors and Retries

Transient errors are only retried for plugin methods that are expected to make network calls to external services. Transient errors are retried for the following methods:
- `provider.Resource.Deploy`
- `provider.Resource.HasStabilised`
- `provider.Resource.GetExternalState`
- `provider.Resource.Destroy`
- `provider.Link.UpdateResourceA`
- `provider.Link.UpdateResourceB`
- `provider.Link.UpdateIntermediaryResources`
- `provider.DataSource.Fetch`

## Plugin Service

The Deploy Engine provides a gRPC service for plugins to register, deregister themselves and act as a gateway for inter-plugin communication. The following gRPC service definitions are supported for a provider in the selected version of the Deploy Engine:

- [Service v1 gRPC Reference](https://github.com/two-hundred/celerity/tree/main/libs/deploy-engine/plugin/providerservice/service.proto)

## Local Network Only

Plugins must be accessible from the Deploy Engine via the local network through the loopback interface or a unix socket. Remote plugins are not supported for security and performance reasons. In regards to security, plugins do not support TLS to keep the plugin system simple and easy to use. In regards to performance, local plugins are expected to be fast and reliable, remote plugins introduce latency and potential network issues.

The Deploy Engine will always attempt to connect to a plugin via the `127.0.0.1` loopback address or a unix socket, plugins can only configure the port to listen on when TCP is used.
