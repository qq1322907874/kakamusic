<template>
  <div class="app-box" @click.stop="hidePop()">
    <div class="main-view-container">
      <!-- 顶部两侧按钮 -->
      <div class="head-box">
        <h1>咖咖音乐</h1>
        <div class="my">
          <img class="my-icon" :src="headImg" alt="" @click.stop.prevent="showMy()">
        </div>
        <!-- 顶部导航按钮 -->
        <div class="main">
          <mt-navbar v-model="selected">
            <mt-tab-item id="1"><span class="nomalfont" :class="{'bigfont':selected=='1'}">歌单</span></mt-tab-item>
            <mt-tab-item id="2"><span class="nomalfont" :class="{'bigfont':selected=='2'}">推荐</span></mt-tab-item>
            <mt-tab-item id="3"><span class="nomalfont" :class="{'bigfont':selected=='3'}">分类</span></mt-tab-item>
          </mt-navbar>
        </div>
      </div>
          <!-- 顶部导航内容 -->
      <div class="bg">
        <mt-tab-container v-model="selected">
          <!-- 歌单 -->
          <mt-tab-container-item id="1" >
            <Swipe/>
            <myLists/>
          </mt-tab-container-item>
          <!-- 推荐 -->
          <mt-tab-container-item id="2">
            <Swipe/>
            <recommend/>
          </mt-tab-container-item>
          <!-- 分类 -->
          <mt-tab-container-item id="3">
            <Swipe/>
            <category/>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
      <div class="search">
        <img class="search-icon" src="../../../static/img/search.png" @click.stop.prevent="showSearch()" alt="">
        <div class="search-inp-box">
          <input type="text" class="search-inp" @input="searchSongs($event)"
           placeholder="请输入歌曲名/歌手" v-if="isShowSearch" ref="searchInp">
          <ul class="search-tip-box" v-if="showSearchTip">
            <li class="search-tip" v-for="item in searchRes" @click.stop.prevent="toPlayTheSong(item[0])">{{item[2]}} - {{item[1]}}</li>
          </ul>
        </div>
      </div>

      <div class="bigImg-box" v-if="bigImg">
        <div class="closeBigImg" @click.stop.prevent="closeBigImg">+</div>
        <img class="big-img" :src="headImg" id="bigHi" alt="">
      </div>

      <div class="my-box" v-if="isShowMy">
        <div class="my-info">
          <div class="my-headImg-box">
            <img class="my-headImg" id="hi" :src="headImg" @click.stop.prevent="showBigImg()" alt="">
            <div class="changeHeadImg">更换头像</div>
            <input type="file" accept="image/*" name="file" class="changeHeadImg opcity" id="file" multiple="multiple"
             @click.stop="donotCloseMy()" @change="changeHeadImg($event)">
          </div>
          <div class="my-id">{{uId}}</div>
        </div>
        <div class="my-set" @click.stop.prevent="preventClose()">
          <div class="opt autoStop">
            <div class="setStop-txt">定时停止/播放:
              <mt-picker :slots="slots" :visibleItemCount="1" @change="onValuesChange"></mt-picker>
              <div class="go-count-Down" @click.stop.prevent="goCountDown()">Go!</div>
            </div>
          </div>
          <div class="opt my-changeId">
            <button class="changeId" @click.stop.prevent="exitThisId()">切换/退出账号</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 获取头像 -->


  </div>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs';
  import {Toast } from 'mint-ui';
