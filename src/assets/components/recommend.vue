<template>
  <div class="recommend-container">
    <div class="carefully-chosen-box">
      <div class="cc-title-box">
        <h2 class="cc-h2">精选歌曲</h2>
      </div>
      <div class="cc-flex-box">
        <!-- 华语 -->
        <div class="cc" @click.stop.prevent="toSysSongList('huayu')">
          <div class="cc-img-box">
            <img src="../../../static/img/cn.jpg" class="cc-img" alt="">
            <div class="playTimes-box">
              <span class="playTimes-num">{{huayuTimes}}</span>
              <img class="pt-icon" src="../../../static/img/playTimes.png" alt=""/>
            </div>
          </div>
          <p class="cc-text">华语歌精选</p>
        </div>
        <!-- 英文 -->
        <div class="cc en-box" @click.stop.prevent="toSysSongList('en')">
          <div class="cc-img-box">
            <img src="../../../static/img/en.jpg" class="cc-img" alt="">
            <div class="playTimes-box">
              <span class="playTimes-num">{{enTimes}}</span>
              <img class="pt-icon" src="../../../static/img/playTimes.png" alt=""/>
            </div>
          </div>
          <p class="cc-text">英文歌精选</p>
        </div>
        <!-- 古风 -->
        <div class="cc" @click.stop.prevent="toSysSongList('gufeng')">
          <div class="cc-img-box">
            <img src="../../../static/img/gufeng.jpg" class="cc-img" alt="">
            <div class="playTimes-box">
              <span class="playTimes-num">{{gufengTimes}}</span>
              <img class="pt-icon" src="../../../static/img/playTimes.png" alt=""/>
            </div>
          </div>
          <p class="cc-text">古风精选</p>
        </div>
      </div>
    </div>
    <!-- 古风歌曲 -->
    <div class="gufeng-song-cc">
      <div class="cc-title-box">
        <h2 class="cc-h2 cc-song-title">长安街头的小吃摊,天桥下打伞的…</h2>
      </div>
      <!-- 歌曲 -->
      <div class="cc-song-item" v-for="item in gufengList" @click.stop.prevent="toPlay(item[0])">
        <img :src="item[4]" class="cc-song-img" alt="">
        <div class="cc-song-info">
          <p class="cc-song-name">{{item[1]}}</p>
          <p class="cc-singer">{{item[2]}}</p>
        </div>
        <img src="../../../static/img/play.png" alt="" class="playTheCcSong" @click.stop.prevent="nowPlay(item[0])">
      </div>
    </div>
    <!-- 英文歌曲 -->
    <div class="gufeng-song-cc">
      <div class="cc-title-box">
        <h2 class="cc-h2 cc-song-title">物是人非,神曲依旧--Faded</h2>
      </div>
      <!-- 歌曲 -->
      <div class="cc-song-item" v-for="item in enList" @click.stop.prevent="toPlay(item[0])">
        <img :src="item[4]" class="cc-song-img" alt="">
        <div class="cc-song-info">
          <p class="cc-song-name">{{item[1]}}</p>
          <p class="cc-singer">{{item[2]}}</p>
        </div>
        <img src="../../../static/img/play.png" alt="" class="playTheCcSong">
      </div>
    </div>
    <!-- 华语歌曲 -->
    <div class="gufeng-song-cc bottom-padding">
      <div class="cc-title-box">
        <h2 class="cc-h2 cc-song-title">像我这样年少有为的人…</h2>
      </div>
      <!-- 歌曲 -->
      <div class="cc-song-item" v-for="item in cnList" @click.stop.prevent="toPlay(item[0])">
        <img :src="item[4]" class="cc-song-img" alt="">
        <div class="cc-song-info">
          <p class="cc-song-name">{{item[1]}}</p>
          <p class="cc-singer">{{item[2]}}</p>
        </div>
        <img src="../../../static/img/play.png" alt="" class="playTheCcSong">
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  export default{
    data(){
      return {
        ccImg:"../../../static/img/logoc.png",
        gufengList:[],
        enList:[],
        cnList:[],
        huayuTimes:0,
        enTimes:0,
        gufengTimes:0,
      }
    },
    methods:{
      setActiveStyleSheet(filename){
        document.write("<link href="+filename+" rel=stylesheet>");
      },
      toSysSongList(t){
        this.$store.state.sysList = t;
        this.$store.state.songList = true;
        this.$store.state.myLists = false;
      },
      nowPlay(i){
        localStorage.setItem("currentSong",i);
        this.$store.state.songId = i;
      },
      toPlay(i){
        localStorage.setItem("currentSong",i);
        this.$store.state.songId = i;
        this.$store.state.play = true;
        this.$store.state.myLists = false;
      },
    },
    computed:{
      getActivity(){
        var api = "http://101.200.129.144/index.php";
        var uId = this.uId = localStorage.getItem("kakaUser");
        axios.post(api, qs.stringify({
          uId:uId,
          status:"getActivity",
        })).then((res)=> {
          this.gufengList = res.data.splice(0,4);
          this.enList = res.data.splice(0,4);
          this.cnList = res.data.splice(0,4);
        })
      },
      getPlayTimes(){
        var api = "http://101.200.129.144/index.php";
        axios.post(api, qs.stringify({
          status:"getSongPlayTimes",
        })).then((res)=> {
          var huayu = 0,
              en = 0,
              gufeng = 0;
          res.data.forEach((i)=>{
            if(i[0] == "huayu"){
              huayu = huayu + parseInt(i[1]);
            }else if(i[0] == "en"){
              en = en + parseInt(i[1]);
            }else if(i[0] == "gufeng"){
              gufeng = gufeng + parseInt(i[1]);
            }
          })
          this.huayuTimes = huayu;
          this.enTimes = en;
          this.gufengTimes = gufeng;
        })
      },
    },
    created(){
      this.getPlayTimes;
      this.getActivity;
    },
    mounted(){
    }
  }
