<template>
  <div id="app">
    <div class="main" v-title data-title="咖咖音乐">
    </div>
    <h1>咖咖音乐</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{

    }
  },
  components:{

  },
  methods:{
  },
  computed:{
  },
  created(){
  }
}
</script>

<style>
  html,body,#app{
    margin:0;
    padding: 0;
    width:100%;
    height:100%;
  }
  h1{
   display: none;
  }

</style>
