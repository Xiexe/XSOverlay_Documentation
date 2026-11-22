# How to contribute
XSOverlay's documentation is built on Nextra and deployed through Vercel.

In order to contribute, you will need to do the following:

- [ ] Install NodeJS (18.17 or later)
- [ ] Clone this repository
- [ ] Install dependencies: `npm install`
- [ ] Run the local dev site: `npm run dev`

The site will compile any new changes while running. Once you've made your desired changes, just create a PR with an appropriate title.

# Nextra
In order to format pages, please follow the guides provided by Nextra, [located here](https://nextra.site/docs/guide).

# Settings pages
`pages/settings/` mirrors the in-app settings: one page per tab, `##` per section, `###` per setting. `pages/overlays.mdx` holds the per-overlay settings. The structure, labels, defaults, ranges and options are generated from the settings UI that ships with XSOverlay:

```
npm run settings:sync -- "C:/Program Files (x86)/Steam/steamapps/common/XSOverlay"
```

The path is optional when XSOverlay is installed in the default Steam library. Each setting starts with a generated block (marker comment, heading and facts line) that ends at the first blank line. Write descriptions below that blank line; they are kept when the sync runs again. The script lists settings that still need a description, and prints the prose of any setting removed from the app.
