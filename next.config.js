const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
  mdxOptions: {
    rehypePlugins: [require('./mdx-plugins/rehype-reference-cards')],
  },
})

const redirects = [
  ['/Developer/API/websockets/websockets', '/Developer/websocket-api/overview'],
  ['/Developer/API/websockets/apicommands', '/Developer/websocket-api/commands/overlays'],
  ['/Developer/API/websockets/commands/events', '/Developer/websocket-api/events'],
  ['/Developer/API/websockets/commands/:page', '/Developer/websocket-api/commands/:page'],
  ['/Developer/API/legacy_udp/notifications', '/Developer/legacy-udp-notifications'],
  ['/Developer/udp-notifications', '/Developer/legacy-udp-notifications'],
  ['/gettingstarted', '/getting-started/wrist-overlay'],
  ['/getting-started', '/getting-started/wrist-overlay'],
  ['/settings', '/settings/general'],
  ['/settings/bindings', '/getting-started/controls'],
  ['/debugging', '/commonissues#log-files'],
  ['/overlaysettings', '/getting-started/overlays'],
  ['/overlays', '/getting-started/overlays'],
]

module.exports = withNextra({
  async redirects() {
    return redirects.map(([source, destination]) => ({ source, destination, permanent: true }))
  },
})
