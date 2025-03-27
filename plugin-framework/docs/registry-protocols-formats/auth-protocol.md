---
sidebar_position: 2
---

# Authentication Protocol

The Authentication Protocol defines how to authenticate with a registry service to discover and download plugins.
Other use cases for authentication may arise over time.

## Overview

The Celerity CLI supports authentication via the `celerity login {host}` command, where host is expected to be a host that contains a service discovery document as per the [Service Discovery Protocol](./service-discovery-protocol).

The `celerity login {host}` command will prompt the user to enter the necessary configuration to be stored in the `$HOME/.celerity/auth.json` file or will take them through the OAuth 2 authorization code flow to obtain an access token depending on the configuration provided in the service discovery document.

## Auth Configuration

The authentication configuration is provided in the service discovery document as part of the `auth.v1` object.
It can either be a simple API key that must be provided in an HTTP header or a more complex OAuth 2 flow that requires the client to obtain an access token.
For OAuth2, only the `client_credentials` and `authorization_code` grant types are supported.

### API Key

```json
{
  "auth.v1": {
    "apiKeyHeader": "My-Service-Api-Key"
  }
}
```

On the client side (e.g. environment running the Celerity CLI), the API key must be set in the `$HOME/.celerity/auth.json` file with a mapping of the host to the API key as follows:

```json title="$HOME/.celerity/auth.json"
{
  "registry.celerityframework.io": {
    "apiKey": "{api-key}"
  }
}
```

### OAuth 2 Client Credentials

```json
{
  "auth.v1": {
    "endpoint": "https://github.com/login/oauth",
    "grantTypes": ["client_credentials"],
    "token": "/access_token"
  }
}
```

On the client side (e.g. environment running the Celerity CLI), the OAuth 2 client credentials must be set in the `$HOME/.celerity/auth.json` file with a mapping of the host to the client credentials as follows:

```json title="$HOME/.celerity/auth.json"
{
  "registry.celerityframework.io": {
    "oauth2": {
      "clientId": "{client-id}",
      "clientSecret": "{client-secret}"
    }
  }
}
```

### OAuth 2 Authorization Code

```json
{
    "auth.v1": {
        "endpoint": "https://github.com/login/oauth",
        "clientId": "your-service-client-id",
        "grantTypes": ["authorization_code"],
        "authorize": "/authorize",
        "token": "/access_token"
    }
}
```

There is no need to set any configuration on the client-side for the OAuth 2 Authorization Code flow.

### Properties

The following are the properties that can be provided in the `auth.v1` object:

- `endpoint` (Optional) - The endpoint to use for an OAuth 2 flow. If omitted, and the `apiKeyHeader` is not provided, the client will use the same requested host that contains the service discovery document.
- `clientId` (Required for OAuth) - The client ID to use for an OAuth 2 flow as per [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749#section-2.2). This is only required for the `authorization_code` flow as the user must specify the client ID for the `client_credentials` flow in the `$HOME/.celerity/auth.json` file.
- `grantTypes` (Optional) - A list of grant types that the service supports. The supported grant types are `client_credentials` and `authorization_code`. If omitted, the client will default to the `authorization_code` grant type.
- `authorize` (Optional) - The path to use for the authorization step in the OAuth 2 flow. If omitted, the client will default to `/authorize`.
- `token` (Required for OAuth) - The path to use for the token step in the OAuth 2 flow.
- `apiKeyHeader` (Required for API Key) - The HTTP header to use for the API key.
