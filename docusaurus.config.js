// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Celerity',
  tagline: 'The backend toolkit that gets you moving fast',
  url: 'https://celerityframework.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'two-hundred', // Usually your GitHub org/user name.
  projectName: 'celerity', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'gh-pages',
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/two-hundred/celerity-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/two-hundred/celerity-docs/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Celerity',
        logo: {
          alt: 'Celerity',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
          width: 50
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/two-hundred/celerity',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'dropdown',
            label: 'Components',
            position: 'left',
            items: [
              {
                type: 'doc',
                label: 'Blueprint Framework',
                docId: 'blueprint/intro'
              }
            ]
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/celerityframework',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/two-hundred/celerity',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} The Celerity documentation authors.`,
      },
    }),
};

module.exports = config;
