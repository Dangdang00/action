import React from 'react'
import classNames from 'classnames'
import {Icons} from '../../components'

import './Checkbox.scss'

export default function Checkbox({
  id,
  onChange,
  className,
  disabled,
  children,
  fillCheckOn,
  fillCheckOff,
  checked,
}) {
  const handleOnChange = React.useCallback(
    (e) => {
      if (onChange) onChange(e.target.checked)
    },
    [onChange],
  )

  return (
    <div className="checkbox_container flex flex_vertical_center gap_4">
      <input
        type="checkbox"
        id={id}
        onChange={handleOnChange}
        disabled={disabled}
        checked={checked}
      />

      <label
        htmlFor={id}
        className={classNames(
          'checkbox_label',
          'flex',
          'flex_vertical_center',
          'gap_4',
          className,
        )}>
        {checked ? (
          <Icons id="checkOn" className="check_on" color={fillCheckOn || 'var(--secondary-100)'} />
        ) : (
          <Icons id="checkOff" className="check_off" color={fillCheckOff || 'var(--grey-50)'} />
        )}
        {children && <span>{children}</span>}
      </label>
    </div>
  )
}