</script>

<style>
.recommend-container{
    width:100%;
    padding:0 3%;
    box-sizing: border-box;
  }
  .cc-title-box{
    height: 24px;
  }
  .cc-h2{
    font-size: 16px;
    font-weight: 700;
    color:#333;
    margin-left: 2%;
  }
  .cc-flex-box{
    display: flex;
    width:100%;
    height:134px;
    margin-top:15px;
    justify-content: center;
  }
  .cc{
    width:27%;
  }
  .en-box{
    margin:0 7%;
  }
  .cc-img-box,.cc-img{
    width:100%;
    height:100px;
    border-radius: 8px;
    overflow: hidden;
  }
  .cc-img-box{
    position: relative;
  }
  .playTimes-box{
    width:100%;
    height:30px;
    background-image: linear-gradient(rgba(0,0,0,.0),rgba(0,0,0,.6));
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .pt-icon{
    width:15px;
    height:15px;
    float:right;
    margin-right: 2px;
    margin-top:10px;
  }
  .playTimes-num{
    font-size: 10px;
    color:#ddd;
    float: right;
    margin-top:11px;
    margin-right: 10px;
  }
  .cc-text{
    width:100%;
    height:24px;
    text-align: center;
    margin-top:4px;
    font-size: 13px;
    font-weight: 500;
  }
  .cc-song-item{
    width:100%;
  }
  .cc-song-title{
    overflow: hidden;
    margin:6px 0;
    font-size: 15px;
    font-weight: 600;
  }
  .cc-song-item{
    width:100%;
    height:50px;
    margin:10px 0;
  }
  .cc-song-img{
    width:50px;
    float: left;
    height: 50px;
    border-radius: 6px;
  }
  .cc-song-info{
    float: left;
    width:50%;
    height:50px;
    overflow: hidden;
  }
  .cc-song-name{
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    font-weight: 500;
    overflow: hidden;
    width:100%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .cc-song-info p{
    margin:0;
    margin-left: 6px;
  }
  .cc-singer{
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    color: #aaa;
    overflow: hidden;
    width:100%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .playTheCcSong{
    float:right;
    margin-right: 20px;
  }
  .playTheCcSong{
    width:24px;
    height: 24px;
    margin-top:13px;
  }
  .bottom-padding{
    padding-bottom: 50px;
  }

@media screen and (min-width: 768px) {
.recommend-container,.category-container{
    width:76%;
    margin:0 12%;
    padding: 0;
  }
  .cb{
    width:150px;
    height:190px;
    float:left;
    margin:0px 4%;
  }
  .cb:last-of-type{
    margin-bottom: 50px;
  }

  .cc-h2{
    margin-left: 0;
  }

  .cc-flex-box{
    height:190px;
  }

  .cc-flex-box .cc{
    width:16%;
    margin:0;
  }
  .cc:last-of-type{
    margin-right: 15%;
  }

  .cc-flex-box .en-box{
    margin:0 18%;
  }

  .cc-img-box,.cc-img{
    height:150px;
    border-radius: 12px;
  }

}

</style>
