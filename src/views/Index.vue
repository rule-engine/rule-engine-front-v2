<template>
  <div id="app">
    <el-container v-loading.fullscreen.lock="fullscreenLoading">
      <el-header style="min-width: 1270px">
        <el-row>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <img src="../assets/logo.png" class="logo" alt=""/>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple-light">
              &nbsp;
            </div>
          </el-col>
          <el-col :span="3">
            <div style="line-height: 60px;text-align: right" class="header_left">
              <el-badge :value="4" type="warning">
                <el-dropdown trigger="hover">
                <span class="el-dropdown-link pointer">
                    <i class="el-icon-bell" style="color: #606266;height: 30px;cursor: pointer"/>
                </span>
                  <!--暂时先这样写死，后期有时间改为可以配置的-->
                  <el-dropdown-menu slot="dropdown" style="width: 200px">
                    <el-dropdown-item
                      style="line-height: 20px;text-align: left;padding: 4px 10px;word-break:break-all;margin-bottom: 6px;">
                      <a href="https://gitee.com/qwding/rule-engine" style="color: #606266;text-decoration: none">开源不易，欢迎点我来Star</a>
                    </el-dropdown-item>
                    <el-dropdown-item
                      style="line-height: 20px;text-align: left;padding: 4px 10px;word-break:break-all;margin-bottom: 6px;">
                      接下来一段时间不会进行开发新功能，接下来会对决策表以及规则集配置体验进行优化！
                    </el-dropdown-item>
                    <el-dropdown-item
                      style="line-height: 20px;text-align: left;padding: 4px 10px;word-break:break-all;margin-bottom: 6px;">
                      后期版本普通规则如果发布后则不能修改返回值类型，规则集条件以及结果可以引用普通规则！
                    </el-dropdown-item>

                    <el-dropdown-item
                      style="line-height: 20px;text-align: left;padding: 4px 10px;word-break:break-all;margin-bottom: 6px;">
                      日期配置待完善！
                    </el-dropdown-item>

                    <el-dropdown-item
                      style="line-height: 20px;text-align: left;padding: 4px 10px;word-break:break-all;">
                      欢迎有兴趣人可以来编写文档，贡献一份力量！
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-badge>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a href="http://ruleengine.cn/doc"><i class="el-icon-document"
                                                    style="color: #606266;cursor: pointer"/></a>
              &nbsp;&nbsp;&nbsp;
              <el-dropdown @command="rightHandleCommand" trigger="click">
                <span class="el-dropdown-link pointer">
                  {{ username }}&nbsp;<i class="el-icon-arrow-down"/>
                </span>
                <el-dropdown-menu slot="dropdown" style="width: 100px">
                  <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="grid-content bg-purple">
              <img :src="avatar" class="avatar" alt=""/></div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router :default-active="$route.path"
            class="el-menu-vertical-aside"
            @open="handleOpen"
            @close="handleClose">

            <template v-for="(item,index) in menuList">

              <el-menu-item :index="item.menuPath" v-if="item.children.length===0">
                <i :class="item.icon"/>
                <span>{{ item.name }}</span>
              </el-menu-item>

              <el-submenu :index="index.toString()" v-else>
                <template slot="title">
                  <i :class="item.icon"/>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(item,index) in item.children" :index="item.menuPath" :key="index">
                    {{ item.name }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>

            </template>

          </el-menu>
        </el-aside>
        <el-main style="min-width: 1070px">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {getUserInfo, logout} from '@/api/user'
import {menuTree} from '@/api/menu'
import {removeAll, setUserSettingCache} from '@/utils/auth'

export default {
  name: "Index",
  data() {
    return {
      fullscreenLoading: false,
      username: null,
      avatar: this.$defaultAvatar,
      menuList: []
    }
  },
  created() {
    this.fullscreenLoading = true;
    const getUserInfoRequest = new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        let data = res.data;
        if (data != null) {
          this.username = data.username;
          this.avatar = data.avatar;
          setUserSettingCache(JSON.stringify(data));
        } else {
          this.$message({
            showClose: true,
            message: '请先登陆',
            type: 'warning'
          });
          this.$router.push({path: '/login'});
        }
        resolve();
      }).catch(function (error) {
        console.log(error);
      });
    });
    const menuTreeRequest = new Promise((resolve, reject) => {
      menuTree()
        .then(res => {
          let data = res.data;
          if (data != null) {
            this.menuList = data[0].children;
          } else {
            this.$message({
              showClose: true,
              message: '没有任何访问权限',
              type: 'warning'
            });
          }
          resolve();
        }).catch(function (error) {
        console.log(error);
      });
    });
    Promise.all([getUserInfoRequest, menuTreeRequest]).then((result) => {
      this.fullscreenLoading = false;
    });
  },
  methods: {
    rightHandleCommand(command) {
      if (command === 'logout') {
        logout().then(res => {
          if (res.data) {
            removeAll()
            this.$router.push({path: '/login'});
          }
        }).catch(function (error) {
          console.log(error);
        });
      } else if (command === "userInfo") {
        this.$router.push({path: '/personalSettings'});
      }
    },
    handleOpen(key, keyPath) {

    },
    handleClose(key, keyPath) {

    }
  }
}
</script>
<style>
.header_left .el-badge__content {
  margin-top: 16px;
}
</style>
<style scoped>
.el-header, .el-footer {
  color: #333;
  text-align: center;
  line-height: 60px;
  border-bottom: 0.2px solid #e9e9e9;
}

.el-aside {
  color: #333;
  text-align: left;
  line-height: 200px;
  height: calc(100vh - 60px);
  overflow: scroll;
  border-right: solid 1px #e6e6e6;
}

.el-main {
  height: calc(100vh - 60px);
}

.el-menu-vertical-aside {
  border-right: transparent;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.bg-purple-light {
}

.grid-content {
  border-radius: 4px;
  max-height: 60px;
  line-height: 60px;
}

.avatar {
  border-radius: 10px;
  width: 42px;
  height: 42px;
  margin-top: 9px;
}

.logo {
  width: 180px;
  height: 59px;
}

</style>
