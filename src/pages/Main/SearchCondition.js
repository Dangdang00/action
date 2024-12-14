import React from 'react'
import {Icons} from '../../components'

function SearchCondition() {
  const companyNameInputRef = React.useRef(null)

  const [companyName, setCompanyName] = React.useState('')
  const [isShowFilterWindow, setShowFilterWindow] = React.useState(false)

  React.useEffect(() => {
    if (isShowFilterWindow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isShowFilterWindow])

  const handleOnInputClick = () => {
    if (companyNameInputRef.current) {
      companyNameInputRef.current.focus()
    }
  }

  const handleOnClose = () => {
    setShowFilterWindow(false)
  }

  return (
    <>
      <div className="search_condition_container gap_16">
        <div
          className="input_container flex flex_vertical_center gap_8"
          onClick={handleOnInputClick}>
          <Icons id="search" width={32} height={32} color="var(--grey-50)" />
          <div>
            <div className="input_label">기업명</div>
            <input
              ref={companyNameInputRef}
              type="text"
              placeholder="기업명을 검색하세요."
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
        </div>

        <div
          className="select_box_container flex"
          onClick={() => setShowFilterWindow((isShowFilterWindow) => !isShowFilterWindow)}>
          <div className="select_box_wrap flex flex_vertical_center">
            <div>
              <div className="select_box_label">채용형태</div>
              <div>채용형태 선택</div>
            </div>
            <Icons id="caretDown24" width={32} height={32} color="var(--grey-50)" />
          </div>
          <div className="select_box_wrap flex flex_vertical_center">
            <div>
              <div className="select_box_label">기업분류</div>
              <div>기업분류 선택</div>
            </div>
            <Icons id="caretDown24" width={32} height={32} color="var(--grey-50)" />
          </div>
          <div className="select_box_wrap flex flex_vertical_center">
            <div>
              <div className="select_box_label">직무</div>
              <div>직무 선택</div>
            </div>
            <Icons id="caretDown24" width={32} height={32} color="var(--grey-50)" />
          </div>
        </div>
      </div>
      {isShowFilterWindow && (
        <div
          className="search_condition_window_container"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleOnClose()
            }
          }}>
          <div className="filter_window_wrap">
            <div>직무</div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchCondition
