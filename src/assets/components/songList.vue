<template>
  <div class="songList-box" @click.stop.prevent = "clickWhiteHide()">
    <div class="list-bg">
      <img class="list-bg-img" :src="bg" alt="">
      <div class="list-bg-cover"></div>
      <mt-header fixed  title="">
        <router-link to="/lists" slot="left">
          <mt-button icon="back" @click.stop.prevent="showMainView"></mt-button>
        </router-link>
        <mt-button icon="more" slot="right" @click.stop.prevent="showPlayType()"></mt-button>
      </mt-header>

      <div class="show-play-type" v-if="isShowPlayType">
        <p class="play-type" @click.stop.prevent="orderPlay()">顺序播放</p>
        <p class="play-type" @click.stop.prevent="randomPlay()">随机播放</p>
      </div>

      <div class="list-Name-box">
        <div class="list-img-box"><img class="list-img" :src="bg" alt=""></div>
        <div class="list-Name">
          <div class="listName">
              {{this.$store.state.lName}}
          </div>
          <div class="list-count">
           共 {{listLen}} 首
          </div>
        </div>
      </div>
    </div>
    <div class="my-list">
      <div class="play-mylist" @click.stop.prevent="playThisList()">
        <img class="play-mylist-icon" src="../../../static/img/play.png" alt="">
        开始播放
      </div>
      <ul class="list-ul">
        <li v-for="item,index in list" @click.stop.prevent="handleThisPlay(item)" :key="index">
            <div class="song-name">{{ item[1] }}</div>
            <div class="song-author">{{item[2]}} - {{ item[1] }}</div>
            <img class="song-opt" src="../../../static/img/option.png" alt="" @click.stop.prevent="showOption(item[0])">
        </li>
        <ul class="rightClick" v-if="isShowOption">
          <li class="lists-item-name" @click.stop.prevent="removeSongInThis()">从本歌单移除</li>
          <li class="lists-item-name" v-for="i in listItems" @click.stop.prevent="addToOther(i[1])">加入到{{i[1]}}</li>
        </ul>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  import {Toast } from 'mint-ui';
