<template>
  <div class="main-container">
    <div class="app-box" v-if="this.$store.state.myLists">
      <mainView/>
    </div>
    <div class="songList-box" v-else-if="this.$store.state.songList">
      <songlist/>
    </div>
    <div class="play-container" v-else-if="this.$store.state.play">
      <play/>
    </div>
    <currentPlay/>
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  components:{
    "currentPlay":resolve => {
      require(['../components/currentPlay.vue'],resolve)
    },
    "songlist":resolve => {
      require(['../components/songList.vue'],resolve)
    },
    "mainView":resolve => {
      require(['../components/mainView.vue'],resolve)
    },
    "play":resolve => {
      require(['../components/play.vue'],resolve)
    },
  },
  watch:{
      '$store.state.nextSong'(){
        this.$store.state.play = false;
        this.$store.state.timer = window.clearInterval(this.$store.state.timer);
        this.$store.state.showTimer = window.clearInterval(this.$store.state.showTimer);
        this.$nextTick(function(){
           this.$store.state.play = true;
        })
      },
  },
  methods:{

  },
  computed:{
  },
  created(){
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .main-container,.play-container{
    width:100%;
    height:100%;
  }
  .app-box{
    width:100%;
    height:100%;
  }

</style>
