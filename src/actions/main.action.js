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

const initialState = {
  recruitsData: null,
  selectedMonthlyRecruitData: null,
}

const main = createSlice({
  name: 'main',
  initialState,
  reducers: {
    getSelectedMonthlyRecruitData: (state, {payload}) => {
      const {startDate, endDate} = payload

      const recruitsData = state.recruitsData

      const _selectedMonthlyRecruitData = []

      recruitsData.map((data) => {
        if (dayjs(data.start_time).isBetween(startDate, endDate, 'second', '[]')) {
          _selectedMonthlyRecruitData.push({...data, type: 'start'})
        }

        if (dayjs(data.end_time).isBetween(startDate, endDate, 'second', '[]')) {
          _selectedMonthlyRecruitData.push({...data, type: 'end'})
        }
      })

      // type과 company_name 순으로 정렬
      _selectedMonthlyRecruitData.sort((a, b) => {
        // type 정렬 (start가 먼저 오도록 매핑)
        const typeOrder = (type) => (type === 'start' ? 0 : 1)
        const typeComparison = typeOrder(a.type) - typeOrder(b.type)

        if (typeComparison !== 0) return typeComparison

        // company_name 정렬 (알파벳 순)
        return a.company_name.localeCompare(b.company_name)
      })

      state.selectedMonthlyRecruitData = _selectedMonthlyRecruitData
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRecruitsData.fulfilled, (state, {payload}) => {
      state.recruitsData = payload
    })
    builder.addCase(getRecruitsData.rejected, (state, _) => {
      state.recruitsData = null
    })
  },
})

export const mainActions = {
  ...main.actions,
  getRecruitsData,
}
export default main.reducer
