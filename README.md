# Celerity Docs

The website that provides documentation along with a blog for the Celerity project.
This contains general documentation for the high-level concepts and components of Celerity along with versioned documentation for the runtimes, packages and applications that make up Celerity.

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

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

#### Node.js Runtime and SDK

The Node.js runtime and SDK documentation have the same version and are organised under the `node-runtime` docs plugin ID.

The "next" version docs are under the `node-runtime/docs` folder as per the Docusarus convention for multi-instance sites.

To tag a new version of the Node.js runtime and SDK documentation use the following command:

```bash
yarn docusaurus docs:version:node-runtime <version>
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
