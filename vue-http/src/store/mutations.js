export default {
  changeToken (state, accessToken) {
    state.accessToken = accessToken
    try {
      localStorage.accessToken = accessToken
    } catch (e) {}
  },
  changeCitySel (state, citySelParams) {
    state.citySelParams = citySelParams
    try {
      localStorage.citySelParams = JSON.stringify(citySelParams)
    } catch (e) {}
  },
  changeOrgId (state, orgId) {
    state.orgId = orgId
    try {
      localStorage.orgId = orgId
    } catch (e) {}
  },
  changeOrg (state, org) {
    state.org = org
    try {
      localStorage.org = JSON.stringify(org)
    } catch (e) {}
  }
}
