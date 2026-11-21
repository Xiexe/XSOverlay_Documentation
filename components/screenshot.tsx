import React from 'react'

// UI captures are rendered at 3x and shown at 3/4 of their UI size, so every
// screenshot shares one scale and elements look the same size across pages.
const DISPLAY_DIVISOR = 4

type StaticImage = { src: string, width: number, height: number }

export function Screenshot({ image, alt }: { image: StaticImage, alt: string }) {
  return (
    <img
      className="screenshot"
      src={image.src}
      alt={alt}
      width={Math.round(image.width / DISPLAY_DIVISOR)}
      height={Math.round(image.height / DISPLAY_DIVISOR)}
    />
  )
}
