# rule-engine-front

> A Vue.js project

## Build Setup


### 项目安装(部署)
```bash
## clone the project source package
git clone  https://github.com/dingqianwen/rule-engine-front-v2

## The installation project depends on the extension component
npm install

# start the local development environment
npm run serve

## production environment construction project
npm run build

## build the project in the production environment and view the build report
npm run build --report
```

###### modify .env configuration information

```env
VUE_APP_API_BASE_URL=http://xxx.yourdomain.com
VUE_APP_WEB_SOCKET_URL=ws://xxx.yourdomain.com/socket.io
VUE_APP_WEBSITE_NAME="Lumen IM"
```

###### some configurations about Nginx
```nginx
server {
    listen       80;
    server_name  www.yourdomain.com;

    root /project-path/dist;
    index  index.html;

    ## solve the 404 problem of page refresh in VueRouter History mode
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

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
