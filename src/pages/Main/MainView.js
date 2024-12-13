import React from 'react'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import {useNavigate} from 'react-router-dom'
import {Calendar, Modal} from '../../components'

import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import {mainActions} from '../../actions/main.action'

import './Main.scss'

dayjs.extend(weekday)

function MainView(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {recruitsData, selectedMonthlyRecruitData, dutiesData} = useSelector((state) => {
    return state['main.action']
  }, shallowEqual)

  const [selectedYearMonth, setSelectedYearMonth] = React.useState(dayjs())
  const [checkedRecruitList, setCheckedRecruitList] = React.useState(new Set())

  const [isShow, setShow] = React.useState(false)
  const [selectedRecruit, setSelectedRecruit] = React.useState(null)

  React.useEffect(() => {
    dispatch(mainActions.getRecruitsData())
    dispatch(mainActions.getDutiesData())
  }, [])

  React.useEffect(() => {
    if (recruitsData) {
      const firstDayOfMonth = dayjs(selectedYearMonth.format('YYYY-MM-01'))
      const lastDayOfMonth = dayjs(firstDayOfMonth.endOf('month').format('YYYY-MM-DD'))

      const startDate = firstDayOfMonth.weekday(0).format('YYYY-MM-DD HH:mm:ss') // 1일이 포함된 주의 일요일
      const endDate = lastDayOfMonth.weekday(6).endOf('day').format('YYYY-MM-DD HH:mm:ss') // 마지막 날이 포함된 주의 토요일

      dispatch(mainActions.getSelectedMonthlyRecruitData({startDate, endDate}))
    }
  }, [recruitsData, selectedYearMonth])

  const updateCheckedRecruitList = (id) => {
    if (!checkedRecruitList.has(id)) {
      setCheckedRecruitList((checkedRecruitList) => {
        const _checkedRecruitList = new Set(checkedRecruitList)
        _checkedRecruitList.add(id)
        return _checkedRecruitList
      })
    }
  }

  const onRecruitClick = (event) => {
    setShow(true)
    setSelectedRecruit(event)
    navigate(`${event.id}`)
    updateCheckedRecruitList(event.id)
  }

  const getDutiesLabelList = React.useCallback(
    (dutyIds = []) => {
      return dutiesData.filter((duty) => dutyIds.includes(duty.id)).map((duty) => duty.name)
    },
    [dutiesData],
  )

  const onClose = () => {
    setShow(false)
    navigate('/')
  }

  return (
    <div className="main_container">
      <Calendar
        currentDate={selectedYearMonth}
        onChangeCurrentDate={setSelectedYearMonth}
        events={selectedMonthlyRecruitData}
        renderEvent={(date, event) =>
          date === dayjs(event[`${event.type}_time`]).format('YYYY-MM-DD') && (
            <div
              key={`${event.id}-${event.type}`}
              className="flex flex_vertical_center gap_4"
              onClick={() => onRecruitClick(event)}>
              <div className={`calendar_label ${event.type} flex center`}>
                {event.type === 'start' ? '시' : '끝'}
              </div>
              <div className={checkedRecruitList.has(event.id) ? 'checked' : ''}>
                {event.company_name}
              </div>
            </div>
          )
        }
      />
      {selectedRecruit && (
        <Modal isShow={isShow} onClose={onClose}>
          <div className="modal_wrap">
            <div className="recruit_container">
              <div className="recruit_company_name">{selectedRecruit.company_name}</div>
              <div className="recruit_title">{selectedRecruit.title}</div>
              <div className="recruit_term">
                {selectedRecruit.start_time} ~ {selectedRecruit.end_time}
              </div>
              <div className="recruit_duties">
                {getDutiesLabelList(selectedRecruit.duty_ids).join(', ')}
              </div>
            </div>
            <img src={selectedRecruit.image_url} style={{maxWidth: '100%'}} />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MainView
