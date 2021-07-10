
# 📌 规则引擎前端 RuleEngine 📌

[![License](https://img.shields.io/badge/license-Apache%202-4EB1BA.svg)](https://www.apache.org/licenses/LICENSE-2.0.html)
[![GitHub Stars](https://img.shields.io/github/stars/dingqianwen/rule-engine-front-v2)](https://github.com/dingqianwen/rule-engine-front-v2/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/dingqianwen/rule-engine-front-v2)](https://github.com/dingqianwen/rule-engine-front-v2/fork)
[![GitHub issues](https://img.shields.io/github/issues/dingqianwen/rule-engine-front-v2.svg)](https://github.com/dingqianwen/rule-engine-front-v2/issues)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/dingqianwen/rule-engine-front-v2.svg)](https://github.com/dingqianwen/rule-engine-front-v2/issues "Percentage of issues still open")

#### 业务逻辑实现不再依赖于代码开发，可零代码实现复杂业务逻辑。

后端代码地址：... <br>
项目展示地址：http://ruleengine.cn/

##### 联系方式：

- QQ：761945125
- Email：761945125@qq.com

### 技术文档

简单使用：... <br>
详细文档：http://ruleengine.cn/doc

### 技术栈/版本介绍：

- 所涉及的相关的技术有：
  - Vue
  - Element-ui

## Build Setup


### 项目安装(部署)
###### 设置 npm 镜像源
```language
npm config set registry https://registry.npm.taobao.org
```

###### 下载安装
```bash
## 克隆项目源码包
git clone https://github.com/dingqianwen/rule-engine-front-v2

## 安装项目依赖扩展组件
npm install

# 启动本地开发环境
npm run serve

## 生产环境构建项目
npm run build

## 生产环境构建项目并查看构建报告
npm run build --report
```

###### 修改 .env 配置信息

```env
#web服务的
WEB_BASE_URL=http://xxx.yourdomain.com
#计算服务的
COMPUTE_BASE_URL=http://xxx.yourdomain.com:8011 
```

###### 关于 Nginx 的一些配置
```nginx
server {
    listen       80;
    server_name  www.yourdomain.com;

    root /project-path/dist;
    index  index.html;

    ## 解决 VueRouter History 模式下 页面刷新404问题
    location / {
      try_files $uri $uri/ /index.html;
    }

    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|ico)$ {
        expires 7d;
    }

    location ~ .*\.(js|css)?$ {
        expires 7d;
    }
}
```



### 如果觉得本项目对您有任何一点帮助，请点右上角 "Star" 支持一下， 并向您的基友、同事们宣传一下吧，谢谢！

