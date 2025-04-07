---
sidebar_position: 2
---
# Creating Signing Keys

In order to publish plugins to the Celerity Registry, you will need to sign your plugin binaries with a GPG Signing Key using GoReleaser or similar.

## Installing GPG

In order to create the signing key, you'll need [GPG](https://gnupg.org/) installed on your machine.

On MacOS, you can install GPG using [Homebrew](https://brew.sh/):

```bash
brew install gnupg
```

On Windows and Linux, you can download the GPG installer from the [GPG website](https://gnupg.org/download/).


## Generating a GPG Key

Generate a new GPG key pair using the CLI.

```bash
gpg --full-generate-key
```

Next, you'll be prompted to select the kind of key to use as per the snippet below:

```bash
gpg (GnuPG) 2.4.7; Copyright (C) 2024 g10 Code GmbH
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (9) ECC (sign and encrypt) *default*
  (10) ECC (sign only)
  (14) Existing key from card
Your selection? 
```

The Celerity Registry only has support for RSA keys, so you should select `1` to choose the `RSA and RSA` key type.

Next, you'll be prompted to select the key size. Enter `4096` for a larger key size when prompted.

```bash
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072) 4096
Requested keysize is 4096 bits
```

Press `Enter` to continue with the default key expiration of `0` (no expiration) and confirm by entering `y` when prompted.

```bash
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 
Key does not expire at all
Is this correct? (y/N) y
```

Next, you'll be be prompted to enter your name, email address, and a comment for the key.

```bash
GnuPG needs to construct a user ID to identify your key.
```

Enter your name, email address, and leave the comment empty.

```bash
Real name: Plugin Developer
Email address: plugin-developer@mycompany.com
Comment:
```

Confirm the details by entering `O` when prompted.
Keep your `USER-ID` safe, as it will be used to generate the private and public keys later.

Lastly, you'll be prompted to enter a passphrase for the key. This passphrase is required to decrypt your GPG private key, so choose a secure passphrase and keep it safe.
Enter the passphrase twice as requested, press `Enter` and the key will be generated.

## Exporting the Public Key

You will need to add the public key to your Celerity Registry account to validate the signature for your plugin releases when users install them with the Celerity CLI.

To export the public key, run the following command, replacing `KEY-USER-ID` with the `USER-ID` containing your name and email address that you saved earlier:

```bash
gpg --armor --export "KEY-USER-ID"
```

## Exporting the Private Key

You will need to generate a private key to sign your plugin releases with GoReleaser or similar.

To export the private key, run the following command, replacing `KEY-USER-ID` with the `USER-ID` containing your name and email address that you saved earlier.
You will be prompted to enter the passphrase you set when generating the key.

```bash
gpg --armor --export-secret-keys "KEY-USER-ID"
```

:::warning
Keep your GPG keys and passphrases safe and backed up in a secure location.
You will need to use them to sign your plugin releases with GoReleaser or a similar tool
in your plugin release workflow.
:::
