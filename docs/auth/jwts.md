---
sidebar_position: 3
---

# JWTs

JWTs (JSON Web Tokens) can be used to authenticate with Celerity components that provide HTTP APIs such as the [Deploy Engine](/deploy-engine/docs/intro) and the [Workflow Runtime](/workflow-runtime/docs/intro).

JWTs must be issued by an OAuth2 or OIDC provider that is configured for the Celerity component you are authenticating with. Public keys must be exposed by the provider via a JWKS (JSON Web Key Set) endpoint.
The provider is expected to have a discovery endpoint that exposes the JWKS URI and other metadata required to validate the JWT. Celerity components expect an OIDC or OAuth2 provider discovery endpoint to be of the form `{issuer}/.well-known/openid-configuration` or `{issuer}/.well-known/oauth-authorization-server`.

`{issuer}` represents the domain of the provider that is used to validate the issuer of the JWT and is used as the base URL for the discovery endpoint.

Celerity components need to be configured with pre-determined audience that the authorisation server can issue tokens for. This audience is used to validate the `aud` claim in the JWT. The audience is typically the client ID of an OAuth2 or OIDC application created for the Celerity component that will be authenticating requests.

See the Celerity component documentation for more information on how to configure authentication for JWTs issued by OIDC or OAuth2 providers.

## Using JWTs

To use a JWT, you must include it in the `Authorization` header of a HTTP request.

```
POST /v1/run HTTP/1.1
Host: api.workflow.example.com
Authorization: Bearer {JWT}
Content-Type: application/json
Content-Length: 170
    
    {
        "workflow": "my-workflow",
        "input": {
            "foo": "bar"
        }
    }
```
