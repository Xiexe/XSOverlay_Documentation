import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="XSOverlay Documentation" />
      <meta property="og:description" content="Documentation for XSOverlay." />
    </>
  ),

  logo: <strong>XSOverlay Documentation</strong>,
  project: {
    link: 'https://github.com/Xiexe/XSOverlay_Documentation',
  },
  chat: {
    link: 'https://discord.gg/WZm9H2BJU6',
  },
  docsRepositoryBase: 'https://github.com/Xiexe/XSOverlay_Documentation/tree/main/'
}

export default config
