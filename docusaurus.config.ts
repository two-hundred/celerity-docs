import { config as dotenvConfig } from "dotenv";
import { Config } from "@docusaurus/types";

import deployEnginePluginDocsPlugin from "./deploy-engine-plugin-docs-plugin";

// @ts-ignore
dotenvConfig({ silent: true });

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const config: Config = {
  title: "Celerity",
  tagline: "The backend toolkit that gets you moving fast",
  url: "https://celerityframework.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "two-hundred", // Usually your GitHub org/user name.
  projectName: "celerity", // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: "gh-pages",
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/two-hundred/celerity-docs/tree/main/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/two-hundred/celerity-docs/tree/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "celerity-cli",
        path: "cli",
        routeBasePath: "cli",
        sidebarPath: require.resolve("./sidebars-celerity-cli.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "deploy-engine",
        path: "deploy-engine",
        routeBasePath: "deploy-engine",
        sidebarPath: require.resolve("./sidebars-deploy-engine.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "blueprint-framework",
        path: "blueprint-framework",
        routeBasePath: "blueprint-framework",
        sidebarPath: require.resolve("./sidebars-blueprint-framework.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "celerity-one",
        path: "celerity-one",
        routeBasePath: "celerity-one",
        sidebarPath: require.resolve("./sidebars-celerity-one.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "workflow-runtime",
        path: "workflow-runtime",
        routeBasePath: "workflow-runtime",
        sidebarPath: require.resolve("./sidebars-workflow-runtime.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "node-runtime",
        path: "node-runtime",
        routeBasePath: "node-runtime",
        sidebarPath: require.resolve("./sidebars-node-runtime.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "csharp-runtime",
        path: "csharp-runtime",
        routeBasePath: "csharp-runtime",
        sidebarPath: require.resolve("./sidebars-csharp-runtime.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "python-runtime",
        path: "python-runtime",
        routeBasePath: "python-runtime",
        sidebarPath: require.resolve("./sidebars-python-runtime.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "java-runtime",
        path: "java-runtime",
        routeBasePath: "java-runtime",
        sidebarPath: require.resolve("./sidebars-java-runtime.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "rust-sdk",
        path: "rust-sdk",
        routeBasePath: "rust-sdk",
        sidebarPath: require.resolve("./sidebars-rust-sdk.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "go-sdk",
        path: "go-sdk",
        routeBasePath: "go-sdk",
        sidebarPath: require.resolve("./sidebars-go-sdk.js"),
      },
    ],
    deployEnginePluginDocsPlugin,
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Celerity",
        logo: {
          alt: "Celerity",
          src: "img/logo.svg",
          srcDark: "img/logo-dark.svg",
          width: 50,
        },
        items: [
          {
            type: "dropdown",
            label: "Docs",
            position: "right",
            items: [
              {
                label: "Getting Started",
                activeBasePath: "/docs/intro",
                to: "docs/intro/getting-started",
              },
              {
                label: "Blueprint",
                activeBasePath: "/docs/blueprint",
                to: "docs/blueprint/intro",
              },
              {
                label: "Runtime",
                activeBasePath: "/docs/runtime",
                to: "docs/runtime/intro",
              },
              {
                label: "Applications",
                activeBasePath: "/docs/applications",
                to: "docs/applications/intro",
              },
            ]
          },
          {
            type: "dropdown",
            label: "Components",
            position: "right",
            items: [
              {
                label: "CLI",
                activeBasePath: "/cli",
                to: "/cli/docs/intro",
              },
              {
                label: "Deploy Engine",
                activeBasePath: "/deploy-engine",
                to: "/deploy-engine/docs/intro",
              },
              {
                label: "Blueprint Framework",
                activeBasePath: "/blueprint-framework",
                to: "/blueprint-framework/docs/intro",
              },
              {
                label: "Celerity::1",
                activeBasePath: "/celerity-one",
                to: "/celerity-one/docs/intro",
              },
              {
                label: "Workflow Runtime",
                activeBasePath: "/workflow-runtime",
                to: "/workflow-runtime/docs/intro",
              }
            ],
          },

          {
            type: "dropdown",
            label: "Runtimes & SDKs",
            position: "right",
            items: [
              {
                label: "Node.js",
                activeBasePath: "/node-runtime",
                to: "/node-runtime/docs/intro",
              },
              {
                label: "C#/.NET",
                activeBasePath: "/csharp-runtime",
                to: "/csharp-runtime/docs/intro",
              },
              {
                label: "Python",
                activeBasePath: "/python-runtime",
                to: "/python-runtime/docs/intro",
              },
              {
                label: "Java",
                activeBasePath: "/java-runtime",
                to: "/java-runtime/docs/intro",
              },
              {
                label: "Rust",
                activeBasePath: "/rust-sdk",
                to: "/rust-sdk/docs/intro",
              },
              {
                label: "Go",
                activeBasePath: "/go-sdk",
                to: "/go-sdk/docs/intro",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Community",
            position: "right",
            items: [
              {
                label: "Deploy Engine Plugins",
                activeBasePath: "/community/deploy-engine/plugins",
                to: "community/deploy-engine/plugins",
              },
            ],
          },
          {
            href: "https://github.com/two-hundred/celerity",
            "aria-label": "GitHub",
            position: "right",
            className: "header-github-link",
          },
          {
            type: "docsVersionDropdown",
            title: "Node.js SDK Version",
            docsPluginId: "node-runtime",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "C# SDK Version",
            docsPluginId: "csharp-runtime",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Python SDK Version",
            docsPluginId: "python-runtime",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Java SDK Version",
            docsPluginId: "java-runtime",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Rust SDK Version",
            docsPluginId: "rust-sdk",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Go SDK Version",
            docsPluginId: "go-sdk",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Celerity CLI Version",
            docsPluginId: "celerity-cli",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Deploy Engine Version",
            docsPluginId: "deploy-engine",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Blueprint Framework Version",
            docsPluginId: "blueprint-framework",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Celerity::1 Version",
            docsPluginId: "celerity-one",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            title: "Workflow Runtime Version",
            docsPluginId: "workflow-runtime",
            position: "left",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "/docs/intro/getting-started",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/celerityframework",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/two-hundred/celerity",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} The Celerity documentation authors.`,
      },
      algolia: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME,
      },
    }),
  customFields: {
    customPluginContent: {
      "celerity-cli": {
        title: "Celerity CLI",
      },
      "node-runtime": {
        title: "Node.js Runtime & SDK",
      },
      "csharp-runtime": {
        title: "C#/.NET Runtime & SDK",
      },
      "python-runtime": {
        title: "Python Runtime & SDK",
      },
      "java-runtime": {
        title: "Java Runtime & SDK",
      },
      "rust-sdk": {
        title: "Rust SDK",
      },
      "go-sdk": {
        title: "Go SDK",
      },
      "deploy-engine": {
        title: "Deploy Engine",
      },
      "blueprint-framework": {
        title: "Blueprint Framework",
      },
      "celerity-one": {
        title: "Celerity::1",
      },
      "workflow-runtime": {
        title: "Workflow Runtime",
      },
    },
  },
};

module.exports = config;