export default {
  data(){
    return{
      selected:"1",
      isShowSearch:false,
      keyword:"",
      searchRes:[],
      showSearchTip:false,
      isShowMy:false,
      uId:"",
      slots: [{
                flex: 1,
                values: ['0','15', '30', '45', '60'],
                className: 'slotMy',
                textAlign: 'right'
              }],
      setStopVal:0,
      showImgMenu:"",
      bigImg:false,
      headImg:"../../../static/img/my2.png",
    }
  },
  watch:{
  },
  components:{
    "Swipe":resolve => {
      require(['./swipe.vue'],resolve)
    },
    "myLists":resolve => {
      require(['./myLists.vue'],resolve)
    },
    "recommend":resolve => {
      require(['./recommend.vue'],resolve)
    },
    "category":resolve => {
      require(['./category.vue'],resolve)
    },
  },
  methods:{
    donotCloseMy(){//防止点击关闭my盒子，什么都不用写

    },
    preventClose(){

    },
    changeHeadImg(e){//保存用户上传的头像
      var that = this;
      var uId = this.uId;
      var reads = new FileReader(),
      f = document.getElementById('file').files[0];
      reads.readAsDataURL(f);
      var headImg = "";
      reads.onload = function(e) {
        var api = "http://101.200.129.144/index.php";
        that.headImg = this.result;
        headImg = this.result;
        axios.post(api, qs.stringify({
          uId:uId,
          status:"saveHeadImg",
          userImg:headImg,
        })).then((res)=> {
          if(res.data != 1){
            Toast({
              message: '头像上传失败！',
              position: 'bottom',
              duration: 2000,
            });
          }
        })
      };

    },
    showBigImg(){
      this.bigImg = true;
    },
    closeBigImg(){
      this.bigImg = false;
    },
    setTable(n){
      this.$store.state.selected = n
    },
    exitThisId(){//退出账号
      localStorage.clear();//清除所有本地存储
      this.$router.push("/");
    },
    goCountDown(){//定时停止播放
      var that = this;
      if(this.setStopVal == 0){
        return;
      }else{
        var second = parseInt(this.setStopVal * 60 * 1000);
        sessionStorage.setItem("waitTime",second);
        Toast({
          message: this.setStopVal+'分后停止播放！',
          position: 'bottom',
          duration: 2000,
        });
        setTimeout(function(){
          window.sessionStorage.removeItem("waitTime");
          that.$store.state.toPause = true;
        },second)
      }
    },
    hidePop(){//隐藏弹出
      this.isShowMy = false;
      this.showSearchTip = false;
    },
    onValuesChange(picker, values) {//获取定时
      this.setStopVal = values[0];
    },
    showMy(){//显示我的
      if(this.isShowMy == false){
        this.isShowMy = true;
      }
    },
    toPlayTheSong(id){//点击搜索结果前往播放
      localStorage.setItem("currentSong",id);
      this.showSearchTip = false;
      this.$store.state.songId = id;
      this.$store.state.myLists = false;
      this.$store.state.play = true;
    },
    searchSongs (e) {
      this.keyword = e.target.value.trim();
      //请求搜索的实时结果
      var keyword = e.target.value;
      this.showSearchTip = true;
      if(e.target.value.trim() == ""){
        return;
      }
      var api = "http://101.200.129.144/index.php";
      axios.post(api, qs.stringify({
        keyword:keyword,
        status:"getSearchWord",
      })).then((res)=> {
        this.searchRes = res.data;
      })
    },
    showSearch(){
      if(this.isShowSearch === false){
        this.isShowSearch = true;
        setTimeout(()=>{
          this.$refs.searchInp.focus();
        },800)
      }else{
        this.isShowSearch = false;
      }
    }
  },
  computed:{
    getHeadImg(){
      var uId = this.uId = localStorage.getItem("kakaUser");
      var api = "http://101.200.129.144/index.php";
      axios.post(api, qs.stringify({
        uId:uId,
        status:"getHeadImg",
      })).then((res)=> {
        if(res.data == 2){
          this.headImg = "../../../static/img/my2.png";
        }else{
          this.headImg = res.data;
        }
      })
    },
  },
  created(){
    this.getHeadImg;
  },
  mounted(){

  }
}
</script>

