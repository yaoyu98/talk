/* fetch方法封装 */
const fetchFn = ({ url, method = 'GET', params = {} }) => {

  if (method === 'GET' && Object.keys(params).length) {
    url += '?' + Object.keys(params).map(key => ''.concat(key, '=', params[key])).join('&');
  }

  return new Promise((resolve, reject) => {
    const extendHeader = {}
    sessionStorage.token && (extendHeader.Authorization = 'Bearer ' + sessionStorage.token)
    fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json',
        ...extendHeader
      },
      cache: 'no-cache',
      body: method === 'GET' ? null : JSON.stringify(params)
    })
      .then(response => {
        const headers = response.headers.entries()
        let header = headers.next()
        header.value[0] === 'authorization' && sessionStorage.setItem('token', header.value[1])
        return response.json()
      })
      .then(data => {
        resolve(data)
      })
      .catch(err => reject(err))
  })
}
