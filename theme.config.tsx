import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  head: (
      <>
          <link
              rel="shortcut icon"
              type="image/x-icon"
              href="/appicon.png"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta property="og:title" content="XSOverlay Documentation"/>
          <meta property="og:description" content="Documentation for XSOverlay."/>
      </>
  ),
    

    logo: <><img alt={""} src={"/appicon.png"} width={32} height={32}  /> <strong>	&nbsp;	 XSOverlay Documentation</strong></> ,
    project: {
        link: 'https://github.com/Xiexe/XSOverlay_Documentation',
  },
  chat: {
    link: 'https://discord.gg/WZm9H2BJU6',
  },
  docsRepositoryBase: 'https://github.com/Xiexe/XSOverlay_Documentation/tree/main/',
}


export default config
