<template>
  <div>
    <el-row>
      <el-col :span="2">
        <div style="margin-left: 20px;margin-top: 6px;">
          <img src="../assets/logo4.png" class="logo" alt=""/>
        </div>
      </el-col>
      <el-col :span="20">
        &nbsp;
      </el-col>
      <el-col :span="2">
        <a href="https://gitee.com/qwding/rule-engine"> <img
          src="https://gitee.com/static/images/logo-black.svg?t=158106664"
          style="width: 66px;height: 30px; margin-top: 20px;margin-left:16px;cursor: pointer"/></a>
      </el-col>
    </el-row>
    <div class="login-container">
      <el-form :model="ruleForm" :rules="rules"
               status-icon
               ref="ruleForm"
               label-position="left"
               label-width="0px"
               class="demo-ruleForm login-page">
        <br>
        <h3 class="title">系统登录</h3>
        <br>
        <el-form-item prop="username">
          <el-input type="text"
                    v-model="ruleForm.username"
                    auto-complete="off"
                    placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    v-model="ruleForm.password"
                    auto-complete="off"
                    placeholder="请输入密码"
          />
        </el-form-item>
        <el-checkbox
          v-model="checked"
          class="rememberme">记住密码
        </el-checkbox>
        <br> <br>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="color: #999;
            margin-top: 15%;
            height: 40px;
            bottom:0;
            font: 14px/2em Microsoft Yahei,tahoma,HELVETICA;
            width: 100%;
            text-align:center;">Copyright © 2020 规则引擎(ruleengine.cn), All Rights Reserved.
      <br>
      <span style="font-size: 13px;">京ICP备2020034246号-1</span>
    </div>
  </div>
</template>

<script>
import {login} from '@/api/userApi'

export default {
  data() {
    return {
      logining: false,
      ruleForm: {
        username: 'lq',
        password: '123',
      },
      rules: {
        username: [{required: true, message: '请输入账号', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      checked: false
    }
  },
  methods: {
    handleSubmit(event) {
      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.logining = true;
           login(this.ruleForm).then(res => {
              if (res.data) {
                this.$router.push({path: '/home'});
              } else {
                let message = res.data.message;
                this.logining = false;
                this.$alert(message, '提示', {
                  confirmButtonText: 'ok'
                })
              }
              this.logining = false;
            }).catch(error => {
              this.logining = false;
            });
          }
        }
      )
    }
  }
}
</script>

<style scoped>

.login-container {
  margin-top: 6%;
  width: 100%;
  /* 登录框上下对齐 */
  display: flex;
  align-items: center;
}

.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 0 auto;
  width: 350px;
  padding: 20px 35px 10px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

label.el-checkbox.rememberme {
  margin: 0 0 15px;
  text-align: left;
}

.logo {
  width: 180px;
  height: 59px;
}
</style>
