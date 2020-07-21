<template>
  <div class="play-container" :style="{'background-image':nowBg}">
    <div class="list-bg-cover"></div>
    <mt-header fixed  :title="songInfo.songName">
        <router-link to="" slot="left">
          <mt-button icon="back" @click.stop.prevent="showSongList"></mt-button>
        </router-link>
        <mt-button icon="more" slot="right" @click.stop.prevent="showLyric()"></mt-button>
    </mt-header>

    <div class="show-lyric-cover" v-if="isShowLyric">
      <div class="shutdown-showLyric" @click.stop.prevent="notShow()">+</div>
      <div class="show-lyric-box">
        <ul class="showLyricUl">
          <li class="show-lyrics" v-for="i in lyricInfo">{{i.lyric}}</li>
        </ul>
      </div>
    </div>

    <div class="control-volume-box">
      <img class="volume-img" src="../../../static/img/voice.png" alt="">
      <div class="volume-rate" id="volumeBox">
        <div class="volume-ind" id="volumeInd"></div>
        <div class="volume-size" id="volumeSize"></div>
      </div>
    </div>

    <div class="lyric-box">
      <div class="top-gradient"></div>
      <ul id="lyricUl">
        <li class="lyric-list" v-for="i,index in lyricInfo" :class="currentSentence == index?'active':'lyric-list'">{{i.lyric}}</li>
      </ul>
      <div class="bottom-gradient"></div>
    </div>

    <div class="control-rate-box">
      <div class="rate-time">{{currentTime}}</div>
      <div class="play-rate" id="playRateBox">
        <div class="play-ind" id="playInd"></div>
        <div class="played" id="played"></div>
      </div>
      <div class="total-time">{{totalTime}}</div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  export default{
    data(){
      return {
        nowBg:"",
        songInfo:"",
        isShowLyric:false,
        lyricInfo:"",
        currentSentence:0,
        timer:null,
        showTimer:null,
        totalTime:"00:00",
        currentTime:"00:00",
      }
    },
    watch:{
        '$store.state.isPlay'(){
          this.lyricPlay();
        },
    },
    methods:{
      showLyric(){
        if(this.isShowLyric === false){
          this.isShowLyric = true;
        }else{
          this.isShowLyric = false;
        }
      },
      notShow(){
        this.isShowLyric = false;
      },
      showSongList(){//返回
        this.$store.state.play = false;
        this.$store.state.songList = true;
        this.$store.state.timer = window.clearInterval(this.$store.state.timer);
        this.$store.state.showTimer = window.clearInterval(this.$store.state.showTimer);
      },
      //播放进度条和进度时间
      changeRateTime(){
        this.showTimer = window.clearInterval(this.showTimer);
        this.showCurrentTime();
        if(this.$store.state.isPlay){
          this.$store.state.showTimer = setInterval(this.showCurrentTime,1000);
        }else{
          this.$store.state.showTimer = window.clearInterval(this.$store.state.showTimer);
        }
      },
      //自动播放歌词
      lyricPlay(){

        this.lyricPlaying();
        if(this.$store.state.isPlay){
          this.$store.state.timer = setInterval(this.lyricPlaying,100);
        }else{
          this.$store.state.timer = window.clearInterval(this.$store.state.timer);
        }
      },
      //获取当前播放时间和进度变化
      showCurrentTime(){
        //播放时间变化
        var audio = document.getElementById("audio");
        var played = document.getElementById("played");
        var playInd = document.getElementById("playInd");
        var nowTime = audio.currentTime;
        var second = parseInt(nowTime%60);
        var minute = Math.floor(nowTime/60)
        if(second < 10){
          second = "0" + second;
        }
        if(minute < 10){
          minute = "0" + minute;
        }
        this.currentTime = minute + ":" + second;
        //进度条变化
        var scale = audio.currentTime / audio.duration;//比例
        if(this.$store.state.play == true){
          played.style.width = 100 * scale + "%";
          playInd.style.left = (100 * scale - 5) + "%";
        }
        //歌曲总时间
        var audio = document.getElementById("audio");
        var totalTime = audio.duration;
        var totalSecond = parseInt(totalTime%60);
        var totalMinute = Math.floor(totalTime/60);
        if(totalSecond < 10){
          totalSecond = "0" + totalSecond;
        }
        if(totalMinute < 10){
          totalMinute = "0" + totalMinute;
        }
        this.totalTime = totalMinute + ":" + totalSecond;
      },
      //随音频播放时间播放歌词
      lyricPlaying(){
        var lyricList = this.lyricInfo;
        var audio = document.getElementById("audio");
        var lyricUl = document.getElementById("lyricUl");
        for(var i=1;i<lyricList.length;i++){
          if(lyricList[i].time >= audio.currentTime && lyricList[i-1].time <= audio.currentTime){
          	this.currentSentence = i - 1;
          }
          if(lyricList[i].time > audio.currentTime && lyricList[i-1].time < (audio.currentTime-0.6)){
            if(i>5 && this.$store.state.play == true){
              lyricUl.style.top = -(i-5)*40+"px";
            }
          }
        }
      },
      //拖动/点击音量条
      handleVolume(){
        var volumeSize = document.getElementById("volumeSize");
        var volumeInd = document.getElementById("volumeInd");
        var volumeBox = document.getElementById("volumeBox");
        var audio = document.getElementById("audio");

        var moveX = 0;
        volumeInd.ontouchstart = function(e){
        	var that = this;
        	var touch = e.changedTouches[0];//是start的touch
        	moveX = touch.pageX - this.offsetLeft;//触摸位置的页面x距离 - 圆圈离进度条左边的距离 = 进度条左边离页面左边的距离
        	volumeBox.ontouchmove = function(e){
        		var touch = e.changedTouches[0];//是move的touch,不同的两个changedTouches属性
        		var M = touch.pageX - moveX;//拖动后的页面x距离 - 进度条左边离页面左边的距离 = 拖动后圆圈离进度条左边的距离
        		//限制最大最小值
        		if(M<0){
        			M = 0;
        		}else if(M>volumeBox.offsetWidth){
        			M = volumeBox.offsetWidth;
        		}
            //改变样式及调整播放时间
        		that.style.left = M + "px";
        		var scale = M / volumeBox.offsetWidth;//当前进度相对于整个进度条的比例
        		audio.volume = scale ;//拖动当前进度调整音量大小
        		volumeSize.style.width = scale * 100 + "%";//当前播放进度样式
        	}
        }
      },
      //拖动/点击进度条
      handleDrag(){
      	var played = document.getElementById("played");
      	var playInd = document.getElementById("playInd");
      	var playRateBox = document.getElementById("playRateBox");
      	var audio = document.getElementById("audio");

        //拖动进度条
        //思考：最终需要的是拖动拖动后圆圈离进度条左边的距离
      	var moveX = 0;
      	playInd.ontouchstart = function(e){
      		var that = this;
      		var touch = e.changedTouches[0];//是start的touch
      		moveX = touch.pageX - this.offsetLeft;//触摸位置的页面x距离 - 圆圈离进度条左边的距离 = 进度条左边离页面左边的距离
      		playRateBox.ontouchmove = function(e){
      			var touch = e.changedTouches[0];//是move的touch,不同的两个changedTouches属性
      			var M = touch.pageX - moveX;//拖动后的页面x距离 - 进度条左边离页面左边的距离 = 拖动后圆圈离进度条左边的距离
      			//限制最大最小值
      			if(M<0){
      				M = 0;
      			}else if(M>playRateBox.offsetWidth){
      				M = playRateBox.offsetWidth;
      			}
            //改变样式及调整播放时间
      			that.style.left = M + "px";
      			var scale = M / playRateBox.offsetWidth;//当前进度相对于整个进度条的比例
      			audio.currentTime = scale * audio.duration;//拖动当前进度对应到音频播放时间
      			played.style.width = scale * 100 + "%";//当前播放进度样式
            this.showCurrentTime();
      		}
      	}
        //点击进度条
        playRateBox.ontouchstart = function(e){
          var touch = e.changedTouches[0];
          moveX = touch.pageX - this.offsetLeft;
          if(moveX<0){
          	moveX = 0;
          }else if(moveX>this.offsetWidth){
          	moveX = this.offsetWidth;
          }
          playInd.style.left = moveX + "px";
          var scale = moveX / playRateBox.offsetWidth;
          audio.currentTime = scale * audio.duration;
          played.style.width = scale * 100 + "%";
          setTimeout(()=>{
            this.showCurrentTime();
          },400)
        }
      },
    },
    computed:{
      getPlaySongData(){
        var uId = localStorage.getItem("kakaUser");
        var songId = localStorage.getItem("currentSong");
        var api = "http://101.200.129.144/index.php";
        axios.post(api, qs.stringify({
          uId:uId,
          status:"getSongInfo",
          songId:songId
        })).then((res)=> {
          this.songInfo = res.data;
          this.nowBg = "url(" + res.data.songBgUrl + ")";
          //获取歌词
          var lyric = this.songInfo.songLyricUrl;
          if(lyric === ""){
            this.lyricInfo = ["暂无歌词"];
            return;
          }
          //分离歌词
          let result = [];
          let re = /\[([^\]]+)\]([^[]+)/g;
          //有一些第二个 : 是 . ,需要换回来
          var lyricList = lyric.replace(/\./g,':');
          lyricList.replace(re,($0, $1, $2)=> {
            var attr = $1.split(":");
            var time = (parseFloat(attr[0])*60+parseFloat(attr[1])*1+parseFloat(attr[2]*0.001)).toFixed(2);
          	result.push({
          		time: time,
          		lyric: $2
          	});
          })
          this.lyricInfo = result;
        })

      },
    },
    created(){
    },
    mounted(){
      this.getPlaySongData;
      this.lyricPlay();
      this.changeRateTime();
      this.handleDrag();
      this.handleVolume();
    },
  }
