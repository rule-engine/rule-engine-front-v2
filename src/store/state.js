// 根级别的 state
const state = {
  socketStatus: false,
  website_name: process.env.VUE_APP_WEBSITE_NAME,
  copyright: `©2019 - 2021 ${process.env.VUE_APP_WEBSITE_NAME} 规则引擎 <a href="https://github.com" style="color: #777272;font-weight: 400;" target="_blank">Github源码</a>`,

  // 头像加载失败后的默认头像
  defaultAvatar: "this.src='"+require("/static/img/avatar.jpg")+"'",
}

export default state;
