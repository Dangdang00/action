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
  filteredMonthlyRecruitData: null,
  dutiesData: null,
  dutiesTreeData: null,
}

const getFilteredByConditions = (data, {companyName, dutyList}) => {
  if (Array.isArray(data) && data.length > 0) {
    return data.filter((item) => {
      const matchesCompanyName = companyName ? item.company_name.includes(companyName) : true
      const matchesDuties =
        dutyList && dutyList.length > 0
          ? item.duty_ids.some((id) => dutyList.includes(id)) // 교집합
          : true

      return matchesCompanyName && matchesDuties
    })
  }
  return []
}

const findNodeById = (treeData, nodeId) => {
  for (const node of treeData) {
    if (node.id === nodeId) return node
    if (node.children) {
      const targetNode = findNodeById(node.children, nodeId)
      if (targetNode) return targetNode
    }
  }
  return null
}

const main = createSlice({
  name: 'main',
  initialState,
  reducers: {
    getMonthlyRecruitData: (state, {payload}) => {
      const {startDate, endDate, searchData} = payload

      const recruitsData = state.recruitsData

      const monthlyRecruitData = []
      recruitsData.map((data) => {
        if (dayjs(data.start_time).isBetween(startDate, endDate, 'second', '[]')) {
          monthlyRecruitData.push({...data, type: 'start'})
        }

        if (dayjs(data.end_time).isBetween(startDate, endDate, 'second', '[]')) {
          monthlyRecruitData.push({...data, type: 'end'})
        }
      })

      monthlyRecruitData.sort((a, b) => {
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

      state.monthlyRecruitData = monthlyRecruitData
      state.filteredMonthlyRecruitData = getFilteredByConditions(monthlyRecruitData, searchData)
    },
    getFilteredMonthlyRecruitData: (state, {payload}) => {
      const {companyName, dutyList} = payload

      const monthlyRecruitData = state.monthlyRecruitData

      state.filteredMonthlyRecruitData = getFilteredByConditions(monthlyRecruitData, {
        companyName,
        dutyList,
      })
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
      const dutiesData = payload
      const dutiesTreeData = []

      dutiesData.map((item) => {
        if (item.parent_id === null) {
          dutiesTreeData.push({...item, children: []})
        } else {
          const targetNode = findNodeById(dutiesTreeData, item.parent_id)
          if (targetNode) {
            targetNode.children.push({...item, children: []})
          }
        }
      })

      state.dutiesData = dutiesData
      state.dutiesTreeData = dutiesTreeData
    })
    builder.addCase(getDutiesData.rejected, (state, _) => {
      state.dutiesData = null
      state.dutiesTreeData = null
    })
  },
})

export const mainActions = {
  ...main.actions,
  getRecruitsData,
  getDutiesData,
}
export default main.reducer
