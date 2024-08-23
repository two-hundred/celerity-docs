---
sidebar_position: 2
---

# Configuring Celerity CLI

The Celerity CLI can be configured using CLI options, a configuration file or environment variables.
It is designed to have good defaults, but sometimes you will want to customise the behaviour.

:::note
The order of precedence for configuration is:
1. CLI options
2. Environment variables
3. Configuration file
4. Default values
:::

## Configuration File

The CLI looks for a configuration file in the following locations by default:
- `<rootDir>/celerity.config.yml`
- `<rootDir>/celerity.config.yaml`
- `<rootDir>/celerity.config.json`
- `<rootDir>/celerity.config.toml`

A custom configuration file can be specified using the `--config` flag.
You can explore values that can be configured in the [CLI reference](./reference).

## Environment Variables

The CLI can be configured using environment variables.
Environment variables prefixed with `CELERITY_CLI_` will be picked up by the CLI.
You can explore environment variables that can be configured in the [CLI reference](./reference).
