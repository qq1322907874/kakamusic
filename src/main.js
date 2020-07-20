import Vue from 'vue';
import App from './App.vue';
import router from './router.js'
import store from './assets/store/store.js'

import { Indicator,Actionsheet,Picker,Header,InfiniteScroll,Toast,Button,Cell,Navbar, TabItem,TabContainer, TabContainerItem,Swipe, SwipeItem} from 'mint-ui';

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.use(InfiniteScroll);

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})

Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Picker.name, Picker);
Vue.component(Header.name, Header);
Vue.component(Toast.name, Toast);
Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem)

Vue.config.productionTip = false

new Vue(Vue.util.extend({el: '#app',store, router}, App))


// // The Vue build version to load with the `import` command
// // (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import App from './App'
// import router from './router'

// Vue.config.productionTip = false

// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
