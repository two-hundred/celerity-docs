---
sidebar_position: 1
---
# Introduction

The Plugin Framework is a set of tools and libraries that allow you to extend the functionality Deploy Engine. Plugins can be used to extend the functionality of the Deploy Engine by adding providers and transformers that are compatible with the [Blueprint Framework](/blueprint-framework/docs/intro).

## Plugin System Overview

The plugin system is made up of three main components, the [Plugin Service](./plugin-system#plugin-service), [Provider](./provider) plugins and [Transformer](./transformer) plugins.

These three components are gRPC services that run as separate processes on the same host machine.
In a standard distribution, the plugin service is embedded into the Deploy Engine host application and is responsible for managing the lifecycle of the provider and transformer plugins.
The aforementioned plugins are gRPC servers that run as separate processes and are reachable to the Deploy Engine host application via a Unix domain socket or TCP connection on the loopback interface (127.0.0.1).

[Learn more about the Plugin System](./plugin-system)

## SDK

Plugins can be implemented in any language that supports gRPC, however, the Deploy Engine Plugin Framework only provides an SDK for building plugins in Go.

The SDK makes it easier to build plugins by abstracting away the scaffolding involved in setting up a gRPC server, converting data types and providing utilities to define resources, data sources, functions and more.

[Take me to the SDK Documentation](./sdk)
