(() => {
  const sendBtn = document.querySelector('.send-btn')
  const contentContainer = document.querySelector('.content-body')
  const inputContainer = document.querySelector('.input-container')
  const selectType = document.querySelector('.select-container')
  const arrowIcon = document.querySelector('.arrow-container')
  const selectItem = document.querySelectorAll('.select-item')
  const closeBtn = document.querySelector('.close')
  let sendType = 'enter'
  let chatTotal = 0
  let page = 0
  let size = 10

  /* 初始化函数 */
  const init = () => {
    getUserInfo()
    initChatList()
    initEvent()
  }

  /* 事件入口函数 */
  const initEvent = () => {
    sendBtn.addEventListener('click', onSendBtnClick)
    arrowIcon.addEventListener('click', onArrowIconClick)
    closeBtn.addEventListener('click', onCloseBtnClick)
    inputContainer.addEventListener('keyup', onInputContainerKeyup)
    contentContainer.addEventListener('scroll', onContentCntainerScroll)
    selectItem.forEach(item => item.addEventListener('click', onSelectItemClick))
  }

  /* 退出事件 */
  const onCloseBtnClick = () => {
    sessionStorage.removeItem('token')
    window.location.replace('./login.html')
  }

  /* 滚动事件 */
  const onContentCntainerScroll = function () {
    if (this.scrollTop === 0) {
      if (chatTotal <= (page + 1) * size) return
      page++
      initChatList('front')
    }
  }

  /* 点击箭头显示弹窗 */
  const onArrowIconClick = () => {
    selectType.style.display = 'block'
  }

  /* 选择发送类型列表事件 */
  const onSelectItemClick = function () {
    selectItem.forEach(item => item.classList.remove('on'))
    this.classList.add('on')
    const type = this.getAttribute('type')
    sendType = type
    selectType.style.display = 'none'
  }
  /* 输入事件 */
  const onInputContainerKeyup = function (e) {
    if (e.keyCode === 13 && sendType === 'enter' && !e.ctrlKey || e.keyCode === 13 && sendType === 'ctrlEnter' && e.ctrlKey) {
      sendBtn.click()
    }
  }
  /* 点击事件触发函数 */
  const onSendBtnClick = async () => {
    const content = inputContainer.value.trim()
    if (!content) {
      window.alert('发送消息不能为空')
      return
    }
    document.querySelector('.input-container').value = ''
    renderChatForm([{ from: 'user', content }], 'end')

    const response = await fetchFn({
      url: "https://study.duyiedu.com/api/chat",
      method: 'POST',
      params: { content }
    })
    if (response.code !== 0) {
      // window.alert(response.msg + '请重新进行登录')
      window.location.replace(baseURL + 'login.html')
      return
    }
    renderChatForm([{ from: 'robot', content: response.data.content }], 'end')
  }

  /* 获取用户信息 */
  const getUserInfo = async () => {
    const response = await fetchFn({
      url: "https://study.duyiedu.com/api/user/profile",
    })

    checkFrontEnd(response, () => {
      document.querySelector('.nick-name').innerHTML = response.data.nickname
      document.querySelector('.account-name').innerHTML = response.data.loginId
      document.querySelector('.login-time').innerHTML = formaDate(response.data.lastLoginTime)
    })
  }

  /* 初始化聊天列表 */
  const initChatList = async (direction = "end") => {
    const response = await fetchFn({
      url: "https://study.duyiedu.com/api/chat/history",
      params: {
        page,
        size
      }
    })
    checkFrontEnd(response, () => {
      chatTotal = response.chatTotal
      renderChatForm(response.data, direction)
    })
  }

  /* 渲染界面内容 */
  const renderChatForm = (lists, direction) => {
    if (!lists.length) {
      contentContainer.innerHTML = ` <div class="chat-container robot-container">
                                        <img src="./img/robot.jpg" alt="">
                                        <div class="chat-txt">
                                            您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                                        </div>
                                    </div>`
      return
    }
    lists.reverse()
    const chatData = lists.map(item => {
      return item.from === 'user'
        ? ` <div class="chat-container avatar-container">
                <img src="./img/avtar.png" alt="">
                <div class="chat-txt">${item.content}</div>
            </div>`
        : ` <div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                  ${item.content}
                </div>
            </div>`
    }).join(' ')
    if (direction === 'end') {
      contentContainer.innerHTML += chatData
      const bottomDistance = document.querySelectorAll('.chat-container')[document.querySelectorAll('.chat-container').length - 1].offsetTop
      contentContainer.scrollTo(0, bottomDistance)
    } else {
      contentContainer.innerHTML = chatData + contentContainer.innerHTML
    }
  }

  /* 检测后端返回状态 */
  const checkFrontEnd = (response, cb) => {
    if (response.code !== 0) {
      // window.alert(response.msg + '请重新进行登录')
      window.location.replace(baseURL + 'login.html')
    } else {
      cb && cb()
    }
  }

  init()
})()