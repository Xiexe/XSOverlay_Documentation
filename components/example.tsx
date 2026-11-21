import React from 'react'
import { Tabs } from 'nextra/components'

const languages = ['JavaScript', 'C#']

// Wraps one code block per language. The chosen language is shared across pages.
export function Example({ children }: { children: React.ReactNode }) {
  const blocks = React.Children.toArray(children).filter(React.isValidElement)
  return (
    <Tabs items={languages.slice(0, blocks.length)} storageKey="xso-example-language">
      {blocks.map((block, index) => <Tabs.Tab key={index}>{block}</Tabs.Tab>)}
    </Tabs>
  )
}
