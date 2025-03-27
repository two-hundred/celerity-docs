---
sidebar_position: 1
---
# Introduction

The Plugin Framework allows you to extend the functionality of the Deploy Engine with blueprint resources, data sources, functions and more. Plugins can either provide elements that can be used in blueprints (e.g. resource types) or apply transformations to blueprints; the former is considered a `Provider` and the latter a `Transformer`, both concepts are defined in the [Blueprint Framework](/blueprint-framework/docs/intro).

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

## Registry Protocols & Formats

The Plugin Framework comes with an official registry that plugins can be published to and downloaded from.
The registry adheres to a set of protocols and formats that can be implemented by anyone who wishes to create their own registry to host plugins. Protocols include plugin discovery and authentication.

An example for when you might want to host your own registry is when you have private plugins that you don't want to share with the public but want to leverage the Celerity CLI to manage them for an instance of the Deploy Engine.

[Start with the Registry Protocol](./registry-protocols-formats/registry-protocol)