</script>

<style>
  @keyframes bgChange{
      from {background-color: rgba(51,51,51,.3);}
      to {background-color: rgba(51,51,51,.8);}
    }
    .play-container{
      width:100%;
      height:100%;
      background-position: center;
      background-size: cover;
    }
    .play-container .list-bg-cover{
      animation:bgChange 5s;
      width:100%;
      background-color: rgba(51,51,51,.8);
      height:100%;
      background-image: linear-gradient(rgba(0,0,0,.0), rgba(0,0,0,.4));
    }
    .mint-header{
      width:100%;
      height:6.25%;
      background: rgba(0,0,0,0);
      color:#fff;
    }
    .mint-header-button{
      color:#fff;
    }
    .mint-button--normal{
      right:6px;
    }
    .mint-header-title{
      line-height: 40px;
      display: block;
      font-size: 16px;
      color: #fafafa;
    }
    .show-lyric-cover{
      width:100%;
      height:100%;
      background:rgba(0,0,0,.8);
      position: absolute;
      z-index: 15;
      top:0;
      left: 0;
    }
    .shutdown-showLyric{
      position: absolute;
      top:15px;
      right:20px;
      font-size: 28px;
      transform: rotate(-45deg);
      z-index: 25;
      color:#eee;
    }
    .show-lyric-box{
      width:90%;
      height:100%;
      position: absolute;
      left:5%;
      top:5%;
      z-index: 20;
      overflow-y: auto;
    }
    .showLyricUl{
      width:100%;
      list-style: none;
      padding: 0;
      position: absolute;
      top:0;
      transition:all 0.8s;
    }
    .show-lyrics{
      color:#FFF;
      height:20px;
      font-size: 16px;
      margin:20px 0;
      text-align: center;
    }
    .control-volume-box{
      width:100%;
      height:24px;
      position: absolute;
      top:40px;
      left:0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .volume-img{
      width:18px;
      height:18px;
      margin-right: 10px;
    }
    .play-rate,.volume-rate{
      width:200px;
      height:2.5px;
      background: #aaa;
      position: relative;
    }
    .volume-ind,.play-ind{
      width:20px;
      height:20px;
      position: absolute;
      border-radius: 50%;
      top:-8.75px;
      left:190px;
      background: #eee;
    }
    .play-ind{
      left:-10px;
    }
    .played,.volume-size{
      height:100%;
      width:100%;
      background: #eee;
    }
    .played{
      width:0%;
    }
    .lyric-box{
      width:90%;
      height:76%;
      position: absolute;
      top:70px;
      left:5%;
      overflow: hidden;
    }
    #lyricUl{
      width:100%;
      list-style: none;
      padding: 0;
      position: absolute;
      top:0;
      transition:all 0.8s;
    }
    .lyric-list{
      color:rgba(200,200,200,.9);
      height:20px;
      font-size: 16px;
      margin:20px 0;
      text-align: center;
      transition:all 0.3s;
      overflow: hidden;
      width:100%;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    #lyricUl .active{
      color:rgb(255,152,208);
    }
    .control-rate-box{
      width:100%;
      height:24px;
      position: absolute;
      bottom:50px;
      left:0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .total-time,.rate-time{
      color:rgba(200,200,200,.5);
      font-size: 13px;
      margin:0 10px;
    }
    @media screen and (min-width: 768px) {
      .shutdown-showLyric{
        cursor: pointer;
      }
    
    }
</style>
