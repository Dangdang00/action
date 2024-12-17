import React from 'react'
import classNames from 'classnames'
import {IconMapping} from './IconMapping'

import './Icon.scss'

export default function Icon({id, width, height, viewBox, className, style, ...rest}) {
  const IconPath = IconMapping[id]

  return (
    <svg
      width={width || 20}
      height={height || 20}
      viewBox={viewBox || '0 0 20 20'}
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('icon_container', className)}
      style={style}
      {...rest}>
      {IconPath}
    </svg>
  )
}
