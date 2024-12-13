import axios from 'axios'
import APIConfig from './api.config'

// 채용 공고 목록 조희
export const getRecruitsData = () => axios.get(`${APIConfig.url}/recruits.json`)

// 직무 목록 조희
export const getDutiesData = () => axios.get(`${APIConfig.url}/duties.json`)
