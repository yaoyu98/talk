(function () {
  const formContainer = document.querySelector('#formContainer')
  const userNameNode = document.querySelector('#userName')
  const userNicknameNode = document.querySelector('#userNickname')
  const userPasswordNode = document.querySelector('#userPassword')
  const userConfirmPasswordNod = document.querySelector('#userConfirmPassword')
  let IsRepeat = false

  const init = function () {
    initEvent();
  }

  /* 事件绑定函数 */
  const initEvent = () => {
    formContainer.addEventListener('submit', onFormSubmitClick)
    userNameNode.addEventListener('blur', onUserNameClick)
  }

  /* 登录按钮事件函数 */
  const onFormSubmitClick = (e) => {
    e.preventDefault()
    const loginId = userNameNode.value.trim()
    const loginPwd = userPasswordNode.value.trim()
    const nickname = userNicknameNode.value.trim()
    const confirmPassword = userConfirmPasswordNod.value.trim()

    if (!checkForm({ loginId, loginPwd, nickname, confirmPassword })) return
    sendFrontEnd({ loginId, loginPwd, nickname })
  }

  /* 表单检测 */
  const checkForm = ({ loginId, loginPwd, nickname, confirmPassword }) => {
    switch (true) {
      case !loginId:
        window.alert('注册用户名不能为空')
        return
      case !nickname:
        window.alert('注册昵称不能为空')
        return
      case !loginPwd:
        window.alert('密码不能为空')
        return
      case !confirmPassword:
        window.alert('确认密码不能为空')
        return
      case confirmPassword !== loginPwd:
        window.alert('两次输入密码不一致')
        return
      default:
        return true
    }
  }

  /* 用户名输入框失去焦点点击事件 */
  const onUserNameClick = async function () {
    const loginId = this.value.trim()
    if (!loginId) return
    const response = await fetchFn({
      url: "https://study.duyiedu.com/api/user/exists",
      params: { loginId }
    })
    if (response.code === 1) {
      window.alert(response.msg)
      IsRepeat = true
    } else {
      IsRepeat = false
    }
  }

  /* 请求后端接口进行跳转操作 */
  const sendFrontEnd = async (params) => {
    const response = await fetchFn({
      url: "https://study.duyiedu.com/api/user/reg",
      method: "POST",
      params
    })
    if (response.code === 400) {
      window.alert(response.msg)
    }
    response.code === 0 && window.location.replace(baseURL)
  }
  init()
})()