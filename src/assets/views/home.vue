<template>
  <div class="home-box">

    <!-- 登录 -->
    <div v-if="isRegister" class="hadRegister-box">
      <div class="login-img-cover"></div>
      <div class="login-intf">
        <div class="logoc-box">
          <img class="logoc" src="../../../static/img/logoc.jpg" alt="" @click.stop="toHome()">
        </div>
        {{userName}}
        <p class="dianjidenglu">点击图标登录此帐号</p>
      </div>
    </div>

    <!-- 注册/切换账号 -->
    <div v-else class="login-box">
      <Register/>
    </div>
  </div>

</template>

<script>
export default {
  data(){
      return{
        isRegister:false,
        userName:""
      }
    },
    components:{
      "Register":resolve => {
        require(['../components/register.vue'],resolve)
      },
    },
    methods:{
      toHome(){
        var id = (Math.random()*100).toString() + this.userName;
        this.$router.push("/lists?user="+id);
      }
    },
    computed:{
      getLocalUser(){
        if(localStorage.getItem("kakaUser")){
          var userName = localStorage.getItem("kakaUser")
          this.userName = userName;
          this.isRegister = true;
        }else{
          this.isRegister = false;
        }
      }
    },
   
    created(){
      this.getLocalUser;
    }
  }
  </script>

<style>
.home-box{
      width:100%;
      height:100%;
    }
    .hadRegister-box{
      width:100%;
      height:100%;
      background-image: url(../../../static/img/bg-login.gif);
      background-size: cover;
    }
    .login-intf{
      height:80%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color:#fff;
    }
    .logoc-box{
      width:100px;
      height:100px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .logoc{
      width:100%;
      height:100%;
    }
    .dianjidenglu{
      color:#ccc;
      font-size: 13px;
    }
    @media screen and (min-width: 768px) {
        .login-img-cover{
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,.7);
        }
        .login-intf{
          position: absolute;
          left: 50%;
          top:50%;
          transform: translate(-50%,-50%);
        }
    }

</style>
