import React from 'react'

export default function StarRating({ rating, size = 'sm' }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  const sz = size === 'lg' ? 'text-xl' : 'text-sm'

  return (
    <span className={`${sz} tracking-tight`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}
