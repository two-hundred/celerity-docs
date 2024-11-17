---
sidebar_position: 1
---

# Introduction

Celerity provides a collection of helpers and specifications for authentication.
Applications with public HTTP APIs that make up Celerity such as the [Deploy Engine API](/deploy-engine/docs/intro) and the [Workflow Runtime](/workflow-runtime/docs/intro) support common authentication mechanisms including API keys and JWTs issued by [OAuth2](https://oauth.net/2/) or OIDC[^1] providers.
A custom Celerity-specific authentication mechanism is also supported that avoids the transportation of private API keys over the wire by using them in combination with a public key, timestamp and chosen request headers to create a signature, this mechanism is the called the Celerity Signature.

:::warning Authenticating your Celerity Applications
This section does **not** cover the authentication mechanisms supported in applications created with Celerity, see the [`celerity/api`](/docs/applications/resources/celerity-api) resource type documentation for more information on how to configure authentication for your application.
:::

## Authentication Mechanisms

You can delve deeper into the supported authentication mechanisms in the links below (including the specification for the Celerity Signature):

- [API Keys](/docs/auth/api-keys)
- [JWTs](/docs/auth/jwts)
- [Celerity Signature v1](/docs/auth/signature-v1)

[^1]: OpenID Connect (OIDC) is an authentication layer on top of OAuth 2.0, an authorization framework. See [OpenID Connect](https://openid.net/connect/).