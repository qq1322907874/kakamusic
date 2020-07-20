<template>
  <div>
    <div class="login-box-cover">
      <div class="register-box" v-if="isShowLogin">
        <h1>咖咖音乐</h1>
        <div class="logoh-box">
          <img class="logoh" src="../../../static/img/logoh.png" alt="">
        </div>
        <img class="logo-qita" src="../../../static/img/register.png" alt="">
        <input type="text" class="user-inp" placeholder="请输入手机号" v-model="uId" :onkeyup="uId=uId.replace(/[^\d]/,'')">
        <input type="password" class="user-inp" placeholder="请设置6-12位字母或数字的密码" v-model="uPswd"
          :onkeyup="checkPswd()">
        <input type="password" class="user-inp" placeholder="重新输入密码" v-model="reInp"
          :onkeyup="checkPswd()">
        <mt-button type="primary" class="register-btn" @click.native="getRegisterInfo()">注册</mt-button>
        <p class="to-login" @click.stop.prevent="showLogin()">切换账号登录点我</p>
      </div>

      <div class="register-box" v-else>
        <div class="logoh-box">
            <img class="logoh" src="../../../static/img/logoh.png" alt="">
        </div>
          <img class="logo-qita" src="../../../static/img/register.png" alt="">
          <input type="text" class="user-inp" placeholder="请输入手机号" v-model="uId" :onkeyup="uId=uId.replace(/[^\d]/,'')">
          <input type="password" class="user-inp" placeholder="请输入密码" v-model="uPswd" :onkeyup="checkPswd()">
          <mt-button type="primary" class="register-btn" @click.native="getLoginInfo()">登录</mt-button>
          <p class="to-login" @click.stop.prevent="showLogin()">切换注册点我</p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  import { Toast } from 'mint-ui';
  export default {
    data(){
      return{
        uPswd:"",
        uId:"",
        reInp:"",
        isShowLogin:true,
      }
    },
    methods:{
      showLogin(){
        if(this.isShowLogin == true){
          this.isShowLogin = false;
        }else{
          this.isShowLogin = true;
        }
      },
      getLoginInfo(){//登录
        var check = this.checkFormat();
        if(check == false){
          return;
        }else{
          var uId = this.uId;
          var uPswd = this.uPswd;
          var api = "http://101.200.129.144/index.php";
          axios.post(api, qs.stringify({
            uId:uId,
            status:"checkHadUserId"
          })).then((res)=> {
            if(res.data == 2){
              Toast({
                message: '该手机号未注册！',
                position: 'bottom',
                duration: 2000,
                className:'toast-failed'
              });
              return;
            }else{
              axios.post(api, qs.stringify({
                uId:uId,
                uPswd:uPswd,
                status:"login"
              })).then((res)=> {
                localStorage.setItem("kakaUser",uId);
                var id = (Math.random()*100).toString() + this.uId;
                this.$router.push("/lists?user="+id);
              })
            }
          })
        }
      },
      checkPswd(){
        this.uPswd = this.uPswd.replace(/[^(a-z,A-Z,0-9)]/,'');
        this.reInp = this.reInp.replace(/[^(a-z,A-Z,0-9)]/,'');
      },
      checkFormat(){
        if(this.uId.trim() === "" && this.uPswd.trim() === ""){
          Toast({
            message: '请输入手机号和密码！',
            position: 'bottom',
            duration: 2000,
            className:'toast-failed'
          });
          return false;
        }else if(this.uId.length !== 11){
            Toast({
              message: '手机号格式错误！',
              position: 'bottom',
              duration: 2000,
              className:'toast-failed',
            });
            return false;
        }else if(this.uPswd.length < 6 && this.uPswd.length > 12){
            Toast({
              message: '密码长度6-12位！',
              position: 'bottom',
              duration: 2000,
              className:'toast-failed',
            });
            return false;
        }else{
          return true;
        }
      },
      getRegisterInfo(){//注册并登录
        var check = this.checkFormat();
        if(check == false){
          return;
        }else if(this.uPswd !== this.reInp){
          Toast({
            message: '密码两次输入不一致！',
            position: 'bottom',
            duration: 2000,
            className:'toast-failed'
          });
        }else{
            var uId = this.uId;
            var uPswd = this.uPswd;
            var api = "http://101.200.129.144/index.php";
            axios.post(api, qs.stringify({
              uId:uId,
              status:"checkHadUserId"
            })).then((res)=> {
              if(res.data == 1){
                Toast({
                  message: '该手机号已被注册！',
                  position: 'bottom',
                  duration: 2000,
                  className:'toast-failed'
                });
                return;
              }else{
                axios.post(api, qs.stringify({
                  uId:uId,
                  uPswd:uPswd,
                  status:"register"
                })).then((res)=> {
                  if(res.data == 1){
                    Toast({
                      message: '注册成功！',
                      position: 'bottom',
                      duration: 2000,
                    });
                    localStorage.setItem("kakaUser",uId);
                    var id = (Math.random()*100).toString() + this.uId;
                    this.$router.push("/lists?user="+id);
                  }else{
                    Toast({
                      message: '账号入库失败！',
                      position: 'bottom',
                      duration: 2000,
                      className:'toast-failed'
                    });
                  }
                })
              }
            })

        }
      },

    },
    computed:{

    },
    created(){
    }

  }
</script>

<style>
  .login-box{
    width:100%;
    height:100%;
    background-image: url(../../../static/img/bg.gif);
    background-size: cover;
  }
  .login-box-cover{
    width:100%;
    height:100%;
    background-color: rgba(200,200,200,.1);
  }
  .register-box{
    height:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }
  .logoh-box{
    width:100%;
    margin-left: 30px;
    overflow: hidden;
    border-radius: 8px;
  }
  .logoh{
    margin-top:80px;
    width:100%;
  }
  .logo-qita{
    width:50%;
    margin:5px 0;
  }
  .user-inp{
    width:60%;
    margin-top:15px;
    height:32px;
    padding:0 15px;
    font-size: 15px;
    border:1px solid #ccc;
    border-radius: 6px;
  }
  .user-inp:first-of-type{
    margin-top:0px;
  }
  .user-inp:focus{
    outline: none;
  }
  .user-inp::placeholder{
    color:#ccc;
  }
  .register-btn{
    margin:15px 0;
    width:68%;
    border-radius: 8px;
  }
  .toast-failed{
    color:#ff5b45;
  }
  .to-login{
    width:100%;
    height:24px;
    margin-top:20px;
    color:rgba(58,160,225,.9);
    font-size: 15px;
    text-align: center;
    font-weight: 600;
  }
</style>
