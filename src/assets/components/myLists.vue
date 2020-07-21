<template>
  <div class="lists-container">
    <div class="title-lists">
      <h2>我的歌单</h2>
      <img class="new-lists-icon" src="../../../static/img/new.png" @click.stop.prevent="createNewLists()" alt="">
    </div>

    <div class="lists-box">
      <div class="lists" v-for="i in lists" @click.stop.prevent="toSongList(i[1])">
        <div class="lists-img-box">
          <img class="lists-img" :src="i[3] == ''?listsImg:i[3]" alt="">
        </div>
        <div class="lists-name">
          <div>{{i[1]}}</div>
          <div class="lists-count">{{i[2]}} 首</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  import {MessageBox,Toast } from 'mint-ui';
  export default {
    data(){
      return{
        lists:[],
        listsImg:"../../../static/img/logoc.png",
        uId:"",
        allListsName:[],
      }
    },
    methods:{
      toSongList(lName){
        this.$store.state.myLists = false;
        this.$store.state.songList = true;
        this.$store.state.lName = lName;
      },
      createNewLists(){
        MessageBox.prompt('请输入歌单名：').then(({ value, action }) => {
          var uId = this.uId;
          var lName = value.toString();
          var api = "http://101.200.129.144/index.php";
          axios.post(api, qs.stringify({
            uId:uId,
            status:"getLists",
            listsName:lName
          })).then((res)=> {
            if(res.data == 3){
              Toast({
                message: '目前最多能创建6个歌单！',
                position: 'bottom',
                duration: 2000,
                className:'toast-failed',
              });
              return;
            }else{
              this.lists = res.data;
            }
          })
        });
      },
      getListsData(lName){
        this.uId = localStorage.getItem("kakaUser");
        var uId = this.uId;
        var api = "http://101.200.129.144/index.php";
        axios.post(api, qs.stringify({
          uId:uId,
          status:"getLists",
          listsName:lName,
        })).then((res)=> {
          this.lists = res.data;
        })
        axios.post(api, qs.stringify({
          uId:uId,
          status:"getMyAllListsName",
        })).then((res)=> {
          this.allListsName = res.data;
          this.$store.state.myAllListsName = res.data;
        })
      }
    },
    computed:{

    },
    created(){
      this.getListsData("我喜欢的音乐");
      this.$store.state.selected = "1";
    },
    mounted(){

    }

  }
</script>

<style>
.toast-failed{
    color:#ff5b45;
  }
  .lists-container{
    margin:0 3%;
    width:94%;
   }
   .title-lists{
     width:100%;
     height:30px;
     line-height: 30px;
     margin-bottom: 8px;
     position: relative;
   }
   .lists-container h2{
      color:#333;
      font-size: 17px;
      line-height: 30px;
   }
   .new-lists-icon{
     width:24px;
     height:24px;
     position: absolute;
     right:15px;
     top:3px;
   }
   .lists-box{
     width:100%;
   }
   .lists{
     width:100%;
     height:60px;
     line-height: 60px;
     display: flex;
     color:#666;
     font-size: 14px;
     margin-bottom: 8px;
   }
   .lists-img-box,.lists-img{
     width:60px;
     height:60px;
     border-radius: 6px;
     margin-right: 5px;
   }
   .lists-name{
      width:80%;
      margin-top: 10px;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
   }
   .lists-count{
     font-size: 12px;
     color:#ccc;
   }
   @media screen and (min-width: 768px) {
     .lists-container{
       margin:0 12%;
       width:76%;
      }
      .mint-msgbox{
        width:30%;
      }
      .lists-name{
   	   cursor: pointer;
      }
   
   }
</style>
