---
sidebar_position: 4
---
# Plugin Archive Structure

This document describes the structure of a plugin archive that can be used to distribute plugins.

## Overview

A plugin archive is a zip file that contains the plugin executable. The archive is structured as follows:

```
celerity-{pluginType}-{pluginName}_{version}_{os}_{arch}.zip
|- plugin
```

- `{pluginType}`: The type of the plugin, can be either `provider` or `transformer`.
- `{pluginName}`: The name of the plugin.
- `{version}`: The version of the plugin.
- `{os}`: The target operating system for the plugin executable.
- `{arch}`: The architecture of the plugin executable.
- `plugin`: The executable file for the plugin.

The organisation (namespace) does not need to be included in the archive name as the release archive will usually sit in a GitHub repo where the organisation is already known.
The `celerity-{pluginType}-{pluginName}` part of the archive name is expected to be the GitHub repository name for a plugin that is in the official, public Celerity Registry.

All other metadata for a plugin (such as signing keys for signature verification) will be resolved using the [Registry Protocol](./registry-protocol) that will also provide the URL to download the plugin archive.