export default{
    data(){
      return{
        list:[],
        bg:'',
        listLen:0,
        uId:"",
        songId:"",
        songUrl:"",
        listItems:[],
        isShowOption:false,
        isShowPlayType:false,
      }
    },
    components:{
      "myLists":resolve => {
        require(['./myLists.vue'],resolve)
      },
    },
    methods:{
      playThisList(){//点击开始播放，播放此歌单
      var i = this.list[0]
        this.handleThisPlay(i);
      },
      orderPlay(){//传递顺序播放指令
        this.$store.state.playType = "order";
        this.isShowPlayType = false;
        Toast({
          message: '已切换为顺序播放！',
          position: 'bottom',
          duration: 2000,
        });
      },
      randomPlay(){//传递随机播放指令
        this.$store.state.playType = "random";
        this.isShowPlayType = false;
        Toast({
          message: '已切换为随机播放！',
          position: 'bottom',
          duration: 2000,
        });
      },
      //显示播放方式菜单
      showPlayType(){
        if(this.isShowPlayType === false){
          this.isShowPlayType = true;
        }else{
          this.isShowPlayType = false;
        }
      },
      clickWhiteHide(){//点击空白隐藏弹出的菜单
        this.isShowOption = false;
        this.isShowPlayType = false;
      },
      showOption(sId){
        if(this.isShowOption === false){
          this.isShowOption = true;
        }else{
          this.isShowOption = false;
        }
        this.songId = sId;
      },
      //加入到其他歌单
      addToOther(i){
        //是否是本歌单
        if(i == this.$store.state.lName){
          this.isShowOption = false;
          Toast({
            message: '请勿重复添加！',
            position: 'bottom',
            duration: 2000,
          });
          return;
        }
        //添加到歌单
        var uId = this.uId;
        var bg = this.bg;
        var songId = this.songId;
        var lName = i;
        var api = "http://101.200.129.144/index.php";
        axios.post(api, qs.stringify({
          uId:uId,
          status:"getListInfo",
          songId:songId,
          listsName:lName,
          bg:bg,
        })).then((res)=> {
          this.isShowOption = false;
          if(res.data == 2){
            axios.post(api, qs.stringify({
              uId:uId,
              status:"move",
              songId:songId,
              listsName:lName,
              bg:bg,
            })).then((resd)=> {
              if(resd.data == 1){
                if(lName == "我喜欢的音乐"){
                  this.$store.state.isLiked = "../../../static/img/liked.png";
                }
                Toast({
                  message: '已加入'+ i + '',
                  position: 'bottom',
                  duration: 2000,
                });
              }
            })
          }else{
            Toast({
              message: '请勿重复添加！',
              position: 'bottom',
              duration: 2000,
            });
            return;
          }
        })

      },
      //移除出此歌单
      removeSongInThis(){
        var api = "http://101.200.129.144/index.php";
        var songId = this.songId;
        var bg = this.bg;
        var uId = this.uId;
        var lName = this.$store.state.lName;
        axios.post(api, qs.stringify({
          uId:uId,
          status:"moveOut",
          songId:songId,
          listsName:lName,
          bg:bg,
        })).then((res)=> {
          this.isShowOption = false;
          if(res.data == 1){
            if(lName == "我喜欢的音乐"){
              this.$store.state.isLiked = "../../../static/img/like.png";
            }
            Toast({
              message: '已移除！',
              position: 'bottom',
              duration: 2000,
            });
          }
        })
      },
      handleThisPlay(i){//处理传给子组件的值
        localStorage.setItem("currentSong",i[0]);
        this.$store.state.songId = i[0];
        this.$store.state.songList = false;
        this.$store.state.play = true;
      },
      showMainView(){
        this.$store.state.myLists = true;
        this.$store.state.songList = false;
        this.$store.state.sysList = "";
        this.$store.state.categoryList = "";
      },
      //获取歌单的歌曲列表
      getSongList(){
        var lName = this.$store.state.lName;
        this.uId = localStorage.getItem("kakaUser");
        var uId = this.uId;
        var api = "http://101.200.129.144/index.php";
        axios.post(api, qs.stringify({
          uId:uId,
          status:"getMySongInfo",
          listsName:lName
        })).then((res)=> {
            this.list = res.data;
            var list = this.list;
            this.listLen = this.list.length;
            var lastInd = this.list.length - 1;
            if(lastInd > 0){
              this.bg = list[lastInd][4];
            }
            if(list.length === 1){
              this.bg = list[0][4];
            }
        })
      },
    },
    computed:{
      getSysSongList(){
        if(this.$store.state.sysList == ""){
        }else if(this.$store.state.sysList.indexOf("category") == -1){
          var api = "http://101.200.129.144/index.php";
          var sysListName = this.$store.state.sysList;
          axios.post(api, qs.stringify({
            status:"getSysListSongInfo",
            jingxuan:sysListName
          })).then((res)=> {
            this.list = res.data;
            this.listLen = res.data.length;
            //歌单
            if(this.$store.state.sysList == "huayu"){
              this.$store.state.lName = "精选华语歌曲"
              this.bg = "../../../static/img/cn.jpg";
            }else if(this.$store.state.sysList == "en"){
              this.$store.state.lName = "精选英文歌曲"
              this.bg = "../../../static/img/en.jpg";
            }else if(this.$store.state.sysList == "gufeng"){
              this.$store.state.lName = "精选古风歌曲"
              this.bg = "../../../static/img/gufeng.jpg";
            }else if(this.$store.state.sysList == "shengdian"){
              this.$store.state.lName = "音乐盛典"
              this.bg = "../../../static/img/shengdian2.jpg";
            }else if(this.$store.state.sysList == "summer"){
              this.$store.state.lName = "音风之夏"
              this.bg = "../../../static/img/summer.jpg";
            }else if(this.$store.state.sysList == "dinner"){
              this.$store.state.lName = "把孤独当做晚餐"
              this.bg = "../../../static/img/dinner.jpg";
            }
          })
        }
      },
      getCategorySong(){
        if(this.$store.state.categoryList !== ""){
          var songType = this.$store.state.categoryList.split("category-")[1];
          var api = "http://101.200.129.144/index.php";
          var categoryListName = this.$store.state.categoryList;
          axios.post(api, qs.stringify({
            status:"getCategorySong",
            songType:songType,
          })).then((res)=> {
            this.list = res.data;
            this.listLen = res.data.length;
            //分类歌曲
            if(categoryListName == "category-douyin"){
              this.$store.state.lName = "抖音歌曲"
              this.bg = "../../../static/img/douyin.jpg";
            }else if(categoryListName == "category-shanggan"){
              this.$store.state.lName = "伤感"
              this.bg = "../../../static/img/shanggan.jpg";
            }else if(categoryListName == "category-en"){
              this.$store.state.lName = "英文歌曲"
              this.bg = "../../../static/img/en.jpg";
            }else if(categoryListName == "category-gufeng"){
              this.$store.state.lName = "古风"
              this.bg = "../../../static/img/gufeng.jpg";
            }else if(categoryListName == "category-gudu"){
              this.$store.state.lName = "孤独"
              this.bg = "../../../static/img/gudu2.jpg";
            }else if(categoryListName == "category-qinggan"){
              this.$store.state.lName = "情感"
              this.bg = "../../../static/img/qinggan.jpg";
            }else if(categoryListName == "category-aiqing"){
              this.$store.state.lName = "爱情"
              this.bg = "../../../static/img/aiqing.jpg";
            }else if(categoryListName == "category-zhange"){
              this.$store.state.lName = "战歌"
              this.bg = "../../../static/img/zhange.jpg";
            }else if(categoryListName == "category-anjing"){
              this.$store.state.lName = "安静"
              this.bg = "../../../static/img/anjing.jpg";
            }
          })
        }
      },
      getListItems(){
        this.listItems = this.$store.state.myAllListsName;
      },
      //滑动指定距离加载
      loadMore() {
        if(this.list.length <= 10){
          return;
        }else{
          setTimeout(() => {
            let last = this.list[this.list.length - 1];
            for (let i = 1; i <= 10; i++) {
              this.list.push(last + i);
            }
          }, 2500);
        }
      }
    },
    created(){
      setTimeout(()=>{
        this.getSysSongList;
        this.getCategorySong;
      },200)
      this.getSongList();
      this.getListItems;
    }
}
</script>

