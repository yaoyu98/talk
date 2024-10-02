(function () {
  const signBtn = document.querySelector('.signin')
  const userNameNode = document.querySelector('#userName')
  const userPasswordNode = document.querySelector('#userPassword')
  const formContainer = document.querySelector('#formContainer')
  const init = function () {
    initEvent();
  }

  /* 事件绑定函数 */
  const initEvent = () => {
    formContainer.addEventListener('submit', onFormSubmitClick)
  }

  /* 登录按钮事件函数 */
  const onFormSubmitClick = (e) => {
    e.preventDefault()
    const loginId = userNameNode.value.trim()
    const loginPwd = userPasswordNode.value.trim()
    if (!loginId || !loginPwd) {
      window.alert('用户名或密码不能为空')
      return
    }
    sendFrontEnd({ loginId, loginPwd })
  }

  /* 请求后端接口进行跳转操作 */
  const sendFrontEnd = async (params) => {
    const response = await fetchFn({
      url: "https://study.duyiedu.com/api/user/login",
      method: "POST",
      params
    })
    console.log(response);
    if (response.code === 400) {
      window.alert(response.msg)
      return
    }
    response.code === 0 && window.location.replace('./index.html')
  }
  init()
})()