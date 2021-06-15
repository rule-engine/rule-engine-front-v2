<template>
  <div id="app">
    <div class="container">
      <h1>500 <span>:(</span></h1>
      <p>抱歉，服务器异常。</p>
      <p>可能原因:</p>
      <ul>
        <li>服务器拥挤</li>
        <li>没有网络,或者网络延迟比较高</li>
      </ul>
      <p>返回
        <router-link to="/home">首页</router-link>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Page500"
  }
</script>

<style scoped>
  ::-moz-selection {
    background: #b3d4fc;
    text-shadow: none;
  }

  ::selection {
    background: #b3d4fc;
    text-shadow: none;
  }

  #app {
    font-size: 20px;
    line-height: 1.4;
    color: #737373;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    background-color: #fcfcfc;
    max-width: 500px;
    _width: 500px;
    padding: 30px 20px 50px;
    border: 1px solid #b3b3b3;
    border-radius: 4px;
    margin: 30px auto;
    box-shadow: 0 1px 10px #a7a7a7, inset 0 1px 0 #fff;
  }

  #app,
  input {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  h1 {
    margin: 0 10px;
    font-size: 50px;
    text-align: center;
  }

  h1 span {
    color: #bbb;
  }

  p {
    margin: 1em 0;
  }

  ul {
    padding: 0 0 0 40px;
    margin: 1em 0;
  }

  .container {
    max-width: 380px;
    _width: 380px;
    margin: 0 auto;
  }

  a {
    text-decoration: none;
    color: #5798d4;
  }
</style>