<style>
  @keyframes widthChange{
    from{width:0px;}
    to{width:220px;}
  }
  @keyframes myWidthChange{
    from{width:0px;}
    to{width:80%;}
  }
  .head-box{
    width:100%;
    position: fixed;
    top:0;
    background: #fff;
    left: 0;
    z-index: 200;
  }
  .main-view-container{
    width:100%;
    height: 100%;
  }
  .my{
    position: absolute;
    top:10px;
    left:15px;
  }
  .my-box{
    height:100%;
    position: fixed;
    z-index: 201;
    top:0;
    left: 0;
    width:80%;
    background: rgba(66,66,66,.99);
    animation:myWidthChange 0.4s;
  }
  .my-info{
    width:100%;
    height:13%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .my-headImg-box{
    margin-right: 10px;
    width:40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
  }
  .my-headImg{
    width:40px;
    height: 40px;
    border-radius: 50%;
  }
  .bigImg-box{
    width:100%;
    height:100%;
    position: absolute;
    top:0;
    left: 0;
    z-index: 204;
    background: rgba(0,0,0,.6);
  }
  .big-img{
    width:250px;
    position: absolute;
    transform: translate(-50%,-50%);
    top:50%;
    left:50%;
    height:250px;
  }
  .closeBigImg{
    position: absolute;
    top:20px;
    right: 25px;
    color:#eee;
    font-size: 28px;
    transform: rotate(-45deg);
  }
  .changeHeadImg{
    position: absolute;
    left:50px;
    bottom:-8px;
    font-size: 10px;
    height:20px;
    background-color: #26A2FF;
    border-radius: 4px;
    color:#eee;
    text-align: center;
    line-height: 20px;
    width:50px;
  }
  .opcity{
    opacity: 0.01;
  }
  .my-id{
    color:#fefefe;
    margin-bottom: 17px;
  }
  .my-set{
    padding:10px 0;
    box-sizing: border-box;
    height:87%;
    background: rgba(255,255,255,.95);
    border-radius: 24px;
  }
  .opt{
    width:90%;
    margin:20px 5%;
    height:30px;
    line-height: 30px;
    color:#666;
    font-weight: 600;
  }
  .autoStop{
    position: relative;
  }
  .picker-items{
    position: absolute;
    top:-2px;
    right:60px;
  }
  .go-count-Down{
    position: absolute;
    top:0;
    right:5px;
    color:#eee;
    text-align: center;
    border-radius: 4px;
    width:40px;
    height:100%;
    background: rgba(58,160,225,.9);;
  }
  .changeId{
    width:100%;
    height:40px;
    border:1px solid #ddd;
    border-radius: 6px;
    color:#eee;
    background: rgba(58,160,225,.9);
  }
  .changeId:focus{
    outline: none;
  }
  .search{
    position: fixed;
    z-index: 201;
    top:10px;
    right:20px;
  }
  .search-inp-box{
    position: absolute;
    width:200px;
    top:-1px;
    right: 40px;
  }
  .search-tip-box{
    width:220px;
    position: absolute;
    padding:0 10px;
    box-sizing: border-box;
    height:160px;
    overflow-y: auto;
    border:1px solid #ddd;
    margin:0;
    border-radius: 6px;
    top:36px;
    background: #fdfdfd;
    right: 0px;
    list-style: none;
  }
  .search-tip{
    color:#666;
    font-size: 14px;
    height:20px;
    margin:10px 0;
    width:100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .search-inp{
    position: absolute;
    animation:widthChange 0.4s;
    height:36px;
    font-size: 16px;
    width:220px;
    border:1.5px solid rgba(58,160,225,.9);
    border-radius: 6px;
    padding:0 15px;
    top:0px;
    right: 0px;
    box-sizing: border-box;
  }
  .search-inp:focus{
    outline: none;
  }
  .search-inp::placeholder{
    color:#ccc;
  }
  .my,.search,.my-icon,.search-icon{
    width:28px;
    height:28px;
  }
  .my,.my-icon{
    border-radius: 50%;
  }
  .search-icon{
    width:26px;
    height:26px;
  }
  .main{
    width:75%;
    margin: 0 12%;
  }
  .mint-navbar{
    height:7.3%;
  }
  .nomalfont{
    font-size: 14px;
  }
  .bigfont{
    font-size:15px;
  }
  .bg{
    height:92.7%;
    margin-top: 62px;
  }
  .mint-tab-container .mint-swipe{
    height:100px;
    width:90%;
    margin:10px 5%;
    border-radius: 8px;
  }
  .swipe{
    width:100%;
    height:100px;
  }
  
@media screen and (min-width: 768px) {
    @keyframes myWidthChange{
        from{width:0px;}
        to{width:20%;}
      }
      .head-box{
        width:100%;
        position: fixed;
        top:0;
        background: #fff;
        left: 0;
        z-index: 200;
      }

      .my{
        cursor: pointer;
        left:55px;
      }

    .closeBigImg{
    	cursor: pointer;
    }

    .search-tip{
      cursor: pointer;
    }

      .my-box{
        width:20%;
      }

      .big-img{
        width:60%;
        height:auto;
      }

      .nomalfont{
        cursor: pointer;
      }

      .go-count-Down{
        cursor: pointer;
      }

      .search{
        right:60px;
      }

      .mint-tab-container .mint-swipe{
        width:76%;
        margin:10px 12%;
        height: 170px;
        border-radius: 15px;
      }
      .swipe{
        width:100%;
        height: 300px;
      }
}

</style>
