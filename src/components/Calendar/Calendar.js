import React from 'react'
import dayjs from 'dayjs'
import {Icons} from '../../components'

import './Calendar.scss'

export default function Calendar({currentDate, onChangeCurrentDate, events, renderEvent}) {
  const daysOfWeek = React.useMemo(
    () =>
      Array.from({length: 7}, (_, index) => {
        return dayjs().weekday(index).format('ddd').toUpperCase() // 요일 이름
      }),
    [],
  )

  const dateList = React.useMemo(() => {
    const firstDayOfMonth = dayjs(currentDate.format('YYYY-MM-01'))
    const lastDayOfMonth = dayjs(firstDayOfMonth.endOf('month').format('YYYY-MM-DD'))

    const startDate = firstDayOfMonth.weekday(0) // 1일이 포함된 주의 일요일
    const endDate = lastDayOfMonth.weekday(6) // 마지막 날이 포함된 주의 토요일

    const _dateList = []
    let _date = startDate

    while (_date.isBefore(endDate) || _date.isSame(endDate)) {
      _dateList.push(_date.format('YYYY-MM-DD'))
      _date = _date.add(1, 'day')
    }

    return _dateList
  }, [currentDate])

  const handlePreviousMonth = React.useCallback(() => {
    onChangeCurrentDate((selectedYearMonth) => selectedYearMonth.subtract(1, 'month'))
  }, [onChangeCurrentDate])

  const handleNextMonth = React.useCallback(() => {
    onChangeCurrentDate((selectedYearMonth) => selectedYearMonth.add(1, 'month'))
  }, [onChangeCurrentDate])

  return (
    <>
      <div className="calendar_container">
        <div className="calendar_header flex center gap_16">
          <Icons
            id="arrowLeft24"
            viewBox="0 0 24 24"
            color="var(--grey-50)"
            onClick={handlePreviousMonth}
          />
          <span>{currentDate.format('YYYY-MM')}</span>
          <Icons
            id="arrowRight24"
            viewBox="0 0 24 24"
            color="var(--grey-50)"
            onClick={handleNextMonth}
          />
        </div>
        <div className="calendar_body">
          {daysOfWeek.map((name) => (
            <div key={name} className="calendar_day_name">
              {name}
            </div>
          ))}
          {dateList.map((date) => {
            return (
              <div key={date} className="calendar_date_container">
                <div className="calendar_date">{dayjs(date).format('D')}</div>
                <div className="calendar_content flex_column gap_4">
                  {events?.map((event) =>
                    renderEvent ? (
                      renderEvent(date, event)
                    ) : (
                      <div key={`${event.id}-${event.type}`}>{event.company_name}</div>
                    ),
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
