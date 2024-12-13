import React from 'react'
import {IconMapping} from './IconMapping'

import './icons.scss'

export default function Icon({id, width, height, viewBox, style, ...rest}) {
  const IconPath = IconMapping[id]

  return (
    <svg
      width={width || 20}
      height={height || 20}
      viewBox={viewBox || '0 0 20 20'}
      xmlns="http://www.w3.org/2000/svg"
      className="icon_container"
      style={style}
      {...rest}>
      {IconPath}
    </svg>
  )
}