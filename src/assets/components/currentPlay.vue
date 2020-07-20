<template>
  <div class="nowPlay-box" @click.stop.prevent="toPlayPage()">
    <div class="play-left">
      <div class="song-img-box">
        <img class="songImg" :src="currentSong.songBgUrl" alt="">
      </div>
      <div class="song-text-box">
        <div class="now-song-name">{{currentSong.songName}}</div>
        <div class="now-song-singer">{{currentSong.singer}}</div>
      </div>
    </div>
    <div class="play-right">
      <img class="now-play-icon" :src="this.$store.state.isLiked" @click.stop.prevent="ifJoinToLike()" alt="">
      <img class="now-play-icon small" v-if="this.$store.state.play" src="../../../static/img/next.png"
       @click.stop.prevent="playNextSong()" alt="">
      <img class="now-play-icon" :src="isPlay" @click.stop.prevent="handlePlay()" alt="">
    </div>
    <audio id="audio" ref="audio" :src="currentSongUrl"></audio>
  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  import {Toast,Indicator } from 'mint-ui';
  export default{
    data(){
      return{
        currentSong:[],
        currentSongUrl:"",
        allThisListSong:"",
        uId:"",
        isLiked:"",
        isPlay:"../../../static/img/play.png",
      }
    },
    watch: {
      '$store.state.songId'(){
        this.getCurrentSong;
        setTimeout(()=>{
          this.handlePlay();
        },800)
      },
      '$store.state.toPause'(){
        if(this.$store.state.isPlay == true){
          this.handlePlay();
          this.isPlay = "../../../static/img/play.png";
        }
      }
    },
    methods:{
      playNextSong(){//点击下一曲播放下一曲
        this.playNext();
      },
      toPlayPage(){//前往play
        this.$store.state.myLists = false;
        this.$store.state.songList = false;
        this.$store.state.play = true;
      },
       //监听歌曲是否播放完成
       overPlay(){
         var that = this;
         var api = "http://101.200.129.144/index.php";
         var audio = document.getElementById("audio");
         audio.addEventListener('ended', function () {
           var songId = localStorage.getItem("currentSong");
            that.playNext();
            axios.post(api, qs.stringify({
              songId:songId,
              status:"setPlayBackTimes",
            })).then((res)=> {
            })
         }, false);
       },
       playNext(){
         this.isPlay = "../../../static/img/pause.png";//播放完一首歌切换暂停样式
         var that = this;
         var api = "http://101.200.129.144/index.php";
         var uId = this.uId;
         var lName = this.$store.state.lName;

         axios.post(api, qs.stringify({
           uId:uId,
           status:"getMyListAllSongId",
           listsName:lName
         })).then((res)=> {
           var nextSongId = "";
           var list = this.allThisListSong = res.data;
           var songId = localStorage.getItem("currentSong");
           if(this.$store.state.playType == "order"){//顺序播放
             for(var i=0;i<list.length;i++){
               if(list[i][0] == songId){
                 if(i == (list.length-1)){
                   nextSongId = list[0][0];
                   break;
                 }else{
                   nextSongId = list[i+1][0];
                   break;
                 }
               }
             }
           }else{//随机播放
             var randomNext = Math.floor(Math.random()*list.length+0);
             nextSongId = list[randomNext][0];
           }

           if(nextSongId !== ""){//传达重载指令
             localStorage.setItem("currentSong",nextSongId);
             this.$store.state.nextSong = nextSongId;
             that.getCurrentSong;
             setTimeout(()=>{
               that.handlePlay();
             },800)
           }else{
             if(this.$refs.audio.paused){
               this.isPlay = "../../../static/img/play.png";
             }
           }
         })
         // localStorage.setItem("kakaUser",)
       },
       //加入/移除我喜欢
       ifJoinToLike(){
         var uId = this.uId;
         var api = "http://101.200.129.144/index.php";
         var songId = this.currentSong.songId;
         var bg = this.currentSong.songBgUrl;
         //检查是否该歌曲在我喜欢中
         axios.post(api, qs.stringify({
           uId:uId,
           status:"getListInfo",
           songId:songId,
           listsName:"",
         })).then((res)=> {
           if(res.data == 1){
             //移除我喜欢
             axios.post(api, qs.stringify({
               uId:uId,
               status:"moveOut",
               songId:songId,
               listsName:"",
             })).then((res)=> {
                Toast({
                  message: '已移除喜欢！',
                  position: 'bottom',
                  duration: 2000,
                });
                this.$store.state.isLiked = "../../../static/img/like.png";
              })
           }else{
             //加入我喜欢
             axios.post(api, qs.stringify({
               uId:uId,
               status:"move",
               songId:songId,
               listsName:"",
               bg:bg,
             })).then((res)=> {
                Toast({
                  message: '已添加喜欢！',
                  position: 'bottom',
                  duration: 2000,
                });
                this.$store.state.isLiked = "../../../static/img/liked.png";
              })
           }

         })
       },
       //播放/暂停
       handlePlay(){
         if(this.$refs.audio.paused){
           audio.addEventListener("loadstart",function(){
             Indicator.open();
           },false);
           audio.addEventListener("canplay",function(){
             Indicator.close();
           },false);
           this.$refs.audio.play();
           this.isPlay = "../../../static/img/pause.png";
           this.$store.state.isPlay = true;
         }else{
           this.$refs.audio.pause();
           this.isPlay = "../../../static/img/play.png";
           this.$store.state.isPlay = false;
         }
       }
    },
    computed:{
      //获取当前歌曲信息（本地存储的id）
       getCurrentSong(){
         var api = "http://101.200.129.144/index.php";
         var uId = this.uId = localStorage.getItem("kakaUser");
         if(localStorage.getItem("currentSong")){
           this.currentSong = localStorage.getItem("currentSong");
           var songId = this.currentSong;
           axios.post(api, qs.stringify({
             uId:uId,
             status:"getSongInfo",
             songId:songId
           })).then((res)=> {
             this.currentSong = res.data;
             this.currentSongUrl = encodeURI(this.currentSong.songUrl);
           })
         }else{
           var bg = "http://101.200.129.144/kakamusic/gudu/kaka2001.jpg";
           localStorage.setItem("currentSong","kaka2001");
           this.currentSong = "kaka2001";
           var songId = this.currentSong;
           axios.post(api, qs.stringify({
             uId:uId,
             status:"move",
             songId:songId,
             listsName:"",
             bg:bg,
           })).then((res)=> {
             this.$store.state.isLiked = "../../../static/img/liked.png";
              axios.post(api, qs.stringify({
                uId:uId,
                status:"getSongInfo",
                songId:songId
              })).then((res)=> {
                this.currentSong = res.data;
                this.currentSongUrl = encodeURI(this.currentSong.songUrl);
              })
           })
         }

         //检查是否当前歌曲在我喜欢歌单中
         axios.post(api, qs.stringify({
           uId:uId,
           status:"getListInfo",
           songId:songId,
           listsName:""
         })).then((res)=> {
           if(res.data == 1){//如果在就更改样式
             this.$store.state.isLiked = "../../../static/img/liked.png";
           }else{
             this.$store.state.isLiked = "../../../static/img/like.png";
           }
         })
       }
    },
    created(){
      this.getCurrentSong;
    },
    mounted(){
      this.overPlay();
    }
  }
</script>

<style>
  .nowPlay-box{
    width:100%;
    height:7.03%;
    border-top:1px solid #ddd;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 203;
    background: #fafafa;
  }
  .play-left{
    float: left;
    width:50%;
    overflow: hidden;
  }
  .song-img-box{
    margin-top:3px;
    margin-left: 10px;
    width:38px;
    height: 38px;
    float: left;
    border-radius: 50%;
    overflow: hidden;
  }
  .songImg{
    width:38px;
  }
  .song-text-box{
    width:120px;
    overflow: hidden;
    white-space: nowrap;
  }
  .now-song-name,.now-song-singer{
    margin-top:5px;
    color:#666;
    height:20px;
    font-size: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width:100%;
    margin-left: 8px;
  }
  .now-song-singer{
    margin-top:0;
    font-size: 12px;
    color:#999;
  }
  .play-right{
    float:right;
    height:100%;
    width:40%;
  }
  .now-play-icon,.isLiked-icon{
    float: right;
    width:30px;
    height:30px;
    margin: 8px 10px;
  }
  .now-play-icon{
    margin-right: 6px;
  }
  .small{
    width:26px;
    height:26px;
    margin-left: 6px;
    margin-top:10px;
    line-height: 30px;
  }
</style>
