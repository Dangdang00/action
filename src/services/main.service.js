import axios from 'axios'
import APIConfig from './api.config'

// 채용 공고 목록 조희
export const getRecruitsData = () => axios.get(`${APIConfig.url}/recruits.json`)
