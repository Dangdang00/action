import React from 'react'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import {Calendar} from '../../components'

import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import {mainActions} from '../../actions/main.action'

import './Main.scss'

dayjs.extend(weekday)

function MainView(props) {
  const dispatch = useDispatch()

  const {recruitsData, selectedMonthlyRecruitData} = useSelector((state) => {
    return state['main.action']
  }, shallowEqual)

  const [selectedYearMonth, setSelectedYearMonth] = React.useState(dayjs())
  const [checkedRecruitList, setCheckedRecruitList] = React.useState([])

  React.useEffect(() => {
    dispatch(mainActions.getRecruitsData())
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

  return (
    <div className="main_container">
      <Calendar
        currentDate={selectedYearMonth}
        onChangeCurrentDate={setSelectedYearMonth}
        events={selectedMonthlyRecruitData}
        renderEvent={(date, event) =>
          date === dayjs(event[`${event.type}_time`]).format('YYYY-MM-DD') && (
            <div key={`${event.id}-${event.type}`} className="flex flex_vertical_center gap_4">
              <div className={`calendar_label ${event.type} flex center`}>
                {event.type === 'start' ? '시' : '끝'}
              </div>
              <div className={checkedRecruitList.includes(event.id) ? 'checked' : ''}>
                {event.company_name}
              </div>
            </div>
          )
        }
      />
    </div>
  )
}

export default MainView
