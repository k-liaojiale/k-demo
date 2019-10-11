let accessToken = ''
let citySelParams = ''
let orgId = ''
let org = ''

try {
  if (localStorage.accessToken) {
    accessToken = localStorage.accessToken
  }
  if (localStorage.citySelParams) {
    citySelParams = JSON.parse(localStorage.citySelParams)
  }
  if (localStorage.orgId) {
    orgId = localStorage.orgId
  }
  if (localStorage.org) {
    org = JSON.parse(localStorage.org)
  }
} catch (e) {}

export default {
  accessToken: accessToken,
  citySelParams: citySelParams,
  orgId: orgId,
  org: org
}
