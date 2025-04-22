---
sidebar_position: 3
---
# Service Discovery Protocol

This document describes the protocol for discovering remote services that fulfil either the registry or authentication protocols.

This is the protocol used by the Celerity CLI plugin commands at the initial stage to resolve the service endpoint for the registry or authentication service.

## Mapping Host Names

The Plugin Framework supports 2 kinds of plugin identifiers, native identifiers that resolve to the `registry.celerityframework.io` domain and identifiers for custom registries that include the host name.

An example of a native plugin identifier would be `celerity/aws` and a custom registry plugin identifier would be `registry.customhost.com/celerity/azure`.
The former would be treated as `registry.celerityframework.io/celerity/aws`, leading to a resolution to the official Celerity Framework registry with the host name `registry.celerityframework.io`.
The latter would lead to a resolution to the custom registry with host name `registry.customhost.com`.

:::note
Host names in plugin identifiers are required to be fully qualified domain names (FQDNs) that can be resolved over the public internet or on the private network where the Deploy Engine is running.
:::

Now that the host name is resolved, it will be used to resolve the service endpoints to be used for the registry and authentication services.

## Service Discovery

Once the host name has been resolved for a plugin in the process of determining how to authenticate and download the plugin, the client (e.g. Celerity CLI) will obtain a discovery document from the resolved host name.

For example, if the host name is `registry.celerityframework.io`, the client will make a request to `https://registry.celerityframework.io/.well-known/celerity-services.json` to obtain the discovery document.

The client **_must_** only make requests with the `https://` scheme and the discovery document host must be secured with a valid TLS certificate.

The discovery document will contain the service endpoints for the registry and authentication services that the client can use to interact with the registry.

The discovery document will be a JSON object with the following structure:

```json
{
  "provider.v1": {
    "endpoint": "https://api.registry.celerityframework.io/v1/plugins",
    "downloadAcceptContentType": "application/octet-stream"
  },
  "transformer.v1": {
    "endpoint": "https://api.registry.celerityframework.io/v1/plugins",
    "downloadAcceptContentType": "application/octet-stream"
  },
  "auth.v1": {
    "endpoint": "https://github.com/login/oauth",
    "clientId": "your-client-id",
    "grantTypes": ["client_credentials"],
    "token": "/access_token"
  }
}
```

## Supported Services

The following services are supported by the Plugin Framework:

- `provider.v1`
  - `endpoint` (Required) - The service endpoint for the registry used for a v1 provider plugin. This can be a relative path for the resolved host name or a full URL to the service on a separate host.
  - `downloadAcceptContentType` (Optional) - The content type that the client should use in the `Accept` header to download the provider plugin archive. Some services such as GitHub may require a specific content type to be set in the `Accept` header to return the correct response. If not set, the client is free to choose an appropriate content type to accept for the request.
- `transformer.v1`
  - `endpoint` (Required) - The service endpoint for the registry used for a v1 transformer plugin. This can be a relative path for the resolved host name or a full URL to the service on a separate host.
  - `downloadAcceptContentType` (Optional) - The content type that the client should use in the `Accept` header to download the transformer plugin archive. Some services such as GitHub may require a specific content type to be set in the `Accept` header to return the correct response. If not set, the client is free to choose an appropriate content type to accept for the request.
- `auth.v1` - The service authentication configuration as per the [Authentication Protocol](./auth-protocol). This should be omitted if the registry does not require authentication.

## About Authentication

The authentication service is used to obtain access tokens that can be used to authenticate requests to the registry service.
The authentication service must implement the OAuth 2 protocol or allow for the use of API keys to authenticate requests in a HTTP header.
In the example structure above, the `auth.v1` service configuration is for the GitHub OAuth 2 service endpoint, in which case the registry service would verify the access token with GitHub and ensure that the user has the required permissions to access the registry.
Authentication is not required for the official public registry, but is useful for custom registries that require authentication.
