import React from 'react'

type Field<P> = [keyof P, string]

function Meta<P extends Record<string, string | undefined>>({ props, fields }: { props: P, fields: Field<P>[] }) {
  return (
    <div className="meta">
      {fields.map(([key, label]) => props[key] && (
        <span key={String(key)} className="meta-chip">
          <span className="meta-label">{label}</span>
          {props[key]}
        </span>
      ))}
    </div>
  )
}

type SettingMetaProps = {
  default?: string
  range?: string
  options?: string
  shownWhen?: string
  unlockedBy?: string
}

export function SettingMeta(props: SettingMetaProps) {
  return <Meta props={props} fields={[
    ['default', 'Default'],
    ['range', 'Range'],
    ['options', 'Options'],
    ['shownWhen', 'Shown when'],
    ['unlockedBy', 'Unlocked by'],
  ]} />
}

type CommandMetaProps = {
  jsonData?: string
  rawData?: string
  response?: string
}

export function CommandMeta(props: CommandMetaProps) {
  return <Meta props={props} fields={[
    ['jsonData', 'jsonData'],
    ['rawData', 'rawData'],
    ['response', 'Response'],
  ]} />
}
