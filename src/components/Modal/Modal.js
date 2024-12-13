import React from 'react'
import ReactDOM from 'react-dom'
import {Icons} from '../../components'

import './Modal.scss'

export default function Modal({isShow, onPrevClick, onNextClick, onClose, children}) {
  React.useEffect(() => {
    if (isShow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isShow])

  return (
    isShow &&
    ReactDOM.createPortal(
      <div
        className="modal_container dimm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}>
        {onPrevClick && (
          <Icons
            id="arrowLeft24"
            className="arrow_icon left"
            width={48}
            height={48}
            viewBox="0 0 24 24"
            color="var(--grey-80)"
            onClick={onPrevClick}
          />
        )}
        <div className="modal">
          <div className="flex flex_horizontal_end">
            <Icons
              id="close24"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              color="var(--grey-50)"
              onClick={onClose}
            />
          </div>
          {children}
        </div>
        {onNextClick && (
          <Icons
            id="arrowRight24"
            className="arrow_icon right"
            width={48}
            height={48}
            viewBox="0 0 24 24"
            color="var(--grey-80)"
            onClick={onNextClick}
          />
        )}
      </div>,
      document.body,
    )
  )
}
