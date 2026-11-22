// Wraps each entry on reference pages in a card: the entry's heading and everything
// after it, up to the next heading of the same or a higher level.
// Headings keep their ids, so anchors and the table of contents are unchanged.

const CARD_PAGES = [
  // One card per setting or command.
  { path: /[\\/]pages[\\/](settings|Developer[\\/]websocket-api[\\/]commands)[\\/]/, heading: 3 },
  { path: /[\\/]pages[\\/]getting-started[\\/]overlays\.mdx$/, heading: 3 },
  // One card per issue.
  { path: /[\\/]pages[\\/]commonissues\.mdx$/, heading: 2 },
]

const headingLevel = node => node.type === 'element' && /^h[1-6]$/.test(node.tagName) ? Number(node.tagName[1]) : null

module.exports = function rehypeReferenceCards() {
  return (tree, file) => {
    const page = CARD_PAGES.find(p => p.path.test(file.path || ''))
    if (!page) return

    const children = []
    let card = null
    for (const node of tree.children) {
      const level = headingLevel(node)
      if (level === page.heading) {
        card = { type: 'element', tagName: 'section', properties: { className: ['reference-card'] }, children: [node] }
        children.push(card)
      } else if (level !== null && level < page.heading) {
        card = null
        children.push(node)
      } else if (card) {
        card.children.push(node)
      } else {
        children.push(node)
      }
    }
    tree.children = children
  }
}
