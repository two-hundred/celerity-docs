# Celerity Docs

The website that provides documentation along with a blog for the Celerity project.
This contains general documentation for the high-level concepts and components of Celerity along with versioned documentation for the runtimes, packages and applications that make up Celerity.

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Versioning

The primary content for the high-level concepts and components of Celerity is **not** versioned.

Runtimes, SDKs and applications have their own versioned documentation.
Versioning isn't strictly inpepedent for each Celerity sub-project, in a lot of cases a single version is assigned to collections of Celerity sub-projects. For example, the Celerity runtime and SDK for a given language are versioned together.

#### Deploy Engine

The Deploy Engine documentation is organised under the `deploy-engine` docs plugin ID.

The "next" version docs are under the `deploy-engine/docs` folder as per the Docusarus convention for multi-instance sites.

To tag a new version of the Deploy Engine documentation use the following command:

```bash
yarn docusaurus docs:version:deploy-engine <version>
```

##### OpenAPI Docs Generation

OpenAPI is used to describe the HTTP API for the Deploy Engine, this project uses the [docusaurus-plugin-openapi](https://docusaurus.io/docs/docusaurus-plugin-openapi) plugin to generate docs from the OpenAPI spec.

You can generate the docs for the OpenAPI spec for v1 of the Deploy Engine HTTP API by running the following command:

```bash
yarn docusaurus gen-api-docs deployEnginev1
```

This will generate the OpenAPI spec for the latest version of the Deploy Engine and place it in the `docs/deploy-engine/docs/http-api-reference/v1` folder.
If you need to update versioned docs for the Deploy Engine, you can copy the contents of this folder into the versioned docs folder for the Deploy Engine.

To clean up the generated OpenAPI spec, you can run the following command:

```bash
yarn docusaurus clean-api-docs deployEnginev1
```

#### Node.js Runtime and SDK

The Node.js runtime and SDK documentation have the same version and are organised under the `node-runtime` docs plugin ID.

The "next" version docs are under the `node-runtime/docs` folder as per the Docusarus convention for multi-instance sites.

To tag a new version of the Node.js runtime and SDK documentation use the following command:

```bash
yarn docusaurus docs:version:node-runtime <version>
```

This will generate versioned files from the current docs snapshot, you should then commit and push these changes to the repository.

#### C# Runtime and SDK

The C# runtime and SDK documentation have the same version and are organised under the `csharp-runtime` docs plugin ID.

The "next" version docs are under the `csharp-runtime/docs` folder as per the Docusarus convention for multi-instance sites.

To tag a new version of the C# runtime and SDK documentation use the following command:

```bash
yarn docusaurus docs:version:csharp-runtime <version>
```

This will generate versioned files from the current docs snapshot, you should then commit and push these changes to the repository.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
