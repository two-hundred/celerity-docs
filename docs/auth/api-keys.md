---
sidebar_position: 2
---

# API Keys

API keys can be used to authenticate with Celerity components with HTTP APIs such as the [Deploy Engine API](/deploy-engine/docs/intro) and the [Workflow Runtime](/workflow-runtime/docs/intro).

API keys are shared secrets that are only known by the caller and an instance of one of the Celerity applications.

## Creating API Keys

You can create an API key using the Celerity CLI:
    
```bash
celerity api-key create
```

This will generate a 256-bit cryptographically secure random string that can be used as an API key.

You can also generate an API key using tools like `openssl`:

```bash 
openssl rand -hex 32
```

## Configuring API Keys

API keys can be configured using environment variables or configuration files.
You can find the supported approaches in the documentation for each Celerity component that supports API keys.

## Revoking API Keys

To revoke API keys, delete the key from the configuration file or environment variable and restart the Celerity component that uses the key.

## Using API Keys

To use an API key, you must include it in the `Celerity-Api-Key` header of a HTTP request.

```
POST /v1/run HTTP/1.1
Host: api.workflow.example.com
Celerity-Api-Key: {apiKey}
Content-Type: application/json
Content-Length: 170
    
    {
        "workflow": "my-workflow",
        "input": {
            "foo": "bar"
        }
    }
```
