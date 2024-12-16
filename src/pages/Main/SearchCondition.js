import React from 'react'
import classNames from 'classnames'
import {Icons, Checkbox} from '../../components'
import {getAllNodeIdList, findParentNode} from '../../helpers'

const MAX_DEPTH = 3

function SearchCondition({setSearchData, dutiesTreeData}) {
  const companyNameInputRef = React.useRef(null)

  const [isShowFilterWindow, setShowFilterWindow] = React.useState(false)

  const [selectedDuties, setSelectedDuties] = React.useState([])
  const [selectedTreeNodes, setSelectedTreeNodes] = React.useState([])

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

  const handleSelectNode = (node, depth) => {
    setSelectedTreeNodes((selectedTreeNodes) => {
      const _selectedTreeNodes = [...selectedTreeNodes]
      _selectedTreeNodes[depth] = node
      return _selectedTreeNodes.slice(0, depth + 1)
    })
  }

  const updateParentState = (node, updatedDuties) => {
    let parentNode = findParentNode(dutiesTreeData, node.id)

    while (parentNode) {
      let isAllChildrenSelected = true
      for (const child of parentNode.children) {
        if (!updatedDuties.includes(child.id)) {
          isAllChildrenSelected = false
          break
        }
      }

      if (isAllChildrenSelected) {
        if (!updatedDuties.includes(parentNode.id)) {
          updatedDuties = [...updatedDuties, parentNode.id]
        }
      } else {
        updatedDuties = updatedDuties.filter((id) => id !== parentNode.id)
      }

      parentNode = findParentNode(dutiesTreeData, parentNode.id)
    }
    return updatedDuties
  }

  const handleSelectDuties = (node, isChecked) => {
    const nodeIdList = getAllNodeIdList(node)

    setSelectedDuties((selectedDuties) => {
      let updatedDuties = isChecked
        ? [...selectedDuties, ...nodeIdList]
        : selectedDuties.filter((id) => !nodeIdList.includes(id))

      updatedDuties = updateParentState(node, updatedDuties)

      setSearchData((searchData) => ({
        ...searchData,
        dutyList: updatedDuties,
      }))

      return Array.from(new Set(updatedDuties))
    })
  }

  const renderTreeColumn = (nodes, depth) => {
    const _selectedDuties = new Set(selectedDuties)
    return depth !== MAX_DEPTH - 1 ? (
      <div className="duty_item_wrap flex_grow">
        {nodes.map((node) => {
          const isChecked = _selectedDuties.has(node.id)
          return (
            <div
              key={node.id}
              className="duty_item flex flex_space_between flex_vertical_center"
              onClick={() => handleSelectNode(node, depth)}>
              <Checkbox
                id={node.id}
                checked={isChecked}
                onChange={() => handleSelectDuties(node, !isChecked)}>
                {node.name}
              </Checkbox>
              {node.children && node.children.length > 0 && (
                <Icons
                  id="arrowRight24"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  color="var(--grey-50)"
                />
              )}
            </div>
          )
        })}
      </div>
    ) : (
      <div className="duty_button_container flex gap_4">
        {nodes.map((node) => {
          const isChecked = _selectedDuties.has(node.id)
          return (
            <div
              className={classNames('duty_button', isChecked && 'checked')}
              onClick={() => handleSelectDuties(node, !isChecked)}>
              {node.name}
            </div>
          )
        })}
      </div>
    )
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
              onChange={(e) =>
                setSearchData((searchData) => ({...searchData, companyName: e.target.value}))
              }
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
          <div className="filter_window_wrap flex_column">
            <div>직무</div>
            <div className="duty_item_container flex">
              <div className="duty_item_wrap flex_grow">{renderTreeColumn(dutiesTreeData, 0)}</div>
              {selectedTreeNodes.map((node, index) => {
                return (
                  <div key={`duty_item_wrap_${index}`} className="duty_item_wrap flex_grow">
                    {node && renderTreeColumn(node.children, index + 1)}
                  </div>
                )
              })}
              {Array.from({length: MAX_DEPTH - 1 - selectedTreeNodes.length}, (_) => (
                <div className="duty_item_wrap flex_grow"></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchCondition
