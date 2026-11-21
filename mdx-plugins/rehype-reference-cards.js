// Wraps each `###` on the settings and WebSocket API command pages in a card:
// the heading and everything after it, up to the next `##` or `###`.
// Headings keep their ids, so anchors and the table of contents are unchanged.

const REFERENCE_PAGES = /[\\/]pages[\\/](settings|Developer[\\/]websocket-api[\\/]commands)[\\/]/

const isHeading = (node, ...tags) => node.type === 'element' && tags.includes(node.tagName)

module.exports = function rehypeReferenceCards() {
  return (tree, file) => {
    if (!REFERENCE_PAGES.test(file.path || '')) return

    const children = []
    let card = null
    for (const node of tree.children) {
      if (isHeading(node, 'h3')) {
        card = { type: 'element', tagName: 'section', properties: { className: ['reference-card'] }, children: [node] }
        children.push(card)
      } else if (isHeading(node, 'h1', 'h2')) {
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
