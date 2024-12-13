import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

// api
import * as MainAPI from '../services/main.service'

dayjs.extend(isBetween)

export const getRecruitsData = createAsyncThunk(
  'main/GET_RECRUITS_DATA',
  async (param, {rejectWithValue}) => {
    try {
      const response = await MainAPI.getRecruitsData()
      return response.data
    } catch (e) {
      return rejectWithValue(e.response.data)
    }
  },
)
export const getDutiesData = createAsyncThunk(
  'main/GET_DUTIES_DATA',
  async (param, {rejectWithValue}) => {
    try {
      const response = await MainAPI.getDutiesData()
      return response.data
    } catch (e) {
      return rejectWithValue(e.response.data)
    }
  },
)

const initialState = {
  recruitsData: null,
  monthlyRecruitData: null,
}

const main = createSlice({
  name: 'main',
  initialState,
  reducers: {
    getmonthlyRecruitData: (state, {payload}) => {
      const {startDate, endDate} = payload

      const recruitsData = state.recruitsData

      const _monthlyRecruitData = []
      recruitsData.map((data) => {
        if (dayjs(data.start_time).isBetween(startDate, endDate, 'second', '[]')) {
          _monthlyRecruitData.push({...data, type: 'start'})
        }

        if (dayjs(data.end_time).isBetween(startDate, endDate, 'second', '[]')) {
          _monthlyRecruitData.push({...data, type: 'end'})
        }
      })

      _monthlyRecruitData.sort((a, b) => {
        // 날짜 기준 정렬
        const dateCompare = dayjs(a[`${a.type}_time`]).diff(dayjs(b[`${b.type}_time`]))
        if (dateCompare !== 0) return dateCompare

        // type 기준 정렬
        const typePriority = {start: 0, end: 1}
        const typeCompare = typePriority[a.type] - typePriority[b.type]
        if (typeCompare !== 0) return typeCompare

        // company_name 기준 정렬 (알파벳 순)
        return a.company_name.localeCompare(b.company_name)
      })

      state.monthlyRecruitData = _monthlyRecruitData
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRecruitsData.fulfilled, (state, {payload}) => {
      state.recruitsData = payload
    })
    builder.addCase(getRecruitsData.rejected, (state, _) => {
      state.recruitsData = null
    })
    builder.addCase(getDutiesData.fulfilled, (state, {payload}) => {
      state.dutiesData = payload
    })
    builder.addCase(getDutiesData.rejected, (state, _) => {
      state.dutiesData = null
    })
  },
})

export const mainActions = {
  ...main.actions,
  getRecruitsData,
  getDutiesData,
}
export default main.reducer
