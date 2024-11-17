---
sidebar_position: 1
---
# Plugin System

The Deploy Engine supports plugins that can be pulled in at runtime for providers and transformers.
These plugins are [gRPC](https://grpc.io/) servers that implement one of the `Provider` or `Transformer` gRPC service interfaces.

Plugins can be implemented in any language that supports gRPC, however, the Deploy Engine only provides an SDK in Go. The SDK makes for a simplified plugin building experience by abstracting away the scaffolding involved in setting up a gRPC server along with utilities for validating resources and data sources.

## Plugin Discovery

Out of the box, the Deploy Engine discovers plugins by looking for executables under the `~/.celerity/deploy-engine/plugins/bin` directory. Each plugin is expected to be in a subdirectory following the ID format of `{hostname/}?{namespace}/{plugin}`. For example, a plugin for the `celerity/aws` provider would be located at `~/.celerity/deploy-engine/plugins/bin/celerity/aws`. Another example, would be that the plugin with the ID `registry.celerityframework.com/celerity/azure` would be expected to be located in `~/.celerity/deploy-engine/plugins/bin/registry.celerityframework.com/celerity/azure`. 

Each plugin executable is expected to be a file named `plugin` with no file extension.

When you install the Deploy Engine as a part of the standard install with the CLI, the `~/.celerity/deploy-engine/plugins/bin` directory is created for you and populated with the core plugins that enable the Celerity resource types.

You can specify a custom directory for the Deploy Engine to look for plugins by setting the `CELERITY_BUILD_ENGINE_PLUGIN_DIR` environment variable, this will not override the default directory but will be appended to the default directory, this env var can be set to a comma separated list of directories in case you have multiple directories you want to search for plugins in.

## Plugin Lifecycle

The Deploy Engine will execute each discovered plugin and waits for each plugin to register itself with the plugin service by a deadline before continuing, it will store the process ID and plugin ID (Based on the path) in memory to manage the lifecycle of the plugin.

The plugin will register itself with the "Plugin Service" which is a gRPC service that the Deploy Engine providers for plugin registration and deregistration.

On successful registration, the "Plugin Service" will instantiate a new plugin client that will allow the Deploy Engine to communicate with the plugin.

On a graceful shutdown of the plugin, the plugin will deregister itself with the "Plugin Service" and the Deploy Engine will remove the plugin client from it's in-memory store.

When an unrecoverable error occurs in the plugin during registration or the plugin becomes unreachable, the Deploy Engine will kill the plugin process. It will then attempt to restart the plugin process up to a 5 times. The retry limit is configurable via the `CELERITY_DEPLOY_ENGINE_PLUGIN_LAUNCH_RETRY_LIMIT` environment variable.

## Plugin Method Error Handling

Error codes are expected to be returned by the plugin if an error occurs during the execution of a method. The Deploy Engine will handle these errors and log them accordingly.

There are three error codes that are expected to be returned by the plugin:

`UNEXPECTED (0)` - This error code is used when the plugin encounters an error that should not be retried.

`TRANSIENT (1)` - This error code is used when the plugin encounters an error that can be retried.

`BAD_INPUT (2)` - This error code is used when the plugin encounters an error due to bad input.

The Deploy Engine will retry transient errors based on a configured retry and backoff strategy.

## Service (Registration/Deregistration)

The Deploy Engine provides a gRPC service for plugins to register and deregister themselves. The following gRPC service definitions are supported for a provider in the selected version of the Deploy Engine:

- [Service v1 gRPC Reference](https://github.com/two-hundred/celerity/tree/main/libs/deploy-engine/plugin/providerservice/service.proto)

## Local Network Only

Plugins must be accessible from the Deploy Engine via the local network through the loopback interface or a unix socket. Remote plugins are not supported for security and performance reasons. In regards to security, plugins do not support TLS to keep the plugin system simple and easy to use. In regards to performance, local plugins are expected to be fast and reliable, remote plugins introduce latency and potential network issues.

The Deploy Engine will always attempt to connect to a plugin via the `127.0.0.1` loopback address or a unix socket, plugins can only configure the port to listen on when TCP is used.

## Advanced Use Cases

### Opting Out

When building the engine from source, you can opt out of the gRPC-based plugin system by setting the `CELERITY_DEPLOY_ENGINE_DISABLE_PLUGINS` environment variable to `true`.
When doing this, you will need to make sure that all the `provider.Provider` and `transformer.SpecTransformer` implementations expected by the underlying [Blueprint Framework](../../../blueprint-framework/docs/intro) are loaded in by modifying the source code that initialises the Deploy Engine.
