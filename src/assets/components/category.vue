<template>
  <div class="category-container">
    <!-- 抖音 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-douyin')">
      <img src="../../../static/img/douyin.jpg" class="cc-img" alt="">
      <p class="cc-text">抖音</p>
    </div>
    <!-- 伤感 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-shanggan')">
      <img src="../../../static/img/shanggan.jpg" class="cc-img" alt="">
      <p class="cc-text">伤感</p>
    </div>
    <!-- 英文 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-en')">
      <img src="../../../static/img/en.jpg" class="cc-img" alt="">
      <p class="cc-text">英文</p>
    </div>
    <!-- 古风 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-gufeng')">
      <img src="../../../static/img/gufeng.jpg" class="cc-img" alt="">
      <p class="cc-text">古风</p>
    </div>
    <!-- 孤独 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-gudu')">
      <img src="../../../static/img/gudu2.jpg" class="cc-img" alt="">
      <p class="cc-text">孤独</p>
    </div>
    <!-- 情感 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-qinggan')">
      <img src="../../../static/img/qinggan.jpg" class="cc-img" alt="">
      <p class="cc-text">情感</p>
    </div>
    <!-- 爱情 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-aiqing')">
      <img src="../../../static/img/aiqing.jpg" class="cc-img" alt="">
      <p class="cc-text">爱情</p>
    </div>
    <!-- 战歌 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-zhange')">
      <img src="../../../static/img/zhange.jpg" class="cc-img" alt="">
      <p class="cc-text">战歌</p>
    </div>
    <!-- 安静 -->
    <div class="cc" @click.stop.prevent="toCategoryListSong('category-anjing')">
      <img src="../../../static/img/anjing.jpg" class="cc-img" alt="">
      <p class="cc-text">安静</p>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return {

      }
    },
    methods:{
      toCategoryListSong(t){
        this.$store.state.categoryList = t;
        this.$store.state.songList = true;
        this.$store.state.myLists = false;
      },
    },
    created(){
      this.$store.state.selected = "3";
    }
  }
</script>

<style>
  .cc{
    float:left;
    margin:0px 3%;
  }
</style>