<style>
@keyframes positionChange{
    from {top:0;left:0;}
    to {top:-100px;left:0;}
  }
  @keyframes bgChange{
    from {background-color: rgba(51,51,51,.3);}
    to {background-color: rgba(51,51,51,.8);}
  }
  .songList-box{
    width:100%;
    height:100%;
  }
  .mint-header{
    width:100%;
    height:40px;
    background: rgba(0,0,0,0);
    color:#fff;
  }
  .mint-header-button{
    color:#fff;
  }
  .mint-button--normal{
    right:6px;
  }
  .show-play-type{
    position: absolute;
    width:60px;
    height:70px;
    font-size: 13.5px;
    border:1px solid #ddd;
    color:#666;
    border-radius: 6px;
    background: #fefefe;
    top:35px;
    right:10px;
    z-index: 40;
  }
  .play-type{
    text-align: center;
    height:20px;
    margin:10px 0;
  }
  .list-bg{
    width:100%;
    height:28%;
    overflow: hidden;
    position: relative;
  }
  .list-bg-img{
    position: absolute;
    top:-100px;
    left:0;
    z-index: -1;
    animation:positionChange 6s;
    width:100%;
  }
  .list-bg-cover{
    animation:bgChange 5s;
    width:100%;
    height:100%;
    background-color: rgba(51,51,51,.8);
  }
  .list-Name-box{
    width:220px;
    height: 60px;
    position: absolute;
    top:60px;
    left:60px;
  }
  .list-img-box{
    width:60px;
    height:60px;
    float:left;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 10px;
  }
  .list-img{
    width:60px;
  }
  .list-Name{
    width:150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color:#ddd;
    font-size: 18px;
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .listName,.list-count{
    height:24px;
    margin-top:5px;
  }
  .list-count{
    font-size: 14px;
    color:#bbb;
  }
  .play-mylist{
    height:7.5%;
    align-items: center;
    display: flex;
    font-size: 16px;
    font-weight: 600;
    margin:3.5% 0;
  }
  .play-mylist-icon{
    width:20px;
    height:20px;
    margin: 0 10px;
  }
  .my-list{
    height: 72%;
    padding-bottom: 50px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .songList-box .list-ul{
    height: 84.5%;
    list-style: none;
    margin:0;
    padding:0;
    margin-left: 10px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .songList-box .list-ul li{
    height:40px;
    line-height: 40px;
    margin: 12px;
    position: relative;
    overflow: hidden;
  }
  .song-name,.song-author{
    width:80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height:20px;
    font-size: 15px;
    line-height: 20px;
  }
  .song-author{
    display: block;
    font-size: 12px;
    color:#999;
    font-weight: 300;
  }
  .song-opt{
    width:20px;
    height:20px;
    position: absolute;
    top:10px;
    right:10px;
  }
  .rightClick{
    position: absolute;
    top:50%;
    padding:0;
    left:50%;
    transform: translate(-50%,-50%);
    text-align: center;
    width:200px;
    border:1px solid #ddd;
    border-radius: 6px;
    font-weight: 500;
    background: #fefefe;
    font-size: 14px;
    color:rgba(0,204,255,.5);
  }
  .songList-box ul .lists-item-name{
    width:200px;
    overflow: hidden;
    margin:0;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px solid #ddd;
    height:40px;
    line-height: 40px;
  }
  .songList-box ul .lists-item-name:nth-of-type(1){
    color:#FF5B45;
  }
  .songList-box ul .lists-item-name:last-of-type{
    border-bottom: none;
  }
  @media screen and (min-width: 768px) {
    @keyframes positionChange{
        from {top:0;left:0;}
        to {top:-400px;left:0;}
      }
      .list-bg{
        height:40%;
      }
      .list-bg-img{
        top:-400px;
      }
      .list-Name-box{
        top:90px;
        left:160px;
      }
      .play-mylist{
        height:5%;
        cursor: pointer;
        margin:2% 0 1% 0;
      }
      .my-list{
        height: 60%;
      }
      .lists-item-name,.play-type,.song-name,.song-author,.play-mylist{
        cursor: pointer;
      }
  }
</style>
