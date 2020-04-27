import { axios } from '@/utils/request'

const api = {
  operLog: '/system/operLog',
  loginLog: '/system/loginInfo'
}

export default api

// OperLog
export function getOperLogList (parameter) {
  const { pageNum, pageSize, ...queryObj } = parameter
  return axios({
    url: api.operLog + `/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryObj,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delOperLog (parameter) {
  return axios({
    url: api.operLog + '/remove',
    method: 'post',
    params: parameter
  })
}
export function cleanOperLog () {
  return axios({
    url: api.operLog + '/clean',
    method: 'post'
  })
}
// LoginLog
export function getLoginLogList (parameter) {
  const { pageNum, pageSize, ...queryObj } = parameter
  return axios({
    url: api.loginLog + `/page/${pageNum}/${pageSize}`,
    method: 'post',
    data: queryObj,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delLoginLog (parameter) {
  return axios({
    url: api.loginLog + '/remove',
    method: 'post',
    params: parameter
  })
}
export function cleanLoginLog () {
  return axios({
    url: api.loginLog + '/clean',
    method: 'post'
  })
}

export const operLogExport = api.operLog + '/export'
