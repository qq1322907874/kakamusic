import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const mutations={
}

const state =　{
  myLists:true,
  songList:false,
  play:false,
  lName:"",
  songId:"",
  isLiked:"",
  playType:"order",
  timer:null,
  showTimer:null,
  isPlay:true,
  toPause:false,
  nextSong:"",
  selected:"1",
  myAllListsName:[],
  sysList:"",
  categoryList:"",
}

export default new Vuex.Store({
  state,
  mutations
})
