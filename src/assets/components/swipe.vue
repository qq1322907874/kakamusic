<template>
  <mt-swipe :auto="3000">
    <mt-swipe-item>
      <img class="swipe" src="../../../static/img/shengdian.jpg" @click.stop.prevent="toSwipeSongList('shengdian')" alt=""/>
    </mt-swipe-item>
    <mt-swipe-item>
      <img class="swipe" src="../../../static/img/xia.jpg" @click.stop.prevent="toSwipeSongList('summer')" alt=""/>
    </mt-swipe-item>
    <mt-swipe-item>
      <img class="swipe" src="../../../static/img/gudu.jpg" @click.stop.prevent="toSwipeSongList('dinner')" alt=""/>
    </mt-swipe-item>
  </mt-swipe>
</template>

<script>
  export default{
    data(){
      return {

      }
    },
    methods:{
      toSwipeSongList(t){
        this.$store.state.sysList = t;
        this.$store.state.songList = true;
        this.$store.state.myLists = false;
      }
    }
  }
</script>

<style>
</style>
