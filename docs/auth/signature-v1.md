---
sidebar_position: 3
---

# Celerity Signature v1

Celerity Signature v1 can be used to authenticate with Celerity components that provide HTTP APIs such as the [Build Engine API](/build-engine/docs/intro) and the [Workflow Runtime](/workflow-runtime/docs/intro).


## Specification

Celerity Signature v1 is a custom authentication mechanism that avoids the transportation of private API keys over the wire by using them in combination with a public key ID, timestamp and custom request headers to create a signature.

### Key Pairs

Celerity Signature v1 uses a key pair that consists of a key ID and a secret key. The key ID is used to identify the key pair and the secret key is used to sign the message.

A key ID should be a 128-bit cryptographically secure random string that can be used to identify the key pair.

A secret key should be a 256-bit cryptographically secure random string that can be used to sign the message.

You can generate a key pair using the Celerity CLI:

```bash
celerity signature-v1 create-key-pair
```

A key pair can also be generated using tools like `openssl`:

```bash
openssl rand -hex 16 # key ID
openssl rand -hex 32 # secret key
```

### Message

The message is created by concatenating the public key of a key pair, a special date header and custom request headers in the following format:

```
{keyId},celerity-date={timestamp},{header1-name}={header1-value},...,{headerN-name}={headerN-value}
```

`{timestamp}` is a unix timestamp in seconds.

:::warning header name case
The header names in the message must be in lowercase when creating the message.
The request headers should be looked up in a case-insensitive manner when verifying the signature.
:::

### Signature

The message created as per the format above is signed using the secret key of the key pair to create a signature.

The signature is created using the HMAC-SHA256 algorithm with the secret key of the key pair where the raw digest is encoded using base64.

Psuedo code for creating the signature:

```
signature = BASE64_URL_ENCODE(HMAC_SHA256(message, secretKey))
```

The implementation of the `BASE64_URL_ENCODE` function must use the url-safe alphabet defined in [RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648#section-5).

### Header Format

The signature is included in the `Celerity-Signature-V1` header of a HTTP request in the following format:

```
Celerity-Signature-V1: keyId="{keyId}", headers="celerity-date {header1-name} ... {headerN-name}", signature="{signature}"
```

`{keyId}` is the key ID of the key pair used to sign the message.

`{header1-name} ... {headerN-name}` are the names of the custom request headers used to create the message.

`{signature}` is a message of the format defined in the [Message](#message) section signed using the secret key of the key pair using the approach defined in the [Signature](#signature) section.

`celerity-date` is a special header that is used to prevent replay attacks. The timestamp in the message should be within a certain time window of the current time on the server to prevent replay attacks.

All the headers listed and used to create the signature must be present in the HTTP request.

:::warning Order of parts in the header value
The parts of the `Celerity-Signature-V1` header must be in the following order:
1. `keyId`
2. `headers`
3. `signature`
:::

:::warning Header name case
All header names must be in lowercase in the `headers` part of the `Celerity-Signature-V1` header.
:::

### Verifying the Signature

The server can verify the signature by using the following steps:

1. Extract the key ID, headers and signature from the `Celerity-Signature-V1` header of the HTTP request.
2. Check each header listed in the headers field of the signature is present in the HTTP request.
3. Create the [message](#message) using the public key, timestamp in the `Celerity-Date` header and custom request headers.
4. Obtain the secret key for the key ID from a secure location.
5. Create the [signature](#signature) using the message and the secret key.
6. Compare the signature created in step 5 with the signature in the `Celerity-Signature-V1` header using a secure HMAC comparison that is resistant to timing attacks.

7. If the signatures match, check that the timestamp in the `Celerity-Date` header is within a certain time window of the current time on the server to prevent replay attacks.

If the timestamp is within the time window, the request should be authenticated.

### Handling Clock Skew

The timestamp in the message is used to prevent replay attacks. The timestamp should be within a certain time window of the current time on the server to prevent replay attacks.

The server should handle clock skew by allowing a certain amount of time difference between the timestamp in the message and the current time on the server.

A reasonable default would be 5 minutes difference between the timestamp in the message and the current time on the server.

## Configuring Key Pairs

Signature v1 Key pairs can be configured using environment variables or configuration files.
You can find the supported approaches in the documentation for each Celerity component that supports Signature v1.

## Revoking Key Pairs

To revoke Signature v1 Key pairs, delete the key pair from the configuration file or environment variable and restart the Celerity component that uses it.

## Using the Signature

To use the signature, you must include it in the `Celerity-Signature-V1` header of a HTTP request.

```
POST /v1/run HTTP/1.1
Host: api.workflow.example.com
Celerity-Signature-V1: keyId="{keyId}", headers="Celerity-Date", signature="{signature}"
Celerity-Date: {timestamp}
Content-Type: application/json
Content-Length: 170

{
    "workflow": "my-workflow",
    "input": {
        "foo": "bar"
    }
}
```

_This is example does not use any custom headers for the signature._
